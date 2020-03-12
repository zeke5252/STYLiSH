document.querySelector('.product-number-amount').innerText = 1;
let maxAmount;
let itemNumber = 1;
let tempSelectedObj ={};
let listObj = {};
let grabedStorage;
let cartQty;

function setCartQty(data){
    cartQty = data.order.list.length
    document.querySelector('.header-cart-number').innerHTML = cartQty
}

function sendOrder(){
    //If qty=0, stop it
    if(document.querySelector('.product-number-amount').innerText !== '0'){
    grabedStorage = JSON.parse(localStorage.getItem('prime'));
    //Store data
    listObj['id'] = document.querySelector('.product-id').innerText; //id
    listObj['name'] = document.querySelector('.product-title').innerText; //name
    listObj['price'] = document.querySelector('.product-price').innerText.replace(/[^\d]/g, ''); //price
    listObj['color'] = {}; 
    listObj['color'].code = tempSelectedObj.selectedColorCode //color hex
    listObj['color'].name = tempSelectedObj.selectedColorName //color name
    listObj['mainImg'] = document.querySelector('.product-img-main').src;
    listObj['maxQty'] = maxAmount;
    listObj['size'] = document.querySelector('.product-size-active').innerText
    //Get data fromtext field
    listObj['qty'] = document.querySelector('.product-number-amount').innerText
    //Set to localstorage
    setStorage();} 
    else {
        alert('請選擇你要的件數，謝謝~')
    }
}
function setStorage(){
    let isPush = true;
    for(let i = 0; i < grabedStorage.order.list.length; i++){
        if(listObj.color.code === grabedStorage.order.list[i].color.code && listObj.size === grabedStorage.order.list[i].size){  
            isPush = false;
            grabedStorage.order.list[i].qty = listObj.qty;
        } else {           
            //do nothing
        }
    }
    if(isPush){
        grabedStorage.order.list.push(listObj);
        localStorage.setItem('prime', JSON.stringify(grabedStorage))
        setCartQty(grabedStorage)
    } else {
        localStorage.setItem('prime', JSON.stringify(grabedStorage))
    }
    alert('商品已經加入購物車囉！');
}

function sendStringToIndex(catogory){
    window.location = `./index.html?catogory=${catogory}`;
};

function searchHub(){
    let searchString = document.querySelector('#search-desktop').value;
    sendStringToIndex(searchString);
}

function searchHubMobile(){
    document.querySelector('.header-search-mobile').style.display = 'block';
    document.addEventListener('keydown', function(e){ 
        let keyId = e.code;
        if(keyId==='Enter'){
            let searchString = document.querySelector('#search-mobile').value;
            sendStringToIndex(searchString);     
        } else if(keyId==='Escape'){
            keywordValue = document.querySelector('.header-search-mobile').value='';
            document.querySelector('.header-search-mobile').style.display = 'none';
        }
     }, false);
}

function calcNumber(operator){
    switch (operator) {
        case '+':
            itemNumber += 1;
            if(itemNumber >= maxAmount){
                itemNumber = maxAmount;
            }
            break;
        case '-':
            itemNumber -= 1;
            if(itemNumber <= 0){
                itemNumber = 0;
            }
            break;
    }
    document.querySelector('.product-number-amount').innerText = itemNumber;
}

function initFirstStock(StockDetails){
    //Get the first color, size, and qty of frist tempSelectedObj
    maxAmount = StockDetails.product_variants[0].stock;
    StockDetails.product_variants.forEach(el => {
        if( el.color_code === StockDetails.product_variants[0].color_code){
                switch (el.size){
                    case 'S':
                        tempSelectedObj['S'] = el.stock
                        decideDisabled(el.stock, `${tempSelectedObj.S_sizeEqualsTo}`)
                        break;
                    case 'M':
                        tempSelectedObj['M'] = el.stock
                        decideDisabled(el.stock, `${tempSelectedObj.M_sizeEqualsTo}`)
                        break;
                    case 'L':
                        tempSelectedObj['L'] = el.stock
                        decideDisabled(el.stock, `${tempSelectedObj.L_sizeEqualsTo}`)
                        break;
                    case 'XL':
                        tempSelectedObj['XL'] = el.stock
                        decideDisabled(el.stock, `${tempSelectedObj.XL_sizeEqualsTo}`)
                        break;
                    case 'F':
                        tempSelectedObj['F'] = el.stock
                        decideDisabled(el.stock, `${tempSelectedObj.F_sizeEqualsTo}`)
                        break;
                }
            }
        }
    )
    //select the first item;
    document.querySelector(`.product-color-0`).classList.add('product-color-active')
    tempSelectedObj['selectedColorName'] = StockDetails.product_colors[0].name
    tempSelectedObj['selectedColorCode'] = StockDetails.product_colors[0].code
    //Select the first size
    document.querySelector(`.product-size-0`).classList.add('product-size-active')
}

