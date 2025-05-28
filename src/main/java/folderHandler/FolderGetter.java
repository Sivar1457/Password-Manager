package folderHandler;

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

@WebServlet("/folderGetter")
public class FolderGetter extends HttpServlet {

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
        output.write(folderProvider(jsonRequest).toString().getBytes());
    }

    public JSONArray folderProvider(JSONObject jsonObject) {
        JSONArray jsonResult = new JSONArray();
        try (Connection conn = PostgresConnection.getConnection()) {
            String query = "select f.* from \"folder\" f\n" +
                    "join folder_pass_relation r on r.pass_id = ?;" ;
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonObject.getInt("pass_id"));
            ResultSet data = preparedStatement.executeQuery();
            List<String> folderList = new ArrayList<>();
            while (data.next()) {
                folderList.add(data.getString("folder_name"));
            }
            query = "select * from \"folder\" where owner_id = (select user_id from \"user\" where user_name = ?);" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, jsonObject.getString("user_name") );
            data = preparedStatement.executeQuery();
            while (data.next()) {
                JSONObject tempJson = new JSONObject();
                tempJson.put("folder_name" , data.getString("folder_name"));
                if ( folderList.contains(data.getString("folder_name")) ) {
                    tempJson.put("isContains","yes");
                }
                else {
                    tempJson.put("isContains","no");
                }
                jsonResult.put(tempJson);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return jsonResult;
    }

}
