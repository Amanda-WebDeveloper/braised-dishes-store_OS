

//window.onload = function () {
    
    let header = document.querySelector('header');
    let memberNav = document.querySelector('#member_nav');
    let greeting = document.querySelector('#greeting');
    let logOutLink = document.querySelector('#log_out');
    
    if (sessionStorage.getItem('name')) {
        memberNav.setAttribute('href', 'member_login.html');
        
        greeting.textContent = `${sessionStorage.getItem('name')}`+'，您好！';
        
        logOutLink.textContent = '登出';
        
        logOutLink.onclick = function () {
            sessionStorage.clear();
            window.alert('已登出，如需訂購請重新登入');
            window.location.reload();
        };
        
    } else {
        memberNav.setAttribute('href', 'member.html');
        logOutLink.setAttribute('href', 'member.html');
        
        logOutLink.textContent = '登入';
        
        logOutLink.onclick = function () {
            window.location.href = "/member.html";
        };
        
    }
    
//};


  
