package Sign;

import db.PostgresConnection;
import org.json.JSONObject;
import passwordConvertor.SymmetricConvertor;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/signUp")
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArr = new byte[1024];
        int inputLen = 0 ;
        String reqData = null ;
        while ( ( inputLen = input.readLine(bytesArr,0,bytesArr.length) ) != -1 ) {
            reqData = new String(bytesArr,0,inputLen, StandardCharsets.UTF_8);
        }
        System.out.println(reqData);
        int id = addNewUser(new JSONObject(reqData));
        JSONObject result = new JSONObject();
        result.put("result",(id!=-1)?"success":"failure");
        output.write(result.toString().getBytes());
    }

    public int addNewUser(JSONObject data) {
        String query = "insert into \"user\" ( user_name , email ) values ( ? , ? ) ; " ;
        try (Connection conn = PostgresConnection.getConnection()) {
            // User SetUp

            PreparedStatement prepStatement = conn.prepareStatement(query);
            prepStatement.setString(1,data.getString("user_name"));
            prepStatement.setString(2,data.getString("email"));
            prepStatement.executeUpdate();
            query = "select user_id from \"user\" where user_name = ?" ;
            prepStatement = conn.prepareStatement(query);
            prepStatement.setString(1,data.getString("user_name"));
            ResultSet rsData = prepStatement.executeQuery();
            int user_id = -1 ;
            if ( rsData.next() ) {
                user_id = rsData.getInt(1);
            }

            if ( user_id == -1 ) return -1 ;

            //   Keys SetUp

            String[] keys = new String[2];
            getNewKeys(keys);
            SymmetricConvertor symmetricConvertor = new SymmetricConvertor();
            keys[1] = symmetricConvertor.encrption(keys[1],data.getString("master_pass"));
            query = "insert into key ( public_key , private_key ) values ( ? , ? ) ; " ; // Insertion Query for Keys
            prepStatement = conn.prepareStatement(query);
            prepStatement.setString(1,keys[0]);
            prepStatement.setString(2,keys[1]);
            prepStatement.executeUpdate();
            query = "select key_id from \"key\" where public_key = ? ;" ;
            prepStatement = conn.prepareStatement(query);
            prepStatement.setString(1,keys[0]);
            rsData = prepStatement.executeQuery();
            int key_id = 0 ;
            if (rsData.next() ) {
                key_id = rsData.getInt(1);
            }
            //  Update the key_id in the curresponding user_id
            query = "update \"user\"" +
                    "set key_id = ?" +
                    "where user_id = ?" ;
            prepStatement = conn.prepareStatement(query);
            prepStatement.setInt(1,key_id);
            prepStatement.setInt(2,user_id);
            prepStatement.executeUpdate();
            conn.close();
            return user_id;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return -1 ;
    }


    public void getNewKeys(String[] arr) {
        ProcessBuilder pb = new ProcessBuilder("bash","-c","age-keygen");
        try {
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = null ;
            int i = 0 ;
            while ( (line = reader.readLine()) != null ) {
                if ( i == 1 ) {
                    arr[0] = line.substring("# public key: ".length()).trim() ;
                }
                if ( i == 2 ) {
                    arr[1] = line.trim() ;
                }
                i++;
            }
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }



}
