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
    inputPage.querySelector('.input-name').value = '';
    inputPage.querySelector('.input-username').value = '';
    inputPage.querySelector('.input-password').value = '';
    inputPage.querySelector('.input-url').value = '';
    inputPage.classList.remove('show');
})