
function setUp() {
    passwordCollector.forEach((password) => {
        passwordSetter(password);
    })
}

let passwordSetter = function (password) {
    let passPage = rightBar.querySelector('.password-page');
    let div = document.createElement('div');
    div.className = 'pass';
    div.id = 'pass' + password.id;
    let h2 = document.createElement('h2');
    h2.className = 'name';
    h2.innerText = password.name;
    let p = document.createElement('p');
    p.className = 'username';
    p.innerText = password.userName;
    div.appendChild(h2);
    div.appendChild(p);
    passPage.appendChild(div);
    // div.addEventListener('click', function () {
    //     if (!passUpPage.classList.contains('show')) {
    //         passUpPage.querySelector('.pass-name').innerText = password.name;
    //         passUpPage.querySelector('.pass-date').innerText = password.date;
    //         passUpPage.querySelector('.username .value').innerText = password.userName;
    //         passUpPage.querySelector('.password .value').innerText = password.password;
    //         passUpPage.querySelector('.url .value').innerText = password.url;
    //         passUpPage.querySelector('.description .value').innerText = password.description;
    //         if (!passUpPage.classList.contains('show') && !inputPage.classList.contains('show')) {
    //             passUpPage.classList.add('show');
    //         }
    //     }
    // })
}

document.querySelectorAll('.pass').forEach((pass)=>{
    pass.addEventListener('click', function () {
        if (!passUpPage.classList.contains('show')) {
            passUpPage.querySelector('.pass-name').innerText = pass.querySelector('.name').innerText;
            passUpPage.querySelector('.pass-date').innerText = pass.querySelector('.date-time').innerText;
            passUpPage.querySelector('.username .value').innerText = pass.querySelector('.username').innerText;
            passUpPage.querySelector('.password .value').innerText = "********";
            passUpPage.querySelector('.url .value').innerText = pass.querySelector('.web-url').innerText;
            passUpPage.querySelector('.description .value').innerText = pass.querySelector('.description').innerText;
            passUpPage.querySelector('.pass-date').innerText = pass.querySelector('.date-time').innerText ;
            passUpPage.querySelector('.psp-pass-id').innerText = pass.querySelector('.pass-id').innerText;
            if (!passUpPage.classList.contains('show') && !inputPage.classList.contains('show')) {
                passUpPage.classList.add('show');
            }
        }
    })
})

let masterPassCurr = null;

document.querySelector('.psp-main .fa-eye').addEventListener('click',function(){
    if ( document.querySelector('.psp-main .fa-eye') ) {
        if ( document.querySelector('.psp-master-pass').classList.contains('hide') ) {
            document.querySelector('.psp-master-pass').classList.toggle('hide');
        }
        let toggleIcon = document.querySelector('.psp-main .show-up-toggle');
        toggleIcon.classList.toggle('on');
    }
    masterPassCurr = 'showPass';
})

let getPass = async function(pass){
    let responce = await fetch('/password/passGetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass_id : document.querySelector('.psp-pass-id').innerText,
            master_pass : pass
        })
    })
    return await responce.json();
}

let masterPassGetFunc = async function() {
    let pass = document.querySelector('.psp-master-pass').querySelector('input').value
    let data = await getPass(pass);
    console.log(data);
    if ( data.result == 'success' ) {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        passUpPage.querySelector('.password .value').innerText = data.pass;
        passUpPage.querySelector('.psp-master-pass').classList.add('hide');
        document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
        document.querySelector('.psp-main .show-up-toggle').classList.remove('fa-eye');
        document.querySelector('.psp-main .show-up-toggle').classList.add('fa-eye-slash');
        document.querySelector('.psp-main .fa-eye-slash').addEventListener('click',function(){
            if ( document.querySelector('.psp-main .fa-eye-slash') ) {
                document.querySelector('.psp-main .show-up-toggle').classList.remove('fa-eye-slash');
                document.querySelector('.psp-main .show-up-toggle').classList.add('fa-eye');
                passUpPage.querySelector('.password .value').innerText = "********";
            }
        })
    }
    else {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        alert('Wrong Master Password');
    } 
}

