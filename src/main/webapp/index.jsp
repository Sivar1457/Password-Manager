<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Sign</title>
    <link rel="stylesheet" href="Sign/signNewStyles.css">
</head>

<body>
    <div class="outer">
        <h2>Password Manager</h2>
        <div class="input-container">
            <input type="text" placeholder="Username" id="username" class="hide" required>
            <input type="text" placeholder="Email" id="email" class="hide" required>
            <input type="text" placeholder="Username or Email" id="username_email" required>
            <input type="password" placeholder="Master Password" id="password" required>
            <input type="password" placeholder="Confirm Password" id="confirm_password" class="hide" required>
        </div>
        <button id="work">Sign in</button>
        <div class="page-changer" id="1">Don't have an account? Sign up</div>
        <div class="result"></div>
    </div>
</body>
<script src="Sign/sign.js"></script>

</html>