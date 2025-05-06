package Sign;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/signOut")
public class SignOut extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletOutputStream output = resp.getOutputStream();

        HttpSession session = req.getSession(false);
        JSONObject result = new JSONObject();
        if ( session != null ) {
            session.invalidate();
            result.put("result","success");
        }
        else {
            result.put("result","failure");
        }
        output.write(result.toString().getBytes());
    }
}