document.querySelector('.master-pass-submit').addEventListener('click', () => {
    if ( masterPassCurr == 'showPass' ) {
        masterPassGetFunc();
    }
    else if ( masterPassCurr == 'editPass' ) {
        editDataFunc();
        document.querySelector('.psp-master-pass').classList.add('hide');
    }
} )

//                              History Button Event Listeners

document.querySelector('span.history-btn').addEventListener('click',async function(){
    let pspHistory = document.querySelector('.psp-history');
    let userNameHistory = document.querySelector('.ph-username-history');
    let passwordHistory = document.querySelector('.ph-pass-history');
    if ( pspHistory.classList.contains('hide') ) {
        pspHistory.classList.remove('hide');
        let historyData = await getHistory();
        if ( historyData.data.length != 0 ) {
            document.querySelector('.ph-no-history').classList.remove('show');
            historyData.data.forEach((history)=>{
                if ( history.pass ) {
                    if ( !passwordHistory.classList.contains('show') ) {
                        passwordHistory.classList.add('show');
                    }
                    let valueDiv = document.createElement('div');
                    valueDiv.className = 'ph-value';
                    let leftDiv = document.createElement('div');
                    leftDiv.className = 'ph-left';
                    let copyBtn = document.createElement('i');
                    copyBtn.className = 'fa-solid fa-copy';
                    let passBox = document.createElement('div');
                    passBox.className = 'ph-pass-box';
                    let p = document.createElement('p');
                    p.className = 'ph-pass';
                    p.innerText = '********';
                    let eye = document.createElement('i');
                    eye.className = 'fa-solid fa-eye';
                    passBox.append(p,eye);
                    leftDiv.append(copyBtn,passBox);
                    let rightDiv = document.createElement('div');
                    rightDiv.className = 'ph-right';
                    let date = document.createElement('p');
                    date.className = 'ph-modify-date';
                    date.innerText = 'May 25, 2025';
                    rightDiv.append(date);
                    valueDiv.append(leftDiv,rightDiv);
                    document.querySelector('.ph-pass-history .ph-values').append(valueDiv);
                }
                if ( history.user_name ) {
                    if ( !userNameHistory.classList.contains('show') ) {
                        userNameHistory.classList.add('show');
                    }
                    let valueDiv = document.createElement('div');
                    valueDiv.className = 'ph-value';
                    let leftDiv = document.createElement('div');
                    leftDiv.className = 'ph-left';
                    let copyBtn = document.createElement('i');
                    copyBtn.className = 'fa-solid fa-copy';
                    let p = document.createElement('p');
                    p.className = 'ph-username';
                    p.innerText = history.user_name;
                    leftDiv.append(copyBtn,p);
                    let rightDiv = document.createElement('div');
                    rightDiv.className = 'ph-right';
                    let date = document.createElement('p');
                    date.className = 'ph-modify-date';
                    date.innerText = 'May 25, 2025';
                    rightDiv.append(date);
                    valueDiv.append(leftDiv,rightDiv);
                    document.querySelector('.ph-username-history .ph-values').append(valueDiv);
                }
            })
        }
    }
    else {
        pspHistory.classList.add('hide');
    }
})

// History tab close btn
document.querySelector('.psp-history .ph-top i').addEventListener('click',function(){
    document.querySelector('.psp-history').classList.add('hide');
})

// share password btn event listener
document.querySelector('span.share-btn').addEventListener('click',function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let pspShare = passShowUpPage.querySelector('.psp-share');
    if ( pspShare.classList.contains('hide') ) {
        pspShare.classList.remove('hide');
    }
    else {
        pspShare.classList.add('hide');
    }
})

let getUsers = async function(){
    
}

