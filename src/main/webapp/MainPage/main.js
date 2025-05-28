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

$('left-bar .folders-revoke-btn').addEventListener('click',function() {
    let folderBar = $('folder-bar');
    if ( folderBar.classList.contains('hide') ) folderBar.classList.remove('hide');
    let rightBar = $('right-bar');
    if ( !rightBar.classList.contains('hide') ) rightBar.classList.add('hide');
})

$('left-bar-bottom .logout').addEventListener('click', logOut );

profileSetUp();