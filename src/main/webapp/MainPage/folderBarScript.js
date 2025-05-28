document.querySelector('.folder-bar').addEventListener('click',async function(e){
    let target = e.target;
    console.log(target.classList);
    let folderBar = document.querySelector('.folder-bar');
    if ( target.classList.contains('new-fold-btn') ) {
        let inputOuter = folderBar.querySelector('.fb-input-outer');
        let input = inputOuter.querySelector('input');
        if ( inputOuter.classList.contains('hide') ) {
            inputOuter.classList.remove('hide');
            input.tabIndex = 0;
            input.focus();
            input.value = '';
        }
        else {
            input.tabIndex = -1 ;
            inputOuter.classList.add('hide');
        }
    }
    if ( target.classList.contains('fb-new-fold-input-btn') ) {
        let inputOuter = folderBar.querySelector('.fb-input-outer');
        let input = inputOuter.querySelector('input');
        if ( input.value.trim() === '' ) {
            alert('Please enter a folder name');
            return;
        }
        let response = await fetch('/password/folderCreator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folder_name: input.value.trim(),
                user_name: document.querySelector('.profile .profile-name').innerText
            })
        });
        let data = await response.json();
        if ( data.status === 'success' ) {
            let folderDiv = document.createElement('div');
            folderDiv.classList.add('fb-folder');
            let h3 = document.createElement('h3');
            h3.innerText = input.value.trim();
            folderDiv.appendChild(h3);
            folderBar.querySelector('.fbm-left').appendChild(folderDiv);
            input.value = '';
            inputOuter.classList.add('hide');
            input.tabIndex = -1;
        }
    }
    if ( target.classList.contains('fb-folder') || target.classList.contains('fb-folder-name') ) {
        let fbmRight = folderBar.querySelector('.fbm-right');
        fbmRight.querySelector('.fbm-rtop .fbm-name').innerText = (target.querySelector('h3')) ? target.querySelector('h3').innerText : target.innerText;
        if ( fbmRight.classList.contains('hide') ) fbmRight.classList.remove('hide');
        let key = (target.querySelector('h3')) ? target.id : target.parentElement.id;
        key = key.replace('fb-folder-', '');
        fbmRight.querySelector('.fbm-pass-id').innerText = key;
        // if (!fbmRight.querySelector(`.fbm-rmain #fbm-pass-${key}`)) {
        //     fbmRight.querySelector('.fb-pass-empty-container').classList.remove('hide')
        //     console.log(folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide'))
        //     if(folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide'))folderBar.querySelector(`.selected-arrow-${key}`).classList.remove('hide');
        //     console.log(folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide'))
        // };
        // fbmRight.querySelectorAll('.fbm-rmain .fb-pass-container').forEach((container) => {
        //     if ( container.id == `fbm-pass-${key}` ) {
        //         container.classList.remove('hide');
        //         if(folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide'))folderBar.querySelector(`.selected-arrow-${key}`).classList.remove('hide');
        //         fbmRight.querySelector('.fb-pass-empty-container').classList.add('hide');
        //     }
        //     else if (fbmRight.querySelector('.fb-pass-empty-container').classList.contains('hide')) {
        //         container.classList.add('hide');
        //         console.log(folderBar.querySelector(`.selected-arrow-${key}`));
        //     }
        //     else {
        //         container.classList.add('hide');

        //     }
        // })
        let emptyContainer = fbmRight.querySelector('.fb-pass-empty-container');
        fbmRight.querySelectorAll('.fbm-rmain .fb-pass-container').forEach((container) => {
            let spareKey = container.id.replace('fbm-pass-', '');
            if ( spareKey == key ) {
                if ( container.querySelector('.pass') ) {
                    container.classList.remove('hide');
                    if ( !emptyContainer.classList.contains('hide') ) emptyContainer.classList.add('hide');
                }
                else{ 
                    if (emptyContainer.classList.contains('hide')) emptyContainer.classList.remove('hide');
                }
                if ( folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide') ) {
                    folderBar.querySelector(`.selected-arrow-${key}`).classList.remove('hide');
                }
            }
            else {
                container.classList.add('hide');
                if ( !emptyContainer.classList.contains('hide') ) emptyContainer.classList.add('hide');
                if ( folderBar.querySelector(`.selected-arrow-${spareKey}`) && !folderBar.querySelector(`.selected-arrow-${spareKey}`).classList.contains('hide') ) {
                    folderBar.querySelector(`.selected-arrow-${spareKey}`).classList.add('hide');
                }
            }
        })
    }
    if ( target.classList.contains('fbm-close-btn') ) {
        let fbmRight = folderBar.querySelector('.fbm-right');
        fbmRight.classList.add('hide');
        let key = fbmRight.querySelector('.fbm-pass-id').innerText;
        if ( !folderBar.querySelector(`.selected-arrow-${key}`).classList.contains('hide') ) {
            folderBar.querySelector(`.selected-arrow-${key}`).classList.add('hide');
        }
        if ( !fbmRight.querySelector('.fb-pass-empty-container').classList.contains('hide') ) {
            fbmRight.querySelector('.fb-pass-empty-container').classList.add('hide');
        }
    } 
})
document.querySelector('.folder-bar .fb-input-outer input').tabIndex = -1;