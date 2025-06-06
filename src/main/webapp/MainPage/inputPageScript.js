function togglePassword() {
    let input = $('input-password');
    let toggleIcon = $('toggle-password');

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}
$('toggle-password').addEventListener('click', togglePassword);


function getValues() {
    let inputPage = document.querySelector('.input-page');
    let inputs = inputPage.querySelector('.inputs');
    let name = inputs.querySelector('.input-name').value;
    let userName = inputs.querySelector('.input-username').value;
    let password = inputs.querySelector('.input-password').value;
    let url = inputs.querySelector('.input-url').value;
    if (name.trim() === '' || userName.trim() === '' || password.trim() === '' || url.trim() === '') {
        alert('Please fill in all fields');
        return;
    }
    if (!isWebsiteLink(url)) {
        alert('Please enter a valid URL');
        return;
    }
    return {
        name: name,
        userName: userName,
        password: password,
        url: url,
        description : 'This is a test description for the password manager application. It is used to test the functionality of the application.'
    }
}

function isWebsiteLink(url) {
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return pattern.test(url);
}

function setValues(data) {
    if (!data) {
        return ;
    }
    let result = {
        date: new Date().toLocaleDateString(),
        name: data.name,
        userName: data.userName,
        password: data.password,
        url: data.url,
        description: data.description
    }
    console.log(result);
}

let passwordUploader = async function (data) {
    let fetchData = {
        user_name: data.userName,
        password: data.password,
        url: data.url,
        description: data.description,
        date: data.date,
        name: data.name,
        current_user_name: document.querySelector('.profile-name').innerText,
        inCode : document.querySelector('.input-page .inCode').innerText
    }
    let response = await fetch('/passUpload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchData)
    })
    let result = await response.json();
    if ( result.notification == 'yes' ) {
        alert('Uploading password by not using input page alert')
    }
}

document.querySelector('.input-page').addEventListener('click',function(e){
    let target = e.target;
    if ( target.classList.contains('close-btn') ) {
        inputPageClosing();
    }
    if ( target.classList.contains('input-submit') ) {
        let values = getValues();
        clearInput();
        inputPageClosing();
        if (values) {
            setValues(values);
            passwordUploader(values);
            document.querySelector('.input-page').classList.remove('show');
        }
    }
})

document.querySelector('.input-page').querySelectorAll('input').forEach((input)=>{
    input.tabIndex = -1;
})
document.querySelector('.input-page').querySelectorAll('button').forEach((button)=>{
    button.tabIndex = -1;
})