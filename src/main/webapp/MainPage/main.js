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


$("left-bar").addEventListener("click", function (e) {
    console.log(e.target);
    let element = e.target;
    if ( element.tagName.toLowerCase() === "h4" && !element.classList.contains('selected') ) {
        let leftBars = document.querySelectorAll(".left-bar h4");
        leftBars.forEach((item) => {
            item.classList.remove("selected");
        });
        selectionLeftBar(element);
    }
})

let profileSetUp = async function () {
    let response = await fetch('/password/signCheck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await response.json();
    console.log(data)
    if (data.result === 'failure') {
        window.location.href = '/password/';
    }
    $('profile .profile-name').innerText = data.user_name;
}

let logOut = async function () {
    await fetch('/password/signOut', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    setTimeout(() => {
        window.location.href = '/password/';
    }, 1000);
}

$('left-bar-bottom .logout').addEventListener('click', logOut );

profileSetUp();