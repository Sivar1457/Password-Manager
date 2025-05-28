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
import java.sql.Timestamp;
import java.time.LocalDateTime;

@WebServlet("/folderCreator")
public class FolderCreator extends HttpServlet {

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
        boolean cond = folderCreatorDB(jsonRequest);
        JSONObject jsonResult = new JSONObject();
        jsonResult.put("result",(cond) ? "success" : "failure");
        output.write(jsonResult.toString().getBytes());
    }

    public boolean folderCreatorDB (JSONObject jsonObject) {
        try (Connection conn = PostgresConnection.getConnection()) {
            String query = "select user_id from \"user\" where user_name = ? ;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,jsonObject.getString("user_name"));
            ResultSet data = preparedStatement.executeQuery();
            data.next();
            int userId = data.getInt(1);
            query = "insert into \"folder\" ( folder_name , owner_id , dt_stamp ) values ( ? , ? , ? ) ;" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,jsonObject.getString("folder_name"));
            preparedStatement.setInt(2,userId);
            preparedStatement.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));
            preparedStatement.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

}
