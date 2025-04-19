function _(ele) {
    return document.getElementById(ele);
}
let username = _('username');
let password = _('password');
let email = _('email');
function signIn() {
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
    fetch('/password/sign',{
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
}

_('signin_work').addEventListener('click', function (){
    signIn();
} )
