const itemsAndPrices = [
    ["豆干", 40], ["甜不辣", 30], ["海帶", 20], ["豬血糕", 20], ["百頁豆腐", 15], ["滷蛋", 10], 
    ["花枝丸", 25], ["貢丸", 25], ["鴨肉丸", 25], ["墨魚丸", 10], 
    ["雞翅膀", 10], ["鴨翅膀", 27], ["雞腳", 7], ["豬腱肉", 50], ["牛腱肉", 120], ["牛肚", 100]
];

const menu = {
    "豆干": 40, 
    "甜不辣": 30, 
    "海帶": 20, 
    "豬血糕": 20, 
    "百頁豆腐": 15, 
    "滷蛋": 10, 
    "花枝丸": 25, 
    "貢丸": 25, 
    "鴨肉丸": 25, 
    "墨魚丸": 10, 
    "雞翅膀": 10, 
    "鴨翅膀": 27, 
    "雞腳": 7, 
    "豬腱肉": 50, 
    "牛腱肉": 120, 
    "牛肚": 100
};


let putInBtns = document.querySelectorAll('.put_in_btn');
let emptyHint = document.querySelector('#empty_hint');
let cartList = document.querySelector('#cart_list');

    
for(i = 0; i < putInBtns.length; i++) {
    let putInBtn = putInBtns[i];
    let item = itemsAndPrices[i][0];
    let count = 1;
    putInBtn.onclick = function () {
         localStorage.setItem(item, count);
         console.log(item + 'is added.');
    }
}

let sum = 0;
let totalCost = document.querySelector('#total_cost');


if (localStorage.length > 0) {
    emptyHint.textContent = '';

    for (i = 0; i < localStorage.length; i++){
        let itemBox = document.createElement('li');
        itemBox.className = 'item_box';
        cartList.appendChild(itemBox);   
        let cartItem = document.createElement('ul');
        itemBox.appendChild(cartItem);  
        
        let l = 0;
        while (l < 6) {
            l += 1;
            let itemContent = document.createElement('li');
            cartItem.appendChild(itemContent);
        }
        
        let itemContents = cartItem.querySelectorAll('li');
        let itemName = localStorage.key(i);
        itemContents[0].innerHTML = '<button type="button" class="delete_btn"></button>';
        
        itemContents[1].innerHTML = `<img src="images/${itemName}.jpg">`;
        
        itemContents[2].innerHTML = `<div><input type="text" name="item" value="${itemName}" class="item" readnoly></div>`;
        
        let itemPrice = menu[itemName];
        itemContents[3].textContent = itemPrice;
        
        itemContents[4].innerHTML = '<div><input type="number" name="count" value="" min="1" step="1" class="count" autofocus></div>';
        
        itemContents[5].textContent = localStorage.getItem(itemName) * itemPrice;
        
        
        sum += Number(itemContents[5].textContent);
        
        let itemCount = itemContents[4].querySelector('input');
        itemCount.value = localStorage.getItem(itemName);
        
        itemCount.onchange = function () {
            localStorage.setItem(itemName, itemCount.value);
            console.log('the count of '+ itemName + ' is updated.');
            itemContents[5].textContent = localStorage.getItem(itemName) * itemPrice; 
            window.location.reload();
        }
        
        let deleteBtn = itemContents[0].querySelector('button');
        
        deleteBtn.onclick = function () {
            localStorage.removeItem(itemName);
            console.log(itemName + 'is removed.');
            window.location.reload();
        }
        
    }
    
    totalCost.value = sum;
    
} else {
    console.log('localStorage is empty.');
}


let name = document.querySelector('#member_name');
name.value = sessionStorage.getItem('name');

let tel = document.querySelector('#member_tel');
tel.value = sessionStorage.getItem('tel');

let orderForm = document.querySelector('#order_form');

orderForm.addEventListener('submit', function (e) {
    if ((!sessionStorage.key(0)) || (!sessionstorage.key(1))) {
        e.preventDefault();
        window.alert('訂購前，請先完成登入');
    } else if (localStorage.length = 0) {
        e.preventDefault();
        window.alert('訂購前，請先至滷品列表點選欲訂購之品項');
    } 
});



  
