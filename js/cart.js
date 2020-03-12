let maxAmount;
let itemNumber = 1;
let tempSelectedObj ={};
let listObj = {};
let grabedStorage;
let cartQty;

function sendToThankyou(reponse){
    window.location()
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

function getSingleQty(el){
    let tempStr='';
    for(let i=1; i<=el.maxQty; i++){
        // Select the ordered qty
        if(i === parseInt(el.qty)){
            tempStr += `<option value=${i} selected="selected">${i}</option>`
        } else {
        tempStr += `<option value=${i}>${i}</option>`
        }
    }
    //Set default option
    return tempStr
}

function calcSingleSum(el){
    let priceStr =  el.price*el.qty
    return priceStr
}

let changeSingleSum = (el) => {
    // Get the target id number, pass it to summery
    let tempStr = event.target.id.match(/\d+/)[0]
    for(let i=1; i<=el.maxQty; i++){
        if (event.target.options[event.target.selectedIndex].value === `${i}`) {
            document.querySelector(`#cart-sum-${tempStr}`).innerHTML = `NT. ${parseInt(el.price)*i}`
        }
    }
    //Update grabedStorage
    el.qty = event.target.options[event.target.selectedIndex].value
    //Update local storage
    for(let i=0; i<grabedStorage.order.list.length; i++){
        if(el.id === grabedStorage.order.list[i].id && el.color.code === grabedStorage.order.list[i].color.code && el.qty === grabedStorage.order.list[i].qty){
            grabedStorage.order.list[i].qty = el.qty
        }
    }
    localStorage.setItem('prime', JSON.stringify(grabedStorage))
    calcSumHub();
}

let removeProduct = (el) => {
    // Remove dom, and calculate the data !!!
    let tempStr = event.target.id.match(/\d+/)[0]
    document.querySelector(`#product-${tempStr}`).remove()
    let deleteNum = event.target.previousElementSibling.innerHTML.match(/\d+/)[0];
    let deleteQty = event.target.previousElementSibling.previousElementSibling.previousElementSibling.children[0].value
    //Update grabedStorage
    for(let i=0; i< grabedStorage.order.list.length; i++){
        if(grabedStorage.order.list[i].id === el.id && grabedStorage.order.list[i].size === el.size && grabedStorage.order.list[i].color.code === el.color.code){
            grabedStorage.order.list.splice(i,1)
        }
    }
    //Update local storage
    localStorage.setItem('prime', JSON.stringify(grabedStorage))

    deleteSumHub(deleteNum, deleteQty);
}

let deleteSumHub = (Num, Qty) =>{
    let deleteSum = parseInt(document.querySelector('#cart-sum').innerHTML.match(/\d+/)[0]) ;
    let deleteTotal = parseInt(document.querySelector('#cart-total').innerHTML.match(/\d+/)[0]);
    let deleteQty = parseInt(document.querySelector('#cart-qty').innerHTML.match(/\d+/)[0]);
    let deleteCart = parseInt(document.querySelector('.header-cart-number').innerHTML.match(/\d+/)[0]);
    deleteSum -= parseInt(Num);
    deleteTotal -= parseInt(Num);
    deleteQty -= 1
    deleteCart -= 1
    document.querySelector('#cart-sum').innerHTML = `NT. ${deleteSum}`;
    document.querySelector('#cart-total').innerHTML = `NT. ${deleteTotal}`;
    document.querySelector('#cart-qty').innerHTML = deleteQty;
    document.querySelector('.header-cart-number').innerHTML = deleteCart;
    document.querySelector('#cart-qty-mobile').innerHTML = deleteQty;
    
};

let calcSumHub = () =>{
    //calculate sum and show it
    let tempSum = 0;
    let tempFreight = 30;
    let tempQty = grabedStorage.order.list.length;
    //Loop all the items on screen
    document.querySelectorAll("[id^='product-']").forEach( (el, i) => {
        //Delete function is "not" here.
            tempSum += parseInt(document.querySelector(`#cart-sum-${i}`).innerHTML.match(/\d+/)[0])
       });
    document.querySelector('#cart-sum').innerHTML = `NT. ${tempSum}`;
    document.querySelector('#cart-freight').innerHTML = `NT. ${tempFreight}`;
    document.querySelector('#cart-total').innerHTML = `NT. ${tempSum + tempFreight}`;
    document.querySelector('#cart-qty').innerHTML = tempQty;
    document.querySelector('.header-cart-number').innerHTML = tempQty;
    document.querySelector('#cart-qty-mobile').innerHTML = cartQty
};

function sendRequestApi(result){
   grabedStorage.prime = result.card.prime;
   console.log(grabedStorage)
   fetch(`https://api.appworks-school.tw/api/1.0/order/checkout`,{
    body: JSON.stringify(grabedStorage),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors', 
    redirect: 'follow',
    referrer: 'no-referrer',
  })
   .then(response => response.json())
   .then(response => {
        localStorage.clear();
        let orderNumber = response.data.number;
        window.location=`./thankyou.html?orderNumber=${orderNumber}`;
    }
    )

}

function updateStorage(){
    //先更新程式裡的grabedStorage(從中間改，只需確認數量以及有沒有被刪除)
    //加上下方選填欄位(放進grabedStorage裡，因為這包就是正確的格式)
    //送出post request給check out api
    //得到token (查看tappay提供的callback，接下來要寫在內部下方)
    //grabedStorage加上獲得的token
    //用post發出需求給/order/checkout，注意post方法後方要填上{}，內部有header，可察看手機畫面
    //收到成功response，跳出alert說購買成功
    console.time()
    let inputName = document.querySelector('#input-buyer-name').value;
    let inputCellphone = document.querySelector('#input-cellphone').value;
    let inputAddress = document.querySelector('#input-address').value;
    let inputEmail = document.querySelector('#input-email').value;
    let inputShippingTime
    console.timeEnd()
    for(let i=0; i<document.querySelectorAll("[id^='from-']").length; i++){
        if(document.querySelector(`#from-${i}`).checked){
            inputShippingTime = document.querySelector(`#from-${i}`).value
        }
    }

    grabedStorage.order.recipient.name = inputName
    grabedStorage.order.recipient.phone = inputCellphone
    grabedStorage.order.recipient.email = inputEmail
    grabedStorage.order.recipient.address = inputAddress
    grabedStorage.order.recipient.time = inputShippingTime
    grabedStorage.order.subtotal = document.querySelector('#cart-sum').innerHTML.match(/\d+/)[0]
    grabedStorage.order.total = document.querySelector('#cart-total').innerHTML.match(/\d+/)[0]
    grabedStorage.order.freight = document.querySelector('#cart-freight').innerHTML.match(/\d+/)[0]
    grabedStorage.order.shipping = document.querySelector('#cart-country').value
    grabedStorage.order.payment = document.querySelector('#cart-method').value
    //Check if empty
    for (let key in grabedStorage.order.recipient){
        if( grabedStorage.order.recipient[key] === ''){
            alert('這位朋友，請填入完整訂購資訊喔，謝謝拉')
            break;
        }
    }
    //Call tapPay
    event.preventDefault()
    // TapPay Fields status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        sendRequestApi(result);
        //alert('get prime 成功，prime: ' + result.card.prime)
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}

function initCartPage(){
    // get data from local storage
    // display product, get max from api
    // display each total of a single product, get product details from local storage
    // select dropdown list, change total
    // create functions separately managing removing product and changing qty
    let allProductsContent = '';
    grabedStorage.order.list.forEach( (el, i) => {
    allProductsContent +=
        `<div class="cart-content-item" id="product-${i}">
            <div class="cart-content-item-left">
                <img src="${el.mainImg}" alt="" class="cart-content-item-img">
                <div class="cart-content-item-left-details-container">
                    <p class="cart-content-item-left-details">${el.name}</p>
                    <p class="cart-content-item-left-details">${el.id}</p>
                    <p class="cart-content-item-left-details">顏色 ${el.color.name}</p>
                    <p class="cart-content-item-left-details">尺寸 ${el.size}</p>
                </div>
            </div>
            <div class="cart-table-head-item">
                <div class="cart-table-head-lable">數量</div>
                <div class="cart-table-head-lable">單價</div>
                <div class="cart-table-head-lable">小計</div>
            </div>
            <div class="cart-content-item-right">
                <div class="cart-content-item-right-item">
                    <select class="cart-content-item-right-dropdown" id="cart-single-qty-${i}">
                        ${getSingleQty(el)}
                    </select>
                </div>
                <div class="cart-content-item-right-item">NT.${el.price}</div>
                <div class="cart-content-item-right-item" id="cart-sum-${i}">NT.${calcSingleSum(el)}</div>
                <img src="img/btn_delete02_normal.png" id="remove-product-${i}" alt="" class="cart-content-item-trash">
            </div>
        </div>`;
        }
    );
    document.querySelector('.cart-content-container').insertAdjacentHTML('beforeend', allProductsContent) ;
    //Single product calculation
    grabedStorage.order.list.forEach( (el, i) => {
        document.querySelector(`#cart-single-qty-${i}`).addEventListener('change', changeSingleSum.bind(null, el))
        document.querySelector(`#remove-product-${i}`).addEventListener('click', removeProduct.bind(null, el))
        }
    );
    calcSumHub();
    
    document.querySelector('#cart-send').addEventListener('click',updateStorage)
}

function setCartQty(data){
    cartQty = grabedStorage.order.list.length
    document.querySelector('.header-cart-number').innerHTML = cartQty
    document.querySelector('#cart-qty-mobile').innerHTML = cartQty
}

function sendStringToIndex(catogory){
    window.location = `./index.html?catogory=${catogory}`;
};

function searchHub(){
    let searchString = document.querySelector('#search-desktop').value;
    sendStringToIndex(searchString);
}

//Get sdk 
//Set up
//forms
//Send requests，and get token ( Fetch )
//Integrate data, set local storage
//Send to backend.

TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.querySelector('#card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
             'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})

TPDirect.card.getTappayFieldsStatus()

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
              ]
            }
          }
        localStorage.setItem('prime', JSON.stringify(grabedStorage))
    }
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
    //Member
    document.querySelector('#member-login').addEventListener('click', memberLogin);
}

init();

initCartPage();