function togglePassword() {
    let input = $('input-password');
    let toggleIcon = $('toggle-password');

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}
$('toggle-password').addEventListener('click', togglePassword);

inputPage.querySelector('.close-btn').addEventListener('click', function () {
    clearInput();
    inputPage.classList.remove('show');
})

function getValues() {
    let inputs = inputPage.querySelector('.inputs');
    let name = inputs.querySelector('.input-name').value;
    let userName = inputs.querySelector('.input-username').value;
    let password = inputs.querySelector('.input-password').value;
    let url = inputs.querySelector('.input-url').value;
    return {
        name: name,
        userName: userName,
        password: password,
        url: url
    }
}

function setValues(data) {
    let result = {
        id : passwordCollector.length + 1,
        date: new Date().toLocaleDateString(),
        name: data.name,
        userName: data.userName,
        password: data.password,
        url: data.url,
        description : data.description || 'This is a test description for the password manager application. It is used to test the functionality of the application.'
    }
    console.log(result);
    passwordSetter(result);
    passwordCollector.push(result);
}

function clearInput() {
    let inputs = inputPage.querySelector('.inputs');
    inputs.querySelector('.input-name').value = '';
    inputs.querySelector('.input-username').value = '';
    inputs.querySelector('.input-password').value = '';
    inputs.querySelector('.input-url').value = '';
}

inputPage.querySelector('.input-submit').addEventListener('click',function(){
    setValues(getValues());
    clearInput();
    inputPage.classList.remove('show');
})