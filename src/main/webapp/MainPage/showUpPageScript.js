
function setUp() {
    passwordCollector.forEach((password) => {
        passwordSetter(password);
    })
}

let passwordSetter = function (password) {
    let passPage = rightBar.querySelector('.password-page .my-passes');
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
    let passUpPage = document.querySelector('.pass-show-up-page');
    let inputPage = document.querySelector('.input-page');
    pass.addEventListener('click', function (eve) {
        if (!passUpPage.classList.contains('show') && !eve.target.classList.contains('pass-shared-btn') && !eve.target.classList.contains('pass-shared-with-btn')) {
            passUpPage.querySelector('.pass-name').innerText = pass.querySelector('.name').innerText;
            passUpPage.querySelector('.pass-date').innerText = pass.querySelector('.date-time').innerText;
            passUpPage.querySelector('.username .value').innerText = pass.querySelector('.username').innerText;
            passUpPage.querySelector('.password .value').innerText = "********";
            passUpPage.querySelector('.url .value').innerText = pass.querySelector('.web-url').innerText;
            passUpPage.querySelector('.description .value').innerText = pass.querySelector('.description').innerText;
            passUpPage.querySelector('.pass-date').innerText = pass.querySelector('.date-time').innerText ;
            passUpPage.querySelector('.psp-pass-id').innerText = pass.querySelector('.pass-id').innerText;
            document.querySelector('.show-background').classList.add('show');
            if (!passUpPage.classList.contains('show') && !inputPage.classList.contains('show')) {
                passUpPage.classList.add('show');
            }
        }
    })
})

let masterPassCurr = null;

let getPass = async function(pass){
    let responce = await fetch('/passGetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_name : document.querySelector('.profile-name').innerText,
            pass_id : document.querySelector('.psp-pass-id').innerText,
            master_pass : pass
        })
    })
    return await responce.json();
}

let masterPassGetFunc = async function() {
    let pass = document.querySelector('.psp-master-pass').querySelector('input').value
    let data = await getPass(pass);
    let passUpPage = document.querySelector('.pass-show-up-page');
    if ( data.result == 'success' ) {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        passUpPage.querySelector('.password .value').innerText = data.pass;
        masterPassClosing();
        document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
        document.querySelector('.psp-main .show-up-toggle').classList.remove('fa-eye');
        document.querySelector('.psp-main .show-up-toggle').classList.add('fa-eye-slash');
    }
    else {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        alert('Wrong Master Password');
    } 
}


