package passwordHandler;

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

@WebServlet("/historyGetter")
public class HistoryGetter extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();;
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int inputLen = 0 ;
        String requestData = null;
        while ( (inputLen = input.readLine(bytesArray,0, bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,inputLen, StandardCharsets.UTF_8);
        }
        JSONObject jsonRequest = new JSONObject(requestData);
        System.out.println(jsonRequest);
        output.write(getHistory(jsonRequest.getInt("pass_id")).toString().getBytes()); ;
    }

    public JSONObject getHistory(int passId) {
        JSONArray jsonResult = new JSONArray();
        JSONObject finalResult = new JSONObject();
        String query = "select * from \"history\" where pass_id = ? " ;
        try (Connection conn = PostgresConnection.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,passId);
            ResultSet data = preparedStatement.executeQuery();
            while ( data.next() ) {
                JSONObject jsonTemp = new JSONObject();
                jsonTemp.put("pass",data.getString("pass"));
                jsonTemp.put("user_name",data.getString("user_name"));
                jsonTemp.put("date_time_stamp",data.getTimestamp("dt_stamp"));
                jsonResult.put(jsonTemp);
            }
            finalResult.put("data",jsonResult);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return finalResult;
    }

}
