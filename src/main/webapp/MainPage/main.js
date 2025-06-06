function _(selector) {
    return document.getElementById(selector);
}
function $(selector) {
    return document.querySelector(`.${selector}`);
}

function selectionLeftBar(ele) {
    ele.classList.add("selected");
    document.querySelector('.page-name').innerText = ele.innerText;
}


//____________________________ selection of temporary left bar
selectionLeftBar($("left-bar").querySelectorAll("h4")[0]);

let profileSetUp = async function () {
    let response = await fetch('/signCheck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await response.json();
    if (data.result === 'failure') {
        window.location.href = '/';
    }
    $('profile .profile-name').innerText = data.user_name;
}

let logOut = async function () {
    await fetch('/signOut', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

profileSetUp();



let showUpPageClosing = function() {
    // closing showing up page
    let passUpPage = document.querySelector('.pass-show-up-page');
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
    document.querySelector('.show-background').classList.remove('show');
}


function clearInput() {
    let inputs = document.querySelector('.input-page').querySelector('.inputs');
    inputs.querySelector('.input-name').value = '';
    inputs.querySelector('.input-username').value = '';
    inputs.querySelector('.input-password').value = '';
    inputs.querySelector('.input-url').value = '';
}

let inputPageClosing = function() {
    clearInput();
    let inputPage = document.querySelector('.input-page');
    inputPage.classList.remove('show');
    inputPage.querySelectorAll('input').forEach((input)=>{
        input.tabIndex = -1;
    })
    inputPage.querySelectorAll('button').forEach((button)=>{
        button.tabIndex = -1;
    })
    document.querySelector('.show-background').classList.remove('show');
}



let editPageClosing = function() {
    let passEditPage = document.querySelector('.pass-edit-page');
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    passEditPage.classList.remove('show');
    passShowUpPage.classList.add('show');
    passShowUpPage.querySelector('.master-pass').value = '';
    passEditPage.querySelectorAll('input').forEach((input)=>{
        input.tabIndex = -1;
    })
    passEditPage.querySelectorAll('button').forEach((button)=>{
        button.tabIndex = -1;
    })
}


let sharedPassDetailPageClosing = function() {
    let sharedPassDetailPage = document.querySelector('.shared-pass-detail-page');
    if (sharedPassDetailPage.classList.contains('show')) sharedPassDetailPage.classList.remove('show');
    document.querySelector('.show-background').classList.remove('show');
}




$("left-bar").addEventListener("click", function (e) {
    let target = e.target;
    if ( target.tagName.toLowerCase() === "h4" && !target.classList.contains('selected') ) {
        let leftBars = document.querySelectorAll(".left-bar h4");
        leftBars.forEach((item) => {
            item.classList.remove("selected");
        });
        selectionLeftBar(target);
    }
    if ( target.classList.contains('folders-revoke-btn') ) {
        let folderBar = $('folder-bar');
        if ( folderBar.classList.contains('hide') ) folderBar.classList.remove('hide');
        let rightBar = $('right-bar');
        if ( !rightBar.classList.contains('hide') ) rightBar.classList.add('hide');
    }
    if ( target.classList.contains('logout') ) logOut();
    if ( target.classList.contains('shared-by-me-revoke-btn') ) {
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
    }
    if ( target.classList.contains('password-page-revoke-btn') ) {
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
    }
    if ( target.classList.contains('shared-with-me-revoke-btn') ) {
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
    }
})

document.querySelector('.right-bar').addEventListener('click', async function(e) {
    let target = e.target;
    let inputPage = document.querySelector('.input-page');
    if ( target.classList.contains('new-pass-btn') ) {
        if (!inputPage.classList.contains('show') && !document.querySelector('.pass-show-up-page').classList.contains('show')) {
            let responce = await fetch('/inputStarter',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await responce.json();
            inputPage.querySelector('.inCode').innerText = data.inCode ;
            inputPage.classList.add('show');
            document.querySelector('.show-background').classList.add('show');
            inputPage.querySelectorAll('input').forEach((input)=>{
                input.tabIndex = 1;
            })
            inputPage.querySelectorAll('button').forEach((button)=>{
                button.tabIndex = 1;
            })
        }
    }
})


document.querySelector('.show-background').addEventListener('click',function(){
    if ( document.querySelector('.input-page').classList.contains('show') ) inputPageClosing();
    if ( document.querySelector('.pass-show-up-page').classList.contains('show') ) showUpPageClosing();
    let sfp = document.querySelector('.select-folders-page');
    if ( sfp.classList.contains('show') ) {
        sfp.classList.remove('show');
        document.querySelector('.show-background').classList.remove('show');
    }
    if (document.querySelector('.shared-pass-detail-page').classList.contains('show'))sharedPassDetailPageClosing();
})