let updatePass = async function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let pspMain = passShowUpPage.querySelector('.psp-main');
    let passEditPage = document.querySelector('.pass-edit-page');
    let passId = passShowUpPage.querySelector('.psp-pass-id').innerText;
    let responce = await fetch('/passUpdate', {
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

let getHistory = async function(){
    let responce = await fetch('/historyGetter', {
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

let editDataFunc = async function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let pspMain = passShowUpPage.querySelector('.psp-main');
    let passEditPage = document.querySelector('.pass-edit-page');
    let passData = await getPass(passShowUpPage.querySelector('.master-pass').value);
    console.log(passData);
    if ( passData.result == 'success' ) {
        masterPassClosing();
        document.querySelector('.psp-main .show-up-toggle').classList.remove('on');
        passShowUpPage.classList.remove('show');
        passEditPage.classList.add('show');passEditPage.querySelectorAll('input').forEach((input)=>{
            input.tabIndex = 1;
        })
        passEditPage.querySelectorAll('button').forEach((button)=>{
            button.tabIndex = 1;
        })
        passEditPage.querySelector('.pep-input-name').value = passShowUpPage.querySelector('.psp-up .details .pass-name').innerText;
        passEditPage.querySelector('.pep-input-user-name').value = pspMain.querySelector('.username .value').innerText;
        passEditPage.querySelector('.pep-input-password').value = passData.pass;
        passEditPage.querySelector('.pep-input-url').value = pspMain.querySelector('.url .value').innerText;
        passEditPage.querySelector('.pep-input-description').value = pspMain.querySelector('.description .value').innerText;
    }
    else {
        passShowUpPage.querySelector('.master-pass').value = '';
        alert('Wrong Master Password');
    }
}


let shareFunc = async function(){
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    let passData = await getPass(passShowUpPage.querySelector('.master-pass').value);
    if ( passData.result == 'success' ) {
        masterPassClosing();
        let pspShare = passShowUpPage.querySelector('.psp-share');
        if ( pspShare.classList.contains('hide') ) {
            pspShare.classList.remove('hide');
            getUsers();
        }
        else {
            pspShare.classList.add('hide');
            passShowUpPage.querySelector('.master-pass').value = '';
        }
    }
    else {
        alert('Wrong Master Password');
    }
}

let getUsers = async function(){
    let responce = await fetch('/userGetter' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            type : "allUsers",
            user_name : document.querySelector('.profile-name').innerText,
            pass_id : document.querySelector('.psp-pass-id').innerText
        })
    })
    let pass = document.querySelector('.pass-show-up-page').querySelector('.master-pass').value;
    document.querySelector('.pass-show-up-page').querySelector('.master-pass').value = '';
    let data = await responce.json();
    let shareUserList = document.querySelector('.psp-share .psp-share-user-list');
    shareUserList.innerHTML = '';
    data.forEach((user)=>{
        let userDiv = document.createElement('div');
        userDiv.className = 'psp-share-user';
        let userName = document.createElement('p');
        userName.className = 'psp-share-user-name';
        userName.innerText = user.user_name;
        let userEmail = document.createElement('p');
        userEmail.classList.add('psp-share-user-email');
        userEmail.innerText = user.email;
        let shareBtn = document.createElement('button');
        if ( user.related != 'related' ) {
            shareBtn.classList.add('psp-share-user-btn');
            shareBtn.innerText = 'Share';
            shareBtn.addEventListener('click' , function(){
                sharePassToUser(user.user_name,pass);
                shareBtn.innerText = 'Shared';
                shareBtn.setAttribute('disabled','true');
                shareBtn.classList.add('disabled');
                shareBtn.classList.remove('psp-share-user-btn');
            })
        }
        else {
            shareBtn.classList.add('psp-share-user-btn');
            shareBtn.innerText = 'Shared';
            shareBtn.setAttribute('disabled','true');
            shareBtn.classList.add('disabled');
        }
        userDiv.append(userName,userEmail,shareBtn);
        shareUserList.append(userDiv);
        console.log(user);
    })
}

let sharePassToUser = async function(userName,pass){
    let responce = await fetch('/passShare', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass_id : document.querySelector('.psp-pass-id').innerText,
            user_name : userName,
            master_pass : pass
        })
    })
    let data = await responce.json();
}

let showMasterPassInput = function(){
    let masterPass = document.querySelector('.psp-master-pass');
    document.querySelector('.master-pass-submit').tabIndex = 1 ;
    masterPass.classList.remove('hide');
    masterPass.querySelector('input').tabIndex = 1 ;
    masterPass.querySelector('input').focus();
}

let masterPassClosing = function() {
    let masterPass = document.querySelector('.psp-master-pass');
    document.querySelector('.master-pass-submit').tabIndex = -1 ;
    masterPass.classList.add('hide');
    masterPass.querySelector('input').tabIndex = -1 ;
}

