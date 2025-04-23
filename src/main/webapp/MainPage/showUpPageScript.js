
function setUp() {
    let passPage = rightBar.querySelector('.password-page');
    passwordCollector.forEach((password) => {
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
        div.addEventListener('click' , function(){
            passUpPage.querySelector('.pass-name').innerText = password.name;
            passUpPage.querySelector('.pass-date').innerText = password.date;
            passUpPage.querySelector('.username .value').innerText = password.userName;
            passUpPage.querySelector('.password .value').innerText = password.password;
            passUpPage.querySelector('.url .value').innerText = password.url;
            passUpPage.querySelector('.description .value').innerText = password.description;
            passUpPage.classList.toggle('show');
        })
    })
}

setUp();