function decideDisabled(stockNum, tempStockSize){
    document.querySelector(tempStockSize).style.opacity = 1;
    if(stockNum===0) {
        document.querySelector(tempStockSize).style.opacity="0.2";
        document.querySelector(tempStockSize).classList.remove('product-size-active');
        document.querySelector(tempStockSize).removeEventListener('click', sizeClickEvent )
        maxAmount = stockNum;
        document.querySelector('.product-number-amount').innerText = stockNum;
    }
}

function getStockColor(StockDetails, selectedColor){
    itemNumber = 1;
    document.querySelector('.product-number-amount').innerText = 1;
    // Find color name
    let findSelectedColorName = StockDetails.product_colors.find(item => {
        if(item.code === selectedColor) {return item.name}
    })
    tempSelectedObj['selectedColorName'] = findSelectedColorName.name;
    tempSelectedObj['selectedColorCode'] = selectedColor;

    StockDetails.product_variants.forEach(el => {
        if( el.color_code === selectedColor ){
            switch (el.size){
                //If the el.stock === 0, set the size disabled
                case 'S':
                    tempSelectedObj['S'] = el.stock
                    decideDisabled(el.stock, `${tempSelectedObj.S_sizeEqualsTo}`)
                    break;
                case 'M':
                    tempSelectedObj['M'] = el.stock
                    decideDisabled(el.stock, `${tempSelectedObj.M_sizeEqualsTo}`)
                    break;
                case 'L':
                    tempSelectedObj['L'] = el.stock
                    if(el.stock===0) 
                    decideDisabled(el.stock, `${tempSelectedObj.L_sizeEqualsTo}`)
                    break;
                case 'XL':
                    decideDisabled(el.stock, `${tempSelectedObj.XL_sizeEqualsTo}`)
                    break;  
                case 'F':
                    tempSelectedObj['F'] = el.stock
                    decideDisabled(el.stock, `${tempSelectedObj.F_sizeEqualsTo}`)
                    break;              
                }
            }
        }
    )
};

function getStockSize(StockDetails, selectedSize, selectDOM){
    itemNumber = 1;
    document.querySelector('.product-number-amount').innerText = 1;
    switch (selectedSize){
        case 'S':
            maxAmount = tempSelectedObj.S;
            break;
        case 'M':
            maxAmount = tempSelectedObj.M;
            break;
        case 'L':
            maxAmount = tempSelectedObj.L;
            break;
        case 'XL':
            maxAmount = tempSelectedObj.XL;
            break;
        case 'F':
            maxAmount = tempSelectedObj.F;
            break;
    }
}

function colorClickEvent(loopNum, data){
    let htmlCollectColor = document.querySelectorAll('.product-color-active');
    htmlCollectColor.forEach(element => { 
        element.classList.remove('product-color-active')});
    event.target.classList.add('product-color-active')
    //console.log(`${data.product_colors[loopNum].code}`);
    getStockColor(data, `${data.product_colors[loopNum].code}`)
}

function sizeClickEvent(loopNum, data){

        if(event.target.style.opacity === '0.2'){
            //Do nothing here
        }
        else {
            let htmlCollectsize = document.querySelectorAll('.product-size-active');
            htmlCollectsize.forEach(element => { 
                element.classList.remove('product-size-active')});
                event.target.classList.add('product-size-active')
            getStockSize(data, `${data.product_sizes[loopNum]}`,event.target )
        }
}

showData = (data) => {
    //String below 
    document.querySelector('.product-title').innerHTML=data.product_title;
    document.querySelector('.product-description').innerHTML=data.product_description.replace('\r\n','</br>');
    document.querySelector('.product-id').innerHTML=data.product_id
    document.querySelector('.product-img-main').src=data.product_main_image;
    document.querySelector('.product-note').innerHTML=data.product_note;
    document.querySelector('.product-place').innerHTML=data.product_place;
    document.querySelector('.product-story').innerHTML=data.product_story;
    document.querySelector('.product-texture').innerHTML=data.product_texture;
    document.querySelector('.product-price').innerHTML=`NTD: ${data.product_price}`;
    document.querySelector('.product-wash').innerHTML=data.product_wash;
    //color
    let colorDOM = '';
    let colorNum = data.product_colors.length;
        for(let i=0; i<colorNum; i++){
            colorDOM+= `<span class="product-color-${i}"></span>`;
        }
        document.querySelector('.product-property-color').innerHTML= colorDOM;
        for(let i=0; i<colorNum; i++){
            document.querySelector(`.product-color-${i}`).addEventListener('click', colorClickEvent.bind(null, i, data))
            document.querySelector(`.product-color-${i}`).style.backgroundColor = `#${data.product_colors[i].code}`;
        }
    //size
    let sizeDOM = '';
    let sizeNum = data.product_sizes.length;
        for(let i=0; i<sizeNum; i++){
            tempSelectedObj[`${data.product_sizes[i]}_sizeEqualsTo`]= `.product-size-${i}`;
            sizeDOM+= `<span class="product-size-${i}">${data.product_sizes[i]}</span>`
        }
        document.querySelector('.product-property-size').innerHTML= sizeDOM;
        for(let i=0; i<sizeNum; i++){
            document.querySelector(`.product-size-${i}`).addEventListener('click', sizeClickEvent.bind(null, i, data))
            document.querySelector(`.product-size-${i}`).style.backgroundsize = `#${data.product_sizes[i].code}`;
        }
    //input calculation
    document.querySelector('.product-number-calc-add').addEventListener('click',calcNumber.bind(null,'+'));
    document.querySelector('.product-number-calc-remove').addEventListener('click',calcNumber.bind(null,'-'));
    //images
    let imageDOM = '';
    let imageNum = data.product_images.length;
    for(let i=0; i<imageNum; i++){
        imageDOM+= 
        `<img src="${data.product_images[i]}" alt="product images" class="product-image-content">`
    }
    document.querySelector('.product-main-container').insertAdjacentHTML("beforeend",imageDOM);
    initFirstStock(data)
}

