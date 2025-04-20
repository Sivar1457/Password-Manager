package signIn;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@WebServlet("/sign")
public class Sign extends HttpServlet {

    SigninUserData signinDB = new SigninUserData();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream inputStream = req.getInputStream();
        ServletOutputStream outputStream = resp.getOutputStream();
        byte[] bytesArray = new byte[1024];
        int inputLength = 0 ;
        String requestData = null;
        while ( ( inputLength = inputStream.readLine(bytesArray,0,bytesArray.length) ) != -1 ) {
            requestData=(new String(bytesArray,0,inputLength, StandardCharsets.UTF_8));
        }
        boolean cond = signinDB.checkWithUserData(requestData);
        JSONObject responseData = new JSONObject();
        responseData.put("value",(cond) ? "success" : "failure");
        System.out.println(responseData.toString());
        outputStream.write(responseData.toString().getBytes());
    }

}
