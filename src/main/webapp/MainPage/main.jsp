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
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=close,edit,history&display=block"
        rel="stylesheet" />
</head>

<body>
    <div class="outer disp-flex">
        <div class="left-bar">
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
        <div class="right-bar">
            <div class="password-page-top">
                <h3 class="page-name"></h3>
                <div class="password-options">
                    <div class="new-pass-btn">New</div>
                </div>
            </div>
            <div class="password-page">
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
                    <span class="material-symbols-outlined">edit</span>
                    <span class="material-symbols-outlined">history</span>
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
            </div>
        </div>
    </div>
</body>
<script src="main.js"></script>
<script src="mainRightScript.js"></script>
<script src="inputPageScript.js"></script>
<script src="showUpPageScript.js"></script>

</html>