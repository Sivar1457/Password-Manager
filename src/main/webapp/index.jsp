<%@ page import ="db.PostgresConnection , java.sql.*"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Base</title>
</head>
<body>
    <%
        String username = "Naruto";
        int level = 9000;
    %>
    <h2>Hello <%= username %>!</h2>

    <%
        String query = "select * from \"user\" where \"username\" = ? and \"password\" = ? and \"email\" = ?";
        Connection conn = PostgresConnection.getConnection();
        try {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, "Siva");
            preparedStatement.setString(2, "Siva");
            preparedStatement.setString(3, "sivashankaran.s@gmail.com");
            ResultSet dataResult = preparedStatement.executeQuery();
            out.println(dataResult);
            if (dataResult.next()) {
                out.println("True");
            }
            else {
                out.println("False");
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
    %>

</body>
</html>
