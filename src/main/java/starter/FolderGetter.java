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

public class FolderGetter {

    Connection conn = PostgresConnection.getConnection();
    String query = null ;
    PreparedStatement preparedStatement = null ;
    ResultSet data = null ;

    public List<String> getAllFolderNames(String userName) {
        List<String> folderNames = new ArrayList<>();
        try {
            query = "select * from \"folder\" where owner_id = (select user_id from \"user\" where user_name = ?);";
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, userName);
            data = preparedStatement.executeQuery();
            int count = 0;
            while (data.next()) {
                folderNames.add(data.getString("folder_name"));
                count++;
            }
            if (count == 0) {
                folderNames.add("No Folders");
            }
        } catch (Exception e) {
            System.out.println("Getting Folder Names when Starting up...");
            e.printStackTrace();
        }
        return folderNames;
    }

    public List<List<Map>> getAllFolders(String userName) {
        List<List<Map>> folders = new ArrayList<>();
        try {
            List<String> folderNames = getAllFolderNames(userName);
            for ( String folderName : folderNames ) {
                query = "select p.* from \"password_container\" p\n" +
                        "join \"folder\" f on f.folder_name = ?\n" +
                        "join \"folder_pass_relation\" r on r.folder_id = f.folder_id\n" +
                        "where p.pass_id = r.pass_id ;" ;
                preparedStatement = conn.prepareStatement(query);
                preparedStatement.setString(1, folderName);
                data = preparedStatement.executeQuery();
                List<Map> passwords = new ArrayList<>();
                while (data.next()) {
                    Map<String,Object> pass = new HashMap<>();
                    pass.put("web_name",data.getString("web_name"));
                    pass.put("name",data.getString("name"));
                    pass.put("web_url",data.getString("web_url"));
                    pass.put("description",data.getString("description"));
                    pass.put("dt_stamp",(data.getString("dt_stamp") != null) ? data.getString("dt_stamp") : "No date available");
                    pass.put("pass_id",data.getInt("pass_id"));
                    passwords.add(pass);
                }
                folders.add(passwords);
            }
        } catch (Exception e) {
            System.out.println("Getting Shared By Me Passwords when Starting up...");
            e.printStackTrace();
        }
        finally {
            try {
                conn.close();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
                e.printStackTrace();
            }
        }
        return folders;
    }

}
