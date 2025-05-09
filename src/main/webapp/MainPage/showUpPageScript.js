
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

document.querySelector('.psp-main .show-up-toggle').addEventListener('click',function(){
    document.querySelector('.psp-master-pass').classList.remove('hide');
})

let masterPassGetFunc = async function(){
    let responce = await fetch('/password/passGetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass_id : document.querySelector('.psp-pass-id').innerText,
            master_pass : document.querySelector('.psp-master-pass').querySelector('input').value
        })
    })
    let data = await responce.json();
    console.log(data);
    if ( data.result == 'success' ) {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        passUpPage.querySelector('.password .value').innerText = data.pass;
        passUpPage.querySelector('.psp-master-pass').classList.add('hide');
    }
    else {
        document.querySelector('.psp-master-pass').querySelector('input').value = '';
        alert('Wrong Master Password');
    } 
}

document.querySelector('.master-pass-submit').addEventListener('click', masterPassGetFunc )

// setUp();