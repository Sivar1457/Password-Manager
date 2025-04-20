function _(ele) {
    return document.getElementById(ele);
}
let username = _('username');
let password = _('password');
let email = _('email');
async function signIn() { 
    let user = username.value;
    let pass = password.value;
    let mail = email.value;
    if (user === '' || pass === '' || mail === '') {
        alert('Please fill in all fields');
        return;
    }
    username.value = '';
    password.value = '';
    email.value = '';
    const responce = await fetch('/password/sign',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user,
            password: pass,
            email: mail,
        })
    })
    const data = await responce.json();
    if ( data.value === 'success') {
        alert('You have been signed in');
    }
    else {
        document.querySelector('.result').innerText = "User is not exist"; ;
    }
    console.log(data.value);
}

_('signin_work').addEventListener('click', function (){
    signIn();
} )
