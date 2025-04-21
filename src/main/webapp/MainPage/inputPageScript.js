function togglePassword() {
    let input = $('input-password');
    let toggleIcon = $('toggle-password');

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}
$('toggle-password').addEventListener('click', togglePassword);
