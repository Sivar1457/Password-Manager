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
        console.log(inputPage.classList.contains('show'),passUpPage.classList.contains('show'));
    }
});


passUpPage.querySelector('.close-btn').addEventListener('click', function () {
    passUpPage.classList.remove('show');
    let userNameHistory = document.querySelector('.ph-username-history');
    let passwordHistory = document.querySelector('.ph-pass-history');
    document.querySelector('.psp-master-pass').classList.add('hide');
    document.querySelector('.psp-main .show-up-toggle').classList.add('fa-eye');
    document.querySelector('.psp-main .show-up-toggle').classList.remove('fa-eye-slash');
    document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
    document.querySelector('.psp-master-pass').querySelector('input').value = '';
    document.querySelector('.psp-history').classList.add('hide');
    userNameHistory.querySelector('.ph-values').innerHTML = '';
    userNameHistory.classList.remove('show');
    passwordHistory.querySelector('.ph-values').innerHTML = '';
    passwordHistory.classList.remove('show');
    document.querySelector('.ph-no-history').classList.add('show');
    document.querySelector('.psp-share').classList.add('hide');
})

document.querySelector('.shared-by-me-revoke-btn').addEventListener('click',function(){
    let folderBar = document.querySelector('.folder-bar');
    if ( !folderBar.classList.contains('hide') ) folderBar.classList.add('hide');
    let rightBar = document.querySelector('.right-bar');
    if ( rightBar.classList.contains('hide') ) rightBar.classList.remove('hide');
    let passwordPage = document.querySelector('.password-page');
    let sharedByMe = passwordPage.querySelector('.shared-by-me-passes');
    let sharedWithMe = passwordPage.querySelector('.shared-with-me-passes');
    let myPasses = passwordPage.querySelector('.my-passes');
    if ( !myPasses.classList.contains('hide') ) myPasses.classList.add('hide');
    if ( sharedByMe.classList.contains('hide') ) sharedByMe.classList.remove('hide');
    if ( !sharedWithMe.classList.contains('hide') ) sharedWithMe.classList.add('hide');
})

document.querySelector('.password-page-revoke-btn').addEventListener('click',function(){
    let folderBar = document.querySelector('.folder-bar');
    if ( !folderBar.classList.contains('hide') ) folderBar.classList.add('hide');
    let rightBar = document.querySelector('.right-bar');
    if ( rightBar.classList.contains('hide') ) rightBar.classList.remove('hide');
    let passwordPage = document.querySelector('.password-page');
    let sharedByMe = passwordPage.querySelector('.shared-by-me-passes');
    let sharedWithMe = passwordPage.querySelector('.shared-with-me-passes');
    let myPasses = passwordPage.querySelector('.my-passes');
    if ( myPasses.classList.contains('hide') ) myPasses.classList.remove('hide');
    if ( !sharedByMe.classList.contains('hide') ) sharedByMe.classList.add('hide');
    if ( !sharedWithMe.classList.contains('hide') ) sharedWithMe.classList.add('hide');
})

document.querySelector('.shared-with-me-revoke-btn').addEventListener('click',function(){
    let folderBar = document.querySelector('.folder-bar');
    if ( !folderBar.classList.contains('hide') ) folderBar.classList.add('hide');
    let rightBar = document.querySelector('.right-bar');
    if ( rightBar.classList.contains('hide') ) rightBar.classList.remove('hide');
    let passwordPage = document.querySelector('.password-page');
    let sharedWithMe = passwordPage.querySelector('.shared-with-me-passes');
    let sharedByMe = passwordPage.querySelector('.shared-by-me-passes');
    let myPasses = passwordPage.querySelector('.my-passes');
    if ( !myPasses.classList.contains('hide') ) myPasses.classList.add('hide');
    if ( sharedWithMe.classList.contains('hide') ) sharedWithMe.classList.remove('hide');
    if ( !sharedByMe.classList.contains('hide') ) sharedByMe.classList.add('hide');
})