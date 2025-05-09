function _(ele) {
    return document.getElementById(ele);
}

async function signIn() {
    const userName_email = document.getElementById('username_email');
    const password = document.getElementById('password');
    if (userName_email.value === '' || password.value === '') {
        alert('Please fill in all fields');
        return;
    }
    let jsonData = '';
    if (checker()) {
        jsonData = JSON.stringify({
            type : 'email',
            email: userName_email.value,
            master_pass: password.value
        })
    }
    else {
        jsonData = JSON.stringify({
            type : 'user_name',
            user_name: userName_email.value,
            master_pass: password.value
        })
    }
    
    const responce = await fetch('/password/signIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })

    const data = await responce.json();
    console.log(data);
    if (data.result === 'success') {
        window.location.href = '/password/MainPage/main.jsp';
    }
    else {
        document.querySelector('.result').innerText = "User is not exist";;
    }
    console.log(data.value);

    userName_email.value = '';
    password.value = '';
}

let checker = function () {
    const input = document.getElementById("username_email").value.trim();

    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(input)
}

async function signUp() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const email = document.getElementById('email');
    if (username.value === '' || password.value === '' || confirmPassword.value === '' || email.value === '') {
        alert('Please fill in all fields');
        return;
    }
    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match');
        return;
    }
    const responce = await fetch('/password/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_name: username.value,
            master_pass: password.value,
            email: email.value
        })
    })
    const data = await responce.json();
    if (data.result === 'success') {
        alert('You have been signed up');
    }
    else {
        document.querySelector('.result').innerText = "User is already exist";;
    }
    username.value = '';
    password.value = '';
    confirmPassword.value = '';
    email.value = '';
    console.log(data.value);
    pageChangerFunc();
}

let pageChangerFunc = function () {
    let pageChanger = document.querySelector('.page-changer');
    let confirmPassword = document.getElementById('confirm_password');
    let userName = document.getElementById('username');
    let email = document.getElementById('email');
    let userName_Email = document.getElementById('username_email');
    if (pageChanger.id == '1') {
        pageChanger.id = '2';
        pageChanger.innerText = 'Already have an account? Sign in';
        confirmPassword.classList.remove('hide');
        userName.classList.remove('hide');
        email.classList.remove('hide');
        userName_Email.classList.add('hide');
        userName_Email.tabIndex = -1;
        confirmPassword.tabIndex = 0;
        userName.tabIndex = 0;
        email.tabIndex = 0;
        _('work').innerText = 'Sign up';
    }
    else {
        pageChanger.id = '1';
        pageChanger.innerText = 'Don\'t have an account? Sign up';
        confirmPassword.classList.add('hide');
        userName.classList.add('hide');
        email.classList.add('hide');
        confirmPassword.tabIndex = -1;
        userName.tabIndex = -1;
        email.tabIndex = -1;
        userName_Email.tabIndex = 0;
        userName_Email.classList.remove('hide');
        _('work').innerText = 'Sign in';
    }

}
document.querySelector('.page-changer').addEventListener('click',pageChangerFunc)

_('work').addEventListener('click', function () {
    let pageChanger = document.querySelector('.page-changer');
    if (pageChanger.id == '1') {
        signIn();
    }
    else {
        signUp();
    }
})

let checkOut = async function() {
    const response = await fetch('/password/signCheck',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
    if (data.result === 'success') {
        window.location.href = '/password/MainPage/main.jsp';
    }
}
checkOut();