function generateProperties(source){
let productObj={};
    for(let i=0; i<Object.keys(source.data).length; i++){
        productObj[`product_`+`${Object.keys(source.data)[i]}`] = Object.values(source.data)[i];
    }
    return productObj;
};
let getProductDetails = (function() {
    let searchString = window.location.search;
    fetch(`https://api.appworks-school.tw/api/1.0/products/details${searchString}`)
    .then(response => response.json())
    .then(response => { 
        let productData = response;
        return generateProperties(productData)
    })
   .then(response => showData(response))
})();

//Facebook login
function memberLogin(){
    FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
}

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        loginSuccess(response);  
    } else {         
        FB.login(function(response) {
            // handle the response
            }, {scope: 'public_profile,email'});
    }
}
function checkLoginState() {   
        // Called when a person is finished with the Login Button.
        FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}

(function(d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
    FB.init({
        appId            : '589309351865576',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v5.0'
    });
};

function loginSuccess(response) {
    FB.api(
        '/me',
        'GET',
        {"fields":"id,name,email,picture.width(500)"},
        function(response) {
            let userID_fb = response.id;
            let userEmail_fb = response.email;
            let userName_fb = response.name;
            let userPicture_fb = response.picture.data.url
            let userFacebook = {
                userID_fb,
                userEmail_fb,
                userName_fb,
                userPicture_fb
            }
            localStorage.setItem("userFacebook", JSON.stringify(userFacebook))
            window.location = "./profile.html";
        }
      );

}

init = () => {
    //Init storage
    if(localStorage.getItem('prime')){
        grabedStorage = JSON.parse(localStorage.getItem('prime'));
        setCartQty(grabedStorage)
    } else {
        grabedStorage = {
            "prime": 'PrimeKey',
            "order": {
              "shipping": 'delivery',
              "payment": 'credit_card',
              "subtotal": 'Price-excluded-Freight-Fee',
              "freight": 'FreightFee',
              "total": 'FinalPrice',
              "recipient": {
                "name": 'Name',
                "phone": 'Phone',
                "email": 'Email',
                "address": 'PostAddress',
                "time": '"morning"|"afternoon"|"anytime"'
              },
              "list": [
                // {
                //   "id": '',
                //   "name": '',
                //   "price": '',
                //   "color": {
                //     "name": '',
                //     "code": ''
                //   },
                //   "size": '',
                //   "qty": ''
                // },
              ]
            }
          }
        localStorage.setItem('prime', JSON.stringify(grabedStorage))
    }
    //set the order button
    document.querySelector('.product-btn-add').addEventListener('click', sendOrder)
    //nav on desktop
    document.querySelector('#navLink-men').addEventListener('click', sendStringToIndex.bind(null, 'men'))
    document.querySelector('#navLink-women').addEventListener('click', sendStringToIndex.bind(null, 'women') )
    document.querySelector('#navLink-accessories').addEventListener('click', sendStringToIndex.bind(null, 'accessories'))
    //nav on mobile
    document.querySelector('#navLink-men2').addEventListener('click', sendStringToIndex.bind(null, 'men'))
    document.querySelector('#navLink-women2').addEventListener('click', sendStringToIndex.bind(null, 'women'))
    document.querySelector('#navLink-accessories2').addEventListener('click', sendStringToIndex.bind(null, 'accessories'))
    //search function - Send query string to index
    document.querySelector('#header-search-btn').addEventListener('click', searchHub);
    document.querySelector('#search-btn-mobile').addEventListener('click', searchHubMobile);
    //cart
    document.querySelector('#cart-link').addEventListener('click', () => window.location = "./cart.html")
    document.querySelector('#cart-link-mobile').addEventListener('click', () => window.location = "./cart.html")
    document.querySelector('#cart-qty-mobile').innerHTML = cartQty
    //Member
    document.querySelector('#member-login').addEventListener('click', memberLogin);
}

init();