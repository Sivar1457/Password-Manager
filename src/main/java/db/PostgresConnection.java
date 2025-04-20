package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class PostgresConnection {
    static private Connection conn = null ;
    static private String url = "jdbc:postgresql://localhost:5432/password_manager";
    static private String username = "siva";
    static private String password = "siva11";

    public static Connection getConnection() {
        try {
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(url,username,password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }
}
