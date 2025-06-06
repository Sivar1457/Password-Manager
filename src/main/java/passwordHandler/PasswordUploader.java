package passwordHandler;

import db.PostgresConnection;
import org.json.JSONObject;
import passwordConvertor.AsymmetricConvertor;

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
import java.sql.Timestamp;
import java.time.LocalDateTime;

@WebServlet("/passUpload")
public class PasswordUploader extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int inputLen = 0 ;
        String requestData = null ;
        while ( ( inputLen = input.readLine(bytesArray,0, bytesArray.length) ) != -1 ) {
            requestData = new String(bytesArray,0,inputLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        HttpSession session = req.getSession(false);
        int pass_id = -2 ;
        JSONObject result = new JSONObject();
        if ( jsonRequest.getString("current_user_name").equals(session.getAttribute("user_name")) ) {
            if ( jsonRequest.getString("inCode").equals((String)session.getAttribute("inCode")) ) {
                pass_id = upload(jsonRequest);
                session.setAttribute("inCode","");
                result.put("notification","no");
            }
        }
        else {
            result.put("notification","yes");
        }
        result.put("result",(pass_id>0)?"success":"failure");
        result.put("pass_id",pass_id);
        output.write(result.toString().getBytes());
    }

    public int upload(JSONObject requestData){
        try (Connection conn = PostgresConnection.getConnection()) {
            String query = "select user_id from \"user\" where user_name = ? ;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,requestData.getString("current_user_name"));
            ResultSet data = preparedStatement.executeQuery();
            data.next();
            int user_id = data.getInt(1);
            query = "select p.* from \"user\" u \n" +
                    "join \"key\" p on p.key_id = u.key_id\n" +
                    "where u.user_id = ? ;";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,user_id);
            data = preparedStatement.executeQuery();
            data.next();
            String publicKey = data.getString("public_key");
            AsymmetricConvertor passConvertor = new AsymmetricConvertor();
            String encryptPass = passConvertor.encryption(requestData.getString("password"),publicKey );
            query = "insert into \"password_container\" (owner_id , pass , name , web_url , description , web_name , dt_stamp) values ( ? , ? , ? , ? , ? , ? , ?) ;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,user_id);
            preparedStatement.setString(2,encryptPass);
            preparedStatement.setString(3, requestData.getString("user_name"));
            preparedStatement.setString(4, requestData.getString("url"));
            preparedStatement.setString(5, requestData.getString("description"));
            preparedStatement.setString(6,requestData.getString("name"));
            preparedStatement.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            preparedStatement.executeUpdate();
            query = "select pass_id from \"password_container\" where pass = ? ;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,encryptPass);
            data = preparedStatement.executeQuery();
            data.next();
            return data.getInt(1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return -1 ;
    }

}
