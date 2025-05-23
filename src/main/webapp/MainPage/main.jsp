<%@ page import="db.PostgresConnection,java.sql.*"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Manager</title>
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="mainRightStyles.css">
    <link rel="stylesheet" href="inputPageStyles.css">
    <link rel="stylesheet" href="showUpPageStyles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=close,edit,history,logout,share&display=block"
        rel="stylesheet" />
</head>

<body>
    <div class="outer disp-flex">
        <div class="left-bar">
            <div class="left-bar-top">
                <div class="all">
                    <h4>All Passwords</h4>
                    <h4>Favorites</h4>
                    <h4>Shared By Me</h4>
                    <h4>Shared With Me</h4>
                    <h4>Trash</h4>
                </div>
                <div class="folders">
                    <h3>Folders</h3>
                    <div class="folder-items"></div>
                </div>
                <div class="tags">
                    <h3>Tags</h3>
                </div>
            </div>
            <div class="left-bar-bottom">
                <div class="profile">
                        <img src="images/BL_Icon_Shoei_Baro.webp"
                            alt="Profile Image" class="profile-image">
                        <h2 class="profile-name">Sivar</h2>
                </div>
                <div class="logout">
                    <span class="material-symbols-outlined">logout</span>
                    <h4>Logout</h4>
                </div>
            </div>
        </div>
        <div class="right-bar">
            <div class="password-page-top">
                <h3 class="page-name"></h3>
                <div class="password-options">
                    <div class="new-pass-btn">New</div>
                </div>
            </div>
            <div class="password-page">
                <%
                    Connection conn = PostgresConnection.getConnection();
                    try {
                        String query = "select p.* from \"password_container\" p \n" +
                            "join \"user\" u on u.user_name = ?\n" +
                            "where p.owner_id = u.user_id;" ;
                        PreparedStatement preparedStatement = conn.prepareStatement(query);
                        preparedStatement.setString(1,(String)session.getAttribute("user_name"));
                        ResultSet data = preparedStatement.executeQuery();
                        while (data.next()) {
                            %>
                                <div class="pass" id="pass-<%= data.getInt("pass_id") %>">
                                    <h2 class="name"><%=data.getString("web_name")%></h2>
                                    <p class="username"><%=data.getString("name")%></p>
                                    <p class="web-url hide"><%=data.getString("web_url")%></p>
                                    <p class="description hide"><%=data.getString("description")%></p>
                                    <p class="date-time hide"><%=(data.getString("dt_stamp") != null) ? data.getString("dt_stamp") : "No date available"%></p>
                                    <p class="pass-id hide"><%=data.getInt("pass_id")%></p>
                                </div>
                            <%
                        }
                    }
                    catch(Exception e) {
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
            </div>
        </div>
        <div class="input-page">
            <div class="ip-top">
                <h3>New Password</h3>
                <span class="material-symbols-outlined close-btn">close</span>
            </div>
            <div class="inputs">
                <input type="text" class="input-name" placeholder="Enter the name">
                <input type="text" class="input-username" placeholder="Enter the username">
                <div class="password-wrapper">
                    <input type="password" class="input-password" placeholder="Enter the password">
                    <i class="fa-solid fa-eye toggle-password"></i>
                    <i class="fas fa-key generate-password"></i>
                </div>
                <input type="text" class="input-url" placeholder="Enter the url">
            </div>
            <button class="input-submit">Submit</button>
        </div>
        <div class="pass-show-up-page">
            <div class="psp-up">
                <div class="details">
                    <h3 class="pass-name">Vault</h3>
                    <h4 class="pass-date">April 21,2025</h4>
                </div>
                <div class="options">
                    <span class="material-symbols-outlined share-btn">share</span>
                    <span class="material-symbols-outlined edit-btn">edit</span>
                    <span class="material-symbols-outlined history-btn">history</span>
                    <span class="material-symbols-outlined close-btn">close</span>
                </div>
            </div>
            <div class="psp-main">
                <div class="username">
                    <div class="label">User Name</div>
                    <div class="value">Siva</div>
                </div>
                <div class="password">
                    <div class="label">Password</div>
                    <div class="value">**************</div>
                    <i class="fa-solid fa-eye show-up-toggle"></i>
                </div>
                <div class="url">
                    <div class="label">URL</div>
                    <div class="value">https://vault.zoho.com/</div>
                </div>
                <div class="description">
                    <div class="label">Description</div>
                    <div class="value">This is a test description for the password manager application. It is used to
                        test the functionality of the application.</div>
                </div>
                <div class="psp-pass-id"></div>
            </div>
            <div class="psp-history hide">
                <div class="ph-top">
                    <h3>History</h3>
                    <i class="fa-solid fa-close"></i>
                </div>
                <div class="ph-bottom">
                    <div class="ph-pass-history">
                        <div class="ph-heading">
                            <h4>Password</h4>
                            <h4>Modified Time</h4>
                        </div>
                        <div class="ph-values">
                            <div class="ph-value">
                                <div class="ph-left">
                                    <i class="fa-solid fa-copy"></i>
                                    <div class="ph-pass-box">
                                        <p class="ph-pass">********</p>
                                        <i class="fa-solid fa-eye"></i>
                                    </div>
                                </div>
                                <div class="ph-right">
                                    <p class="ph-modify-date">
                                        May 21,2025, 10:30 AM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ph-username-history">
                        <div class="ph-heading">
                            <h4>User Name</h4>
                            <h4>Modified Time</h4>
                        </div>
                        <div class="ph-values">
                            <div class="ph-value">
                                <div class="ph-left">
                                    <i class="fa-solid fa-copy"></i>
                                    <p class="ph-username">Siva</p>
                                </div>
                                <div class="ph-right">
                                    <p class="ph-modify-date">
                                        May 21,2025, 10:30 AM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ph-no-history show">
                        <h4>No history available</h4>
                    </div>
                </div>
            </div>
            <div class="psp-master-pass hide">
                <input type="text" class="master-pass" placeholder="Enter the master password">
                <button class="master-pass-submit">Submit</button>
            </div>
            <div class="psp-share">
                <div class="psp-share-top">
                    <h3>Share Password</h3>
                    <i class="fa-solid fa-close"></i>
                </div>
                <div class="psp-share-bottom">
                    <div class="psp-share-user-outline">
                        <div class="psp-share-user-title">
                            <h4>User Name</h4>
                            <span class="psp-share-mandatory">~</span>
                        </div>
                        <div class="psp-share-user-list">
                            <div class="psp-share-user">
                                <p class="psp-share-user-name">Sivar</p>
                                <button class="psp-share-user-btn">Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pass-edit-page">
            <div class="pep-top">
                <h3>Edit Password</h3>
                <i class="fa-solid fa-close pep-close-btn"></i>
            </div>
            <div class="pep-middle">
                <div class="pep-name">
                    <div class="pep-left">
                        <div class="pep-label">
                            <h4>Name</h4>
                            <span class="pep-mandatory">*</span>
                        </div>
                    </div>
                    <div class="pep-right">
                        <input type="text" class="pep-input-name">
                    </div>
                </div>
                <div class="pep-user-name">
                    <div class="pep-left">
                        <div class="pep-label">
                            <h4>User Name</h4>
                            <span class="pep-mandatory">*</span>
                        </div>
                    </div>
                    <div class="pep-right">
                        <input type="text" class="pep-input-user-name">
                    </div>
                </div>
                <div class="pep-password">
                    <div class="pep-left">
                        <div class="pep-label">
                            <h4>Password</h4>
                            <span class="pep-mandatory">*</span>
                        </div>
                    </div>
                    <div class="pep-right">
                        <input type="password" class="pep-input-password">
                        <i class="fa-solid fa-eye toggle-password"></i>
                    </div>
                </div>
                <div class="pep-url">
                    <div class="pep-left">
                        <div class="pep-label">
                            <h4>URL</h4>
                        </div>
                    </div>
                    <div class="pep-right">
                        <input type="text" class="pep-input-url">
                    </div>
                </div>
                <div class="pep-description">
                    <div class="pep-left">
                        <div class="pep-label">
                            <h4>Description</h4>
                        </div>
                    </div>
                    <div class="pep-right">
                        <input type="text" class="pep-input-description">
                    </div>
                </div>
            </div>
            <div class="pep-bottom">
                <button class="pep-update-btn">Update</button>
                <button class="pep-cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</body>
<script src="main.js"></script>
<script src="mainRightScript.js"></script>
<script src="inputPageScript.js"></script>
<script src="showUpPageScript.js"></script>

</html>