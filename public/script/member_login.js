if (sessionStorage.length > 0) {
    let memberName = document.querySelector('#member_name');
    let memberBirthday = document.querySelector('#member_birthday');
    let memberTel = document.querySelector('#member_tel');
    let memberPoint = document.querySelector('#member_point');
    
    memberName.textContent = sessionStorage.getItem('name');
    memberBirthday.textContent = sessionStorage.getItem('birthday');
    memberTel.textContent = sessionStorage.getItem('tel');
    
} else {
    window.location.href = "/member.html";
}


    



