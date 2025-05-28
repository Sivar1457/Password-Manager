package userHandler;

import db.PostgresConnection;
import org.json.JSONArray;
import org.json.JSONObject;

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
import java.util.ArrayList;
import java.util.List;

@WebServlet("/userGetter")
public class UsersGetter extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();byte[] bytesArray = new byte[1024];
        int requestLen = 0 ;
        String requestData = null ;
        while ( (requestLen = input.readLine(bytesArray,0,bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,requestLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        if ( jsonRequest.getString("type").equals("allUsers") ) output.write(getAllUsers(jsonRequest.getString("user_name"), jsonRequest.getInt("pass_id") ).toString().getBytes());
        else if (jsonRequest.getString("type").equals("sharedWithUsers")) output.write(getSharedWithUsers(jsonRequest).toString().getBytes());
        else if (jsonRequest.getString("type").equals("sharedWithMe")) output.write(getSharedWithMeUser(jsonRequest).toString().getBytes());
    }

    public JSONObject getSharedWithMeUser(JSONObject jsonObject) {
        JSONObject result = new JSONObject();
        try (Connection conn = PostgresConnection.getConnection()) {
            String query = " select u.user_name from \"user\" u\n" +
                    "join \"password_container\" p on p.pass_id = ?\n" +
                    "where u.user_id = p.owner_id ;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonObject.getInt("passId"));
            ResultSet data = preparedStatement.executeQuery();
            data.next();
            result.put("ownerName",data.getString(1));
        }
        catch ( Exception e ) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    public JSONObject getSharedWithUsers(JSONObject jsonObject){
        JSONObject result = new JSONObject();
        try(Connection conn = PostgresConnection.getConnection()){
            String query = "select u.* from \"user\" u\n" +
                    "join \"shared_pass_relation\" r on r.user_id = u.user_id\n" +
                    "where r.pass_id = ?;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonObject.getInt("passId"));
            ResultSet data = preparedStatement.executeQuery();
            List<String> object = new ArrayList<>();
            while (data.next() ) {
                if ( !object.contains(data.getString("user_name")) ) object.add(data.getString("user_name"));
            }
            result.put("sharedUsers",object);
            query = "select u.* from \"user\" u\n" +
                    "join \"password_container\" p on p.pass_id = ?\n" +
                    "where u.user_id = p.owner_id ;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonObject.getInt("passId"));
            data = preparedStatement.executeQuery();
            data.next();
            result.put("ownerName",data.getString("user_name"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    public JSONArray getAllUsers(String username, int pass_id) {
        String query = "select * from \"user\" where user_name != ?" ;
        JSONArray jsonArray = new JSONArray();
        try (Connection conn = PostgresConnection.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,username);
            ResultSet data = preparedStatement.executeQuery();
            query = "select u.user_name from \"user\" u\n" +
                    "join \"shared_pass_relation\" r on r.pass_id = ?\n" +
                    "where u.user_name != ?;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,pass_id);
            preparedStatement.setString(2,username);
            ResultSet nextData = preparedStatement.executeQuery();
            List<String> relatedUsers = new ArrayList<>();
            while ( nextData.next() ) {
                relatedUsers.add(nextData.getString(1));
            }
            while ( data.next() ) {
                String dataUserName = data.getString("user_name") ;
                JSONObject jsonObject = new JSONObject();
                if ( !relatedUsers.contains(dataUserName) ) {
                    jsonObject.put("related","not related");
                }
                else {
                    jsonObject.put("related","related");
                }
                jsonObject.put("user_name",dataUserName);
                jsonObject.put("email",data.getString("email"));
                jsonArray.put(jsonObject);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return jsonArray;
//        String query = "select u.* from \"user\" u\n" +
//                "join \"shared_pass_relation\" r on r.user_id != u.user_id\n" +
//                "where r.pass_id = ? and u.user_name != ? ;" ;
//        JSONArray jsonArray = new JSONArray();
//        try (Connection conn = PostgresConnection.getConnection()) {
//            PreparedStatement preparedStatement = conn.prepareStatement(query);
//            preparedStatement.setInt(1,pass_id);
//            preparedStatement.setString(2,username);
//            ResultSet data = preparedStatement.executeQuery();
//            int i = 0 ;
//            while ( data.next() ) {
//                if ( !data.getString("user_name").equals(username) ) {
//                    JSONObject jsonObject = new JSONObject();
//                    jsonObject.put("user", data.getString("user_name"));
//                    jsonObject.put("email", data.getString("email"));
//                    jsonArray.put(jsonObject);
//                }
//                i++;
//            }
//            if ( i == 0 ) {
//                query = "select * from \"user\" where user_name != ? ;" ;
//                preparedStatement = conn.prepareStatement(query);
//                preparedStatement.setString(1,username);
//                data = preparedStatement.executeQuery();
//                while ( data.next() ) {
//                    if ( !data.getString("user_name").equals(username) ) {
//                        JSONObject jsonObject = new JSONObject();
//                        jsonObject.put("user", data.getString("user_name"));
//                        jsonObject.put("email", data.getString("email"));
//                        jsonArray.put(jsonObject);
//                    }
//                }
//            }
//            System.out.println(jsonArray.length());
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//        }
//        return jsonArray;
    }
    
}
