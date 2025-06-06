package passwordHandler;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/inputStarter")
public class InputStarter extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletOutputStream output = resp.getOutputStream();
        HttpSession session = req.getSession(false);
        int intPos = (int) (Math.random()*7) ;

        StringBuilder result = new StringBuilder();
        for ( int i = 0 ; i < 10 ; i++ ) {
            if ( i == intPos || i == intPos+2 ) {
                result.append((int)(Math.random() * 10));
            }
            else {
                result.append((char)((int)(Math.random()*26)+97));
            }
        }
        session.setAttribute("inCode",result.toString());
        JSONObject jsonResult = new JSONObject();
        jsonResult.put("inCode",result.toString());
        output.write(jsonResult.toString().getBytes());
    }

}
