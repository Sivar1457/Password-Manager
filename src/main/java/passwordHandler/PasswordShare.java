package passwordHandler;

import db.PostgresConnection;
import org.json.JSONObject;
import passwordConvertor.AsymmetricConvertor;
import passwordConvertor.SymmetricConvertor;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/passShare")
public class PasswordShare extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int requestLen = 0 ;
        String requestData = null ;
        while ( (requestLen = input.readLine(bytesArray,0,bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,requestLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        String query = "select pass from \"password_container\" where pass_id = ? " ;
        JSONObject jsonResponse = new JSONObject();
        try (Connection conn = PostgresConnection.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonRequest.getInt("pass_id"));
            ResultSet data = preparedStatement.executeQuery();
            data.next();
            String pass = data.getString(1);
            query = "select * from \"key\" where key_id = (select key_id from \"user\" where user_id = (select owner_id from \"password_container\" where pass_id = ?));" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonRequest.getInt("pass_id"));
            data = preparedStatement.executeQuery();
            data.next();
            String user1PrivateKey = data.getString("private_key");
            String user1PublicKey = data.getString("public_key");
            query = "select u.* , k.* from \"key\" k join \"user\" u on u.user_name = ? where k.key_id = u.key_id";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,jsonRequest.getString("user_name"));
            data = preparedStatement.executeQuery();
            data.next();
            String user2PublicKey = data.getString("public_key");
            int user2Id = data.getInt("user_id");
            SymmetricConvertor symmetricConvertor = new SymmetricConvertor();
            String decryptKey = symmetricConvertor.decryptValue(user1PrivateKey, jsonRequest.getString("master_pass"));
            AsymmetricConvertor asymmetricConvertor = new AsymmetricConvertor();
            String decryptPass = asymmetricConvertor.decryption(pass,decryptKey);
            query = "select k.public_key from \"key\" k\n" +
                    "join \"shared_pass_relation\" r on r.pass_id = ?\n" +
                    "join \"user\" u on u.user_id = r.user_id\n" +
                    "where k.key_id = u.key_id ;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonRequest.getInt("pass_id"));
            data = preparedStatement.executeQuery();
            List<String> publicKeys = new ArrayList<>();
            while ( data.next() ) {
                publicKeys.add(data.getString(1));
            }
            publicKeys.add(user1PublicKey);
            publicKeys.add(user2PublicKey);
            String newPass = asymmetricConvertor.encryption(decryptPass,publicKeys);
            query = "update \"password_container\"" +
                    "\nset pass = ? " +
                    " \nwhere pass_id = ? ;";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,newPass);
            preparedStatement.setInt(2,jsonRequest.getInt("pass_id"));
            preparedStatement.executeUpdate();
            query = String.format("insert into \"shared_pass_relation\" ( pass_id , user_id ) values ( %d , %d ) ;",jsonRequest.getInt("pass_id"),user2Id);
            Statement statement = conn.createStatement();
            statement.executeUpdate(query);
            if ( !decryptPass.trim().isEmpty() ) {
                jsonResponse.put("result", "success");
                output.write(jsonResponse.toString().getBytes());
                return;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        jsonResponse.put("result","failure");
        output.write(jsonResponse.toString().getBytes());
    }
}
