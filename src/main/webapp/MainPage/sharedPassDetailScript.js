document.querySelectorAll('.pass-share-by').forEach((pass) => {
    pass.querySelector('.pass-shared-btn').addEventListener('click', async function () {
        let sharedPassDetailPage = document.querySelector('.shared-pass-detail-page');
        if (!sharedPassDetailPage.classList.contains('show')) {
            sharedPassDetailPage.classList.add('show');
            document.querySelector('.show-background').classList.add('show');
        }
        let passId = pass.querySelector('.pass-id').innerText;
        sharedPassDetailPage.querySelector('.spd-web-title').innerText = pass.querySelector('.name').innerText;
        let responce = await fetch('/password/userGetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type : "sharedWithUsers",
                passId: passId
            })
        })
        let data = await responce.json();
        let spdData = sharedPassDetailPage.querySelector('.spd-data');
        spdData.querySelector('.spd-owner-name').innerText = data.ownerName;
        let spdSharedWith = spdData.querySelector('.spd-shared-with-users');
        spdSharedWith.innerHTML = '';
        data.sharedUsers.forEach((user) => {
            let p = document.createElement('p');
            p.innerText = user;
            spdSharedWith.appendChild(p);
        })
    })
})

document.querySelectorAll('.pass-share-with').forEach((pass)=>{
    pass.querySelector('.pass-shared-with-btn').addEventListener('click',async function () {
        let sharedPassDetailPage = document.querySelector('.shared-pass-detail-page');
        if (!sharedPassDetailPage.classList.contains('show')) {
            sharedPassDetailPage.classList.add('show');
            document.querySelector('.show-background').classList.add('show');
        }
        let passId = pass.querySelector('.pass-id').innerText;
        sharedPassDetailPage.querySelector('.spd-web-title').innerText = pass.querySelector('.name').innerText;
        let responce = await fetch('/password/userGetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type : "sharedWithMe",
                passId: passId
            })
        })
        let data = await responce.json();
        let spdData = sharedPassDetailPage.querySelector('.spd-data');
        spdData.querySelector('.spd-owner-name').innerText = data.ownerName;
        let spdSharedWith = spdData.querySelector('.spd-shared-with');
        if (!spdSharedWith.classList.contains('hide')) spdSharedWith.classList.add('hide');
    })
})

document.querySelector('.spd-close-btn').addEventListener('click',sharedPassDetailPageClosing)