//                              Edit Button Event Listeners
let editDataFunc = async function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let pspMain = passShowUpPage.querySelector('.psp-main');
    let passEditPage = document.querySelector('.pass-edit-page');
    let passData = await getPass(passShowUpPage.querySelector('.master-pass').value);
    passShowUpPage.classList.remove('show');
    passEditPage.classList.add('show');
    passEditPage.querySelector('.pep-input-name').value = passShowUpPage.querySelector('.psp-up .details .pass-name').innerText;
    passEditPage.querySelector('.pep-input-user-name').value = pspMain.querySelector('.username .value').innerText;
    passEditPage.querySelector('.pep-input-password').value = passData.pass;
    passEditPage.querySelector('.pep-input-url').value = pspMain.querySelector('.url .value').innerText;
    passEditPage.querySelector('.pep-input-description').value = pspMain.querySelector('.description .value').innerText;
    passEditPage.querySelector('.pep-close-btn').addEventListener('click',function(){
        passEditPage.classList.remove('show');
        passShowUpPage.classList.add('show');
    })
    passEditPage.querySelector('.pep-password i').addEventListener('click',function(){
        if ( passEditPage.querySelector('.pep-password i').classList.contains('fa-eye') ) {
            passEditPage.querySelector('.pep-password i').classList.remove('fa-eye');
            passEditPage.querySelector('.pep-password i').classList.add('fa-eye-slash');
            passEditPage.querySelector('.pep-input-password').setAttribute('type','text');
        }
        else {
            passEditPage.querySelector('.pep-password i').classList.remove('fa-eye-slash');
            passEditPage.querySelector('.pep-password i').classList.add('fa-eye');
            passEditPage.querySelector('.pep-input-password').setAttribute('type','password');
        }
    })
    passEditPage.querySelector('.pep-cancel-btn').addEventListener('click',function(){
        passEditPage.classList.remove('show');
        passShowUpPage.classList.add('show');
        passShowUpPage.querySelector('.master-pass').value = '';
    })
}
document.querySelector('.pass-show-up-page .edit-btn').addEventListener('click',function(){
    if ( document.querySelector('.psp-master-pass').classList.contains('hide') ) {
        document.querySelector('.psp-master-pass').classList.toggle('hide');
    }
    document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
    masterPassCurr = 'editPass';
})

let updatePass = async function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let pspMain = passShowUpPage.querySelector('.psp-main');
    let passEditPage = document.querySelector('.pass-edit-page');
    let passId = passShowUpPage.querySelector('.psp-pass-id').innerText;
    let responce = await fetch('/password/passUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass_id : passId,
            name : passEditPage.querySelector('.pep-input-name').value,
            userName : passEditPage.querySelector('.pep-input-user-name').value,
            password : passEditPage.querySelector('.pep-input-password').value,
            url : passEditPage.querySelector('.pep-input-url').value,
            description : passEditPage.querySelector('.pep-input-description').value,
            masterPass : passShowUpPage.querySelector('.master-pass').value
        })
    })
    let data = await responce.json();
    passEditPage.classList.remove('show');
    passShowUpPage.classList.add('show');
    // Pass Box Updates
    let passBox = document.querySelector('#pass-' + passId);
    passBox.querySelector('.name').innerText = data.name;
    passBox.querySelector('.username').innerText = data.userName;
    passBox.querySelector('.web-url').innerText = data.url;
    passBox.querySelector('.description').innerText = data.description;
    passBox.querySelector('.date-time').innerText = data.date;
    //Show Up Page Updates
    document.querySelector('.psp-up .details .pass-name').innerText = data.name;
    pspMain.querySelector('.username .value').innerText = data.userName;
    pspMain.querySelector('.password .value').innerText = "********";
    pspMain.querySelector('.url .value').innerText = data.url;
    pspMain.querySelector('.description .value').innerText = data.description;
    passShowUpPage.querySelector('.master-pass').value = '';
}

document.querySelector('.pass-edit-page .pep-update-btn').addEventListener('click',updatePass)

// setUp();



let getHistory = async function(){
    let responce = await fetch('/password/historyGetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass_id : document.querySelector('.psp-pass-id').innerText
        })
    })
    return await responce.json();
}