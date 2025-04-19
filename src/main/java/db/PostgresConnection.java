package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class PostgresConnection {
    static private Connection conn = null ;
    static private String url = "jdbc:postgresql://localhost:5432/password_manager";
    static private String username = "siva";
    static private String password = "siva11";
    static {
        try {
            conn = DriverManager.getConnection(url,username,password);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
    public static Connection getConnection() {
        return conn;
    }
}
