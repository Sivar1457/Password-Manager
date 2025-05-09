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
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/signIn")
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int inputLen = 0 ;
        String requestData = null ;
        while ( (inputLen = input.readLine(bytesArray , 0 , bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,inputLen, StandardCharsets.UTF_8);
        }
        int user_id = checkWithUserData(requestData);
        JSONObject result = new JSONObject();
        if ( user_id != -1 ) {
            String query = "select user_name from \"user\" where \"user_id\" = ? ;" ;
            Connection conn = PostgresConnection.getConnection();
            String userName = null ;
            try {
                PreparedStatement preparedStatement = conn.prepareStatement(query);
                preparedStatement.setInt(1,user_id);
                ResultSet data = preparedStatement.executeQuery();
                if (data.next() ) {
                    userName = data.getString("user_name");
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            HttpSession session = req.getSession(false);
            session.setAttribute("user_name",userName);
            result.put("user_name",userName);
        }
        result.put("result",(user_id != -1)?"success":"failure");
        output.write(result.toString().getBytes());
    }

    public int checkWithUserData(String data){
        JSONObject jsonData = new JSONObject(data);
        String type = jsonData.getString("type");
        String query = String.format("select * from \"user\" where %s = ? ",type);
        Connection conn = PostgresConnection.getConnection();
        try {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, jsonData.getString(type));
            ResultSet dataResult = preparedStatement.executeQuery();
            if (dataResult.next()) {
                int user_id = dataResult.getInt("user_id");
                int key_id = dataResult.getInt("key_id");
                query = "select private_key from \"key\" where key_id = ? " ;
                preparedStatement = conn.prepareStatement(query);
                preparedStatement.setInt(1,key_id);
                dataResult = preparedStatement.executeQuery();
                if ( dataResult.next() ) {
                    String private_key = dataResult.getString(1);
                    SymmetricConvertor symmetricConvertor = new SymmetricConvertor();
                    if (symmetricConvertor.decryption(private_key, jsonData.getString("master_pass")) ){
                        return user_id;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return -1 ;
    }
}
