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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/passUpdate")
public class PasswordUpdater extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        String requestData = null ;
        int inputLen = 0 ;
        while ( (inputLen = input.readLine(bytesArray,0, bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,inputLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        dbUpdate(jsonRequest);
        output.write(jsonRequest.toString().getBytes());
    }

    public void dbUpdate(JSONObject jsonRequest) {
        String query = null ;
        ResultSet data = null;
        try (Connection conn = PostgresConnection.getConnection()) {
            int passId = jsonRequest.getInt("pass_id") ;
            query = "select k.* from key k\n" +
                    "join password_container p on p.pass_id = ?\n" +
                    "join \"user\" u on u.user_id = p.owner_id\n" +
                    "where k.key_id = u.key_id ;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,passId);
            data = preparedStatement.executeQuery();
            data.next();
            String privateKey = data.getString("private_key");
            String publicKey = data.getString("public_key");
            SymmetricConvertor symmetricConvertor = new SymmetricConvertor();
            privateKey = symmetricConvertor.decryptValue(privateKey, jsonRequest.getString("masterPass"));
            query = "select * from password_container\n" +
                    "where pass_id = ?;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,passId);
            data = preparedStatement.executeQuery();
            data.next();
            String pass = data.getString("pass");
            AsymmetricConvertor asymmetricConvertor = new AsymmetricConvertor();
            pass = asymmetricConvertor.decryption(pass,privateKey);
            query = "update \"password_container\"" +
                    "\nset " ;
            boolean isFirst = false ;
            List<String> changedParamsKeys = new ArrayList<>();
            Map<String,Object> changedParams = new HashMap<>();
            if (!data.getString("web_name").equals(jsonRequest.getString("name"))) {
                if ( isFirst ) {
                    query += " , " ;
                }
                isFirst = true;
                query += "\nweb_name = ? " ;
                changedParamsKeys.add("web_name");
                changedParams.put("web_name",jsonRequest.getString("name"));
            }
            if ( !data.getString("name").equals(jsonRequest.getString("userName")) ) {
                if ( isFirst ) {
                    query += " , " ;
                }
                isFirst = true;
                query += "\nname = ? " ;
                changedParamsKeys.add("user_name");
                changedParams.put("user_name",jsonRequest.getString("userName"));
                changedParams.put("last_user_name",data.getString("name"));
            }
            if ( !data.getString("web_url").equals(jsonRequest.getString("url")) ) {
                if ( isFirst ) {
                    query += " , " ;
                }
                isFirst = true;
                query += "\nweb_url = ? " ;
                changedParamsKeys.add("web_url");
                changedParams.put("web_url",jsonRequest.getString("url"));
            }
            if ( !data.getString("description").equals(jsonRequest.getString("description")) ) {
                if ( isFirst ) {
                    query += " , " ;
                }
                isFirst = true;
                query += "\ndescription = ? " ;
                changedParamsKeys.add("description");
                changedParams.put("description",jsonRequest.getString("description"));
            }
            if ( !pass.equals(jsonRequest.getString("password")) ) {
                if ( isFirst ) {
                    query += " , " ;
                }
                isFirst = true;
                query += "\npass = ?" ;
                changedParamsKeys.add("pass");
                changedParams.put("pass",asymmetricConvertor.encryption(jsonRequest.getString("password"),publicKey ));
                changedParams.put("last_pass",data.getString("pass"));
            }
            query += " \nwhere pass_id = ? ;" ;
            changedParamsKeys.add("pass_id");
            changedParams.put("pass_id",passId);
            preparedStatement = conn.prepareStatement(query);
            for ( int i = 1 ; i <= changedParamsKeys.size() ; i++ ) {
                preparedStatement.setObject(i,changedParams.get(changedParamsKeys.get(i-1)));
            }
            if ( changedParams.size() > 1 ) preparedStatement.executeUpdate();
            String historyQuery = "insert into \"history\" ( pass_id ," ;
            boolean isPassChanged = changedParamsKeys.contains("pass") ;
            boolean isUserNameChanged = changedParamsKeys.contains("user_name");
            if ( isPassChanged ) historyQuery += " pass , " ;
            if ( isUserNameChanged ) historyQuery += " user_name , " ;
            historyQuery += " dt_stamp ) values (" ;
            int count = 1 ;
            if ( isPassChanged ) {
                historyQuery += " ? , " ;
                count ++;
            }
            if ( isUserNameChanged ) {
                historyQuery += " ? , " ;
                count++;
            }
            historyQuery += " ? , ? ) ;" ;
            preparedStatement = conn.prepareStatement(historyQuery);
            preparedStatement.setInt(1,passId);
            preparedStatement.setTimestamp(count+1, Timestamp.valueOf(LocalDateTime.now()));
            if ( count > 1 ) {
                if ( isUserNameChanged ) preparedStatement.setString( count,(String)changedParams.get("last_user_name"));
                if ( isPassChanged ) preparedStatement.setString(2 ,(String)changedParams.get(("last_pass")) );
            }
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
