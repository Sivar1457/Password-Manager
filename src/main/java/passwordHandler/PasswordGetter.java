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

@WebServlet("/passGetter")
public class PasswordGetter extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream input = req.getInputStream();
        ServletOutputStream output = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int inputLen = 0 ;
        String requestData = null ;
        while ( (inputLen = input.readLine(bytesArray,0,bytesArray.length)) != -1 ) {
            requestData = new String(bytesArray,0,inputLen, StandardCharsets.UTF_8);
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
            query = "select private_key from \"key\" where key_id = (select key_id from \"user\" where user_id = (select owner_id from \"password_container\" where pass_id = ?));" ;
            preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1,jsonRequest.getInt("pass_id"));
            data = preparedStatement.executeQuery();
            data.next();
            String privateKey = data.getString(1);
            SymmetricConvertor symmetricConvertor = new SymmetricConvertor();
            String decryptKey = symmetricConvertor.decryptValue(privateKey, jsonRequest.getString("master_pass"));
            AsymmetricConvertor asymmetricConvertor = new AsymmetricConvertor();
            String decryptPass = asymmetricConvertor.decryption(pass,decryptKey);
            if ( !decryptPass.trim().isEmpty() ) {
                jsonResponse.put("result", "success");
                jsonResponse.put("pass", decryptPass);
                output.write(jsonResponse.toString().getBytes());
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        jsonResponse.put("result","failure");
        output.write(jsonResponse.toString().getBytes());
    }
}
