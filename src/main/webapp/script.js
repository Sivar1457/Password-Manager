let postMethod = function(data) {
    
}

let checkOut = async function() {
    const response = await fetch('/password/signCheck',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
    if (data.result === 'success') {
        setTimeout(() => {
            window.location.href = '/password/MainPage/main.jsp';
        }, 1000);
    }
    else {
        setTimeout(() => {
            window.location.href = '/password/Sign/sign.jsp';
        }, 1000);
    }
}
checkOut();