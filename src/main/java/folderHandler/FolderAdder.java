package folderHandler;

import db.PostgresConnection;
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

@WebServlet("/folderPassAdder")
public class FolderAdder extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int requestLen = 0 ;
        String requestData = null ;
        while ( ( requestLen = input.readLine(bytesArray,0, bytesArray.length) ) != -1 ) {
            requestData = new String(bytesArray,0,requestLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        addToFolder(jsonRequest);
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("result","success");
        output.write(jsonResponse.toString().getBytes());
    }

    public void addToFolder(JSONObject jsonObject) {
        try (Connection conn = PostgresConnection.getConnection()) {
            String query = "select folder_id from \"folder\" where folder_name = ? " ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,jsonObject.getString("folder_name"));
            ResultSet data = preparedStatement.executeQuery();
            data.next();
            if ( !isAvailable(data.getInt(1), jsonObject.getInt("pass_id") ) ) {
                query = "insert into \"folder_pass_relation\" ( folder_id , pass_id ) values ( ? , ? );";
                preparedStatement = conn.prepareStatement(query);
                preparedStatement.setInt(1, data.getInt(1));
                preparedStatement.setInt(2, jsonObject.getInt("pass_id"));
                preparedStatement.executeUpdate();
            }
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    public boolean isAvailable(int folder_id , int pass_id) {
        try(Connection conn = PostgresConnection.getConnection()) {
            String query = "select * from \"folder_pass_relation\" where folder_id = ? and pass_id = ?;";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,folder_id);
            preparedStatement.setInt(2,pass_id);
            ResultSet data = preparedStatement.executeQuery();
            return data.next();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

}
