package starter;

import db.PostgresConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PasswordGetter {

    Connection conn = PostgresConnection.getConnection();
    String query = null ;
    PreparedStatement preparedStatement = null ;
    ResultSet data = null ;

    public List<Map> getAllPasswords(String userName) throws SQLException {
        List<Map> allPass = new ArrayList<>();
        try {
            query = "select p.* from \"password_container\" p \n" +
                    "join \"user\" u on u.user_name = ?\n" +
                    "where p.owner_id = u.user_id;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,userName);
            data = preparedStatement.executeQuery();
            while (data.next()) {
                Map<String,Object> pass = new HashMap<>();
                pass.put("pass_id",data.getInt("pass_id"));
                pass.put("web_name",data.getString("web_name"));
                pass.put("name",data.getString("name"));
                pass.put("web_url",data.getString("web_url"));
                pass.put("description",data.getString("description"));
                pass.put("dt_stamp",(data.getString("dt_stamp") != null) ? data.getString("dt_stamp") : "No date available");
                allPass.add(pass);
            }
        }
        catch(Exception e) {
            System.out.println("Getting All Password when Starting up...");
            e.printStackTrace();
        }
        return allPass;
    }

    public List<Map> getSharedByMePasswords(String userName) {
        List<Map> allPass = new ArrayList<>();
        try {
            query = "select p.* from \"password_container\" p\n" +
                    "join \"user\" u on u.user_name = ?\n" +
                    "join \"shared_pass_relation\" r on r.pass_id = p.pass_id\n" +
                    "where p.owner_id = u.user_id ;";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,userName);
            data = preparedStatement.executeQuery();
            while (data.next()) {
                Map<String,Object> pass = new HashMap<>();
                pass.put("web_name",data.getString("web_name"));
                pass.put("name",data.getString("name"));
                pass.put("web-url",data.getString("web_url"));
                pass.put("description",data.getString("description"));
                pass.put("dt_stamp",(data.getString("dt_stamp") != null) ? data.getString("dt_stamp") : "No date available");
                pass.put("pass_id",data.getInt("pass_id"));
                allPass.add(pass);
            }
        } catch (Exception e) {
            System.out.println("Getting Shared By Me Passwords when Starting up...");
            e.printStackTrace();
        }
        return allPass;
    }

    public List<Map> getSharedWithMePasswords(String userName) {
        List<Map> allPass = new ArrayList<>();
        try {
            query = "select p.* from \"password_container\" p\n" +
                    "join \"user\" u on u.user_name = ?\n" +
                    "join \"shared_pass_relation\" r on r.user_id = u.user_id\n" +
                    "where p.pass_id = r.pass_id ;";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,userName);
            data = preparedStatement.executeQuery();
            while (data.next()) {
                Map<String,Object> pass = new HashMap<>();
                pass.put("web_name",data.getString("web_name"));
                pass.put("name",data.getString("name"));
                pass.put("web_url",data.getString("web_url"));
                pass.put("description",data.getString("description"));
                pass.put("dt_stamp",(data.getString("dt_stamp") != null) ? data.getString("dt_stamp") : "No date available");
                pass.put("pass_id",data.getInt("pass_id"));
                allPass.add(pass);
            }
        } catch (Exception e) {
            System.out.println("Getting Shared With Me Passwords when Starting up...");
            e.printStackTrace();
        }
        return allPass;
    }

}
