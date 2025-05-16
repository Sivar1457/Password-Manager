let passwordCollector = [
    {
        id: 1,
        name: 'Vault',
        date: 'April 21 , 2025',
        userName: 'Siva',
        password: '**********',
        url: 'https://vault.zoho.com/',
        description: 'This is a test description for the password manager application. It is used to test the functionality of the application.'
    },
    {
        id: 2,
        name: 'Drive',
        date: 'April 25 , 2025',
        userName: 'Siva',
        password: '**********',
        url: 'https://drive.google.com/',
        description: 'This is a test description for the password manager application. It is used to test the functionality of the application.'
    }
]

let rightBar = $('right-bar');
let inputPage = $('input-page');
let passUpPage = document.querySelector('.pass-show-up-page');

rightBar.querySelector('.new-pass-btn').addEventListener('click', function () {
    if (!inputPage.classList.contains('show') && !passUpPage.classList.contains('show')) {
        inputPage.classList.add('show');
    }
});


passUpPage.querySelector('.close-btn').addEventListener('click', function () {
    passUpPage.classList.remove('show');
    let userNameHistory = document.querySelector('.ph-username-history');
    let passwordHistory = document.querySelector('.ph-pass-history');
    document.querySelector('.psp-master-pass').classList.add('hide');
    document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
    document.querySelector('.psp-master-pass').querySelector('input').value = '';
    document.querySelector('.psp-history').classList.add('hide');
    userNameHistory.querySelector('.ph-values').innerHTML = '';
    userNameHistory.classList.remove('show');
    passwordHistory.querySelector('.ph-values').innerHTML = '';
    passwordHistory.classList.remove('show');
    document.querySelector('.ph-no-history').classList.add('show');
})
