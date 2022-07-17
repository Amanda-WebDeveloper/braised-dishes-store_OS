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
let codePWDReset = document.querySelector('#code_pwd_reset');

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
            window.alert('會員驗證碼已寄送至您註冊的email信箱，若關閉驗證畫面請重新輸入會員資料');
            console.log('Data sent and response loaded.');

            let tokens = XHR.response;
            codePWDReset.value = tokens.code;
            sessionStorage.setItem('account', account.value);

            setTimeout(function () {
                sessionStorage.removeItem('account');
            }, 180000);
            
            verification.classList.remove('unactive_verification');
                
        } else {
            window.alert('會員驗證失敗');
            forgotPasswordForm.reset();
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
            window.alert('會員驗證成功，請至您註冊的email收取會員信');
            console.log('Data sent and response loaded.');
            window.location.href = "/member.html";
                
        } else {
            window.alert('會員驗證失敗');
            form.reset();
        }  
    });
    XHR.send(FD);
});



/* 加入會員 */

//密碼確認
let password = document.querySelector('#password');
let passwordAgain = document.querySelector('#password_again');

passwordAgain.addEventListener('input', function () {

    if (passwordAgain.value !== password.value) {
        passwordAgain.classList.add('error');
        
    } else {
        passwordAgain.classList.remove('error');
    }
});



//會員註冊email驗證以及表單資料有效性檢查
const emailCheckBtn = document.querySelector('#email_check');
const codeRegister = document.querySelector('#code_register');
const verification = document.querySelector('#verification_background');
const registerForm = document.querySelector('#register_form');
const formElements = registerForm.querySelectorAll('input');

let validity = [];

emailCheckBtn.addEventListener('click', function (e) {

    formElements.forEach((formElement, i) => {
        setValidation(formElement, i, validity);
    });

    if (passwordAgain.value === password.value && validity.length > 0 && validity.every(value => value === 1)) {
        verification.classList.remove('unactive_verification');

        const emailInput = document.querySelector('#email');
        let email = emailInput.value;

        sendEmailCheck(email);
    } 
});
 
    
formElements.forEach((formElement, i) => {
    formElement.addEventListener('blur', function () {
        setValidation(formElement, i, validity);
    });
});


function setValidation(formElement, i, validity) {
    if (formElement.validity.valueMissing) {
        formElement.setCustomValidity('請輸入或點選您的回答');
        formElement.reportValidity();
        validity[i] = 0;
    } else if (formElement.validity.typeMismatch) {
        formElement.setCustomValidity('請輸入有效內容');
        formElement.reportValidity();
        validity[i] = 0;
    } else if (formElement.validity.patternMismatch) {
        formElement.setCustomValidity('請依指定格式輸入內容');
        formElement.reportValidity();
        validity[i] = 0;
    } else if (formElement.validity.tooLong) {
        formElement.setCustomValidity('請輸入4到8個字元');
        formElement.reportValidity();
        validity[i] = 0;
    } else if (formElement.validity.tooShort) {
        formElement.setCustomValidity('請輸入4到8個字元');
        formElement.reportValidity();
        validity[i] = 0;
    }else {
        formElement.setCustomValidity('');
        validity[i] = 1;
    }
}


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
            codeRegister.value = XHR.response;

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

    if (codeInput.value === codeRegister.value) {
        registerForm.submit();

    } else if (codeInput.value === codePWDReset.value) {
        window.alert('驗證成功，即將轉跳至密碼重設頁面');
        window.location.href = "/password_reset.html";
    
    } else {
        window.alert('驗證碼輸入錯誤');
    }
});



//會員註冊頁面初始化
window.onload = function () {
    verification.classList.add('unactive_verification');
};



//清除上一頁資料
window.onunload = function () {
    loginForm.reset();
    registerForm.reset();
    codeRegister.value = '';
    codeInput.value = '';
    sessionStorage.removeItem('account');
}





