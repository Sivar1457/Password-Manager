package signIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.json.JSONObject;

import db.PostgresConnection;

public class SigninUserData {
    public boolean checkWithUserData(String data){
        JSONObject jsonData = new JSONObject(data);
        String query = "select * from \"user\" where \"username\" = ? and \"password\" = ? and \"email\" = ?";
        Connection conn = PostgresConnection.getConnection();
        try {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, jsonData.getString("username"));
            preparedStatement.setString(2, jsonData.getString("password"));
            preparedStatement.setString(3, jsonData.getString("email"));
            ResultSet dataResult = preparedStatement.executeQuery();
            if (dataResult.next()) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false ;
    }

    public static void main(String[] args) {
        try {
            Connection conn = PostgresConnection.getConnection();
            String query = "select * from \"user\" where \"username\" = ? and \"password\" = ? and \"email\" = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1,"Siva");
            preparedStatement.setString(2,"siva");
            preparedStatement.setString(3,"sivashankaran.in@gmail.com");
            ResultSet data = preparedStatement.executeQuery();
            if ( data.next() ) {
                System.out.println(data.getString(1));
            }
            else {
                System.out.println("Nothing found");
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
