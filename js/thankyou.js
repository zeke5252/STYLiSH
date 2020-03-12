let maxAmount;
let itemNumber = 1;
let tempSelectedObj ={};
let listObj = {};
let grabedStorage;
let cartQty;

function setCartQty(data){
    cartQty = grabedStorage.order.list.length
    document.querySelector('.header-cart-number').innerHTML = cartQty
    document.querySelector('#cart-qty-mobile').innerHTML = cartQty
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

function sendStringToIndex(catogory){
    window.location = `./index.html?catogory=${catogory}`;
};

function searchHub(){
    let searchString = document.querySelector('#search-desktop').value;
    sendStringToIndex(searchString);
}

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
    //Thank you number
    let orderNumber = window.location.search.match(/\d+/)[0];
    document.querySelector('#thank-code-id').innerHTML = orderNumber
    //Member
    document.querySelector('#member-login').addEventListener('click', memberLogin);
}

init();