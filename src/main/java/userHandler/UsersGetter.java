package userHandler;

import db.PostgresConnection;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/userGetter")
public class UsersGetter extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }

    public void getAllUsers() {
        String query = "select * from \"user\"" ;
        try (Connection conn = PostgresConnection.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            ResultSet data = preparedStatement.executeQuery();
            JSONObject jsonObject = new JSONObject();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