document.querySelector('.pass-show-up-page').addEventListener('click',async function(e){
    let target = e.target;
    console.log(target);
    let passUpPage = document.querySelector('.pass-show-up-page');
    if ( target.classList.contains('close-btn') ) {
        showUpPageClosing();
        sharedPassDetailPageClosing();
    }
    if ( target.classList.contains('fa-eye') ) {
        document.querySelector('.master-pass').placeholder = "Enter the master password for showing password" ;
        let toggleIcon = document.querySelector('.psp-main .show-up-toggle');
        if ( document.querySelector('.psp-master-pass').classList.contains('hide') ) {
            showMasterPassInput();
            toggleIcon.classList.add('on');
        }
        else if ( !(masterPassCurr == 'showPass' )) {
            toggleIcon.classList.add('on');
            masterPassCurr = 'showPass';
        }
        else {
            masterPassClosing();
            toggleIcon.classList.remove('on');
        }
        masterPassCurr = 'showPass';
    }
    if ( target.classList.contains('fa-eye-slash') ) {
        document.querySelector('.psp-main .show-up-toggle').classList.remove('fa-eye-slash');
        document.querySelector('.psp-main .show-up-toggle').classList.add('fa-eye');
        passUpPage.querySelector('.password .value').innerText = "********";
    }



    // Master password submit event listener funcs
    if ( target.classList.contains('master-pass-submit') ) {
        if ( masterPassCurr == 'showPass' ) {
            masterPassGetFunc();
        }
        else if ( masterPassCurr == 'editPass' ) {
            editDataFunc();
        }
        else if ( masterPassCurr == 'sharePass' ) {
            shareFunc();
        }
    }


    //                              History Button Event Listeners
    if ( target.classList.contains('history-btn') ) {
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
    }
    // History tab close btn
    if ( target === document.querySelector('.psp-history .ph-top i') ) {
        document.querySelector('.psp-history').classList.add('hide');
    }
    
    
    
    //                              Edit Button Event Listeners
    
    if ( target.classList.contains('edit-btn') ) {
        document.querySelector('.master-pass').placeholder = "Enter the master password for editing password" ;
        if ( document.querySelector('.psp-master-pass').classList.contains('hide') || !(masterPassCurr == 'editPass' )) {
            showMasterPassInput();
            masterPassCurr = 'editPass';
        }
        else {
            document.querySelector('.psp-master-pass').classList.add('hide');
        }
    }
    if ( target.classList.contains('pep-update-btn') ) {
        updatePass();
        document.querySelector('.show-background').classList.add('show');
    }
    
    
    
    // share password btn event listener
    
    if ( target.classList.contains('share-btn') ) {
        document.querySelector('.master-pass').placeholder = "Enter the master password for sharing password" ;
        if ( document.querySelector('.psp-master-pass').classList.contains('hide') || !(masterPassCurr == 'sharePass' )) {
            showMasterPassInput();
            masterPassCurr = 'sharePass';
        }
        else {
            document.querySelector('.psp-master-pass').classList.add('hide');
        }
    }
    if ( target.classList.contains('psp-share-close-btn') ) {
        document.querySelector('.psp-share').classList.add('hide');
        document.querySelector('.psp-share .psp-share-user-list').innerHTML = '';
    }




    //move to folder btn event listener
    
    if ( target.classList.contains('move-to-folder-btn') ) {
        let sfp = document.querySelector('.select-folders-page');
        if ( !sfp.classList.contains('show') ) {
            let responce = await fetch('/folderGetter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_name: document.querySelector('.profile-name').innerText,
                    pass_id: document.querySelector('.psp-pass-id').innerText
                })
            });
            let data = await responce.json();
            if ( data ) {
                let sfpMain = sfp.querySelector('.sfp-main');
                sfpMain.innerText = '';
                data.forEach((folder) => {
                    let sfpDiv = document.createElement('div');
                    sfpDiv.innerText = folder.folder_name;
                    if ( folder.isContains == 'yes' ) {
                        sfpDiv.classList.add('sfp-added-folder');
                    }
                    else {
                        sfpDiv.classList.add('sfp-folder');
                        sfpDiv.addEventListener('click',async function () {
                            let responceNext = await fetch('/folderPassAdder',{
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    folder_name: folder.folder_name,
                                    pass_id: document.querySelector('.psp-pass-id').innerText
                                })
                            })
                            sfpDiv.classList.add('sfp-added-folder');
                            sfpDiv.classList.remove('sfp-folder');
                        })
                    }
                    sfpMain.appendChild(sfpDiv);
                })
            }
        }
        sfp.classList.toggle('show');
        if(!document.querySelector('.show-background').classList.contains('show'))document.querySelector('.show-background').classList.add('show');
    }
})


document.querySelector('.pass-edit-page').addEventListener('click',function(e){
    let target = e.target;
    let passEditPage = document.querySelector('.pass-edit-page');
    let passShowUpPage = document.querySelector('.pass-show-up-page');
    if ( target.classList.contains('pep-close-btn') ) {
        editPageClosing();
    }
    if ( target.classList.contains('toggle-password') ) {
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
    }
    if ( target.classList.contains('pep-cancel-btn') ) {
        editPageClosing();
    }
})

// closing tab for all input in edit page
document.querySelector('.pass-edit-page').querySelectorAll('input').forEach((input)=>{
    input.tabIndex = -1;
})
document.querySelector('.pass-edit-page').querySelectorAll('button').forEach((button)=>{
    button.tabIndex = -1;
})

document.querySelector('.psp-master-pass').querySelector('input').tabIndex = -1 ;
document.querySelector('.master-pass-submit').tabIndex = -1 ;