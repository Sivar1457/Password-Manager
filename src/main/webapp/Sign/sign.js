function _(ele) {
    return document.getElementById(ele);
}
let username = _('username');
let password = _('password');
let email = _('email');
async function signIn() {
    const responce = await fetch('/password/signIn',{
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
    if ( data.result === 'success') {
        window.location.href = '/password/MainPage/main.jsp';
        
    }
    else {
        document.querySelector('.result').innerText = "User is not exist"; ;
    }
    console.log(data.value);
}

async function signUp() {
    const responce = await fetch('/password/signUp',{
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
    if ( data.result === 'success') {
        alert('You have been signed up');
    }
    else {
        document.querySelector('.result').innerText = "User is already exist"; ;
    }
    console.log(data.value);
}

document.querySelector('.page-changer').addEventListener('click' , function() {
    let pageChanger = document.querySelector('.page-changer');
    if (pageChanger.id == '1') {
        pageChanger.id = '2';
        pageChanger.innerText = 'Already have an account? Sign in';
        document.getElementById('confirm_password').classList.remove('hide');
        _('work').innerText = 'Sign up';
    }
    else {
        pageChanger.id = '1';
        pageChanger.innerText = 'Don\'t have an account? Sign up';
        document.getElementById('confirm_password').classList.add('hide');
        _('work').innerText = 'Sign in';
    }

})

_('work').addEventListener('click', function (){
    let pageChanger = document.querySelector('.page-changer');
    if (username.value === '' || password.value === '' || email.value === '') {
        alert('Please fill in all fields');
        return;
    }
    if (pageChanger.id == '1') {
        signIn();
    }
    else {
        signUp();
    }
    username.value = '';
    password.value = '';
    email.value = '';
} )
