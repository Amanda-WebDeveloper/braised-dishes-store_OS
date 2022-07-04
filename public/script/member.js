//會員中心內容切換
    let fieldsets = document.querySelectorAll('.box__fieldset');
    
    for (i = 0; i < fieldsets.length; i++) {
        let fieldset = fieldsets[i];
        fieldset.onclick = function () {
            for (i = 0; i < fieldsets.length; i++) {
                fieldsets[i].classList.remove('active_fieldset');
            }
            fieldset.classList.add('active_fieldset');
        }
    }


//會員登入
    let loginForm = document.querySelector('#login_form');
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        sendLoginData(loginForm);
    });

    function sendLoginData (loginForm) {
        const XHR = new XMLHttpRequest();
        const FD = new FormData(loginForm);

        XHR.open('POST', '/login_check', true);
        XHR.responseType = 'json';

        XHR.addEventListener('error', function () {
            window.alert('登入失敗，請重新登入');
            console.log('The data sending is failed.');
        });
        XHR.addEventListener('load', function () {
            if (XHR.response) {
                window.alert('登入成功');
                console.log('Data sent and response loaded.');

                let tokens = XHR.response;
                sessionStorage.setItem('name', tokens.name);
                sessionStorage.setItem('birthday', tokens.birthday);
                sessionStorage.setItem('tel', tokens.tel);

                window.location.href = "/member_login.html";
                
            } else {
                window.alert('登入失敗，請重新登入');
                loginForm.reset();
            }
            
        });

        XHR.send(FD);
    }


//忘記密碼
let forgotPasswordForm = document.querySelector('#forgot_password_form');
let passwordResetTime = document.querySelector('#password_reset_time');
let account = document.querySelector('#account_forgot');

forgotPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const XHR = new XMLHttpRequest();
    const FD = new FormData(forgotPasswordForm);

    XHR.open('POST', '/forgot_password', true);
    XHR.responseType = 'json';

    XHR.addEventListener('error', function () {
        window.alert('會員驗證失敗');
        console.log('The data sending is failed.');
    });
    XHR.addEventListener('load', function () {
        if (XHR.response) {
            window.alert('會員驗證成功，請至註冊之eamil收取會員信！');
            console.log('Data sent and response loaded.');
            let token = XHR.response;
            localStorage.setItem('account', account.value);
            setTimeout(function () {
                localStorage.removeItem('account');
            }, 600000);
            
            window.location.href = "/member.html";
                
        } else {
            window.alert('會員驗證失敗');
            form.reset();
        }
            
    });

    XHR.send(FD);
    
});


//忘記帳號
let forgotAccountForm = document.querySelector('#forgot_account_form');

forgotAccountForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const XHR = new XMLHttpRequest();
    const FD = new FormData(forgotAccountForm);

    XHR.open('POST', '/forgot_account', true);
    XHR.responseType = 'text';

    XHR.addEventListener('error', function () {
        window.alert('會員驗證失敗');
        console.log('The data sending is failed.');
    });
    XHR.addEventListener('load', function () {
        if (XHR.response) {
            window.alert(XHR.response);
            console.log('Data sent and response loaded.');
            window.location.href = "/member.html";
                
        } else {
            window.alert('會員驗證失敗');
            form.reset();
        }
            
    });

    XHR.send(FD);

});



//加入會員
let registerForm = document.querySelector('#register_form');
let password = document.querySelector('#password');
let passwordAgain = document.querySelector('#password_again');

passwordAgain.addEventListener('input', function () {
    
    if (passwordAgain.value !== password.value) {
        passwordAgain.setCustomValidity('輸入內容與密碼不符，請重新輸入');
        
    } else {
        passwordAgain.setCustomValidity('');
    }
});

//會員註冊頁面初始化
const verification = document.querySelector('#verification_background');

window.onload = function () {
    verification.classList.add('unactive_verification');
};

const emailCheckBtn = document.querySelector('#email_check');
const emailInput = document.querySelector('#email');
const codeAns = document.querySelector('#code_ans');

let email;

emailCheckBtn.addEventListener('click', function (e) {
    e.preventDefault();

    email = emailInput.value;
    sendEmailCheck(email);

    verification.classList.remove('unactive_verification');
});

function sendEmailCheck(email) {
    const XHR = new XMLHttpRequest();
    const FD = new FormData();
    FD.append('email', email);

    XHR.open('POST', '/email_check', true);
    XHR.responseType = 'json';

    XHR.addEventListener('error', function () {
        window.alert('會員驗證信寄送失敗');
        console.log('The sending of verification mail is failed.');
    });
    XHR.addEventListener('load', function () {
        if (XHR.response) {
            codeAns.value = XHR.response;

            window.alert('會員驗證碼已寄送至您註冊的email信箱，若關閉驗證畫面請重新註冊');
            console.log('The sending of verification mail is successed.');
        } else {
            window.alert('會員驗證系統錯誤');
            console.log('There is something wrong in verification.');
        }
    });

    XHR.send(FD);
}

const registerBtn = document.querySelector('#register_btn');
const codeInput = document.querySelector('#code_input');

registerBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (codeInput.value === codeAns.value) {
        registerForm.submit();
    } else {
        window.alert('驗證碼輸入錯誤');
    }
});




//清除上一頁表單資料
window.onunload = function () {

    let loginForm = document.querySelector('#login_form');
    let registerForm = document.querySelector('#register_form');
    loginForm.reset();
    registerForm.reset();
}





