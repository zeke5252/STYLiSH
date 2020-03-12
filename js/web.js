let isLoading = false;
let triggerDistance = 50;
let entries = 'all';
let pageNum = (num='all') => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`https://api.appworks-school.tw/api/1.0/products/${num}`, true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            pageNum = response.next_paging;
        }
        return pageNum;
    };
};
let receivedCatogory = new URLSearchParams(window.location.search) ;
let queriedString = receivedCatogory.get('catogory');
let cartQty;
let grabedStorage;

function buildHomeSingleProduct(dataGrabed){
    let htmlProduts='';
    let tempStr='';

    
    for(let i=0; i<dataGrabed.data.length; i++){
        let allColor='';
        for(let j=0; j<dataGrabed.data[i].colors.length;j++){
            allColor +=`<div class="box-color" style="background-color:#${dataGrabed.data[i].colors[j].code}"></div>`;
        }
    tempStr=
    `<div class="box" id="idbox-${i}">
    <a href="./products.html?id=${dataGrabed.data[i].id}" />
    <img src="${dataGrabed.data[i].main_image}" alt="${dataGrabed.data[i].title}" class="box-image">
    </a>
    ${allColor}
    <div class="box-name">${dataGrabed.data[i].title}</div>
    <div class="box-price">TWD.${dataGrabed.data[i].price}</div></div>`;
    htmlProduts += tempStr;
    };
    return htmlProduts;
}

function renderDOM(dataGrabed, catogory){
    //Key visual
    if(catogory){
    //Key visual , not transition
    let slidesDom=`<div class="header-slogan-dot-container">`;
    for(let dot = 0; dot < dataGrabed.data.length; dot++ ){
        let tempDom = 
        `<div class="header-slogan-dot" id="slider-dot-${dot}"></div>`
        slidesDom += tempDom;
    }
    slidesDom+=`</div>`
    for(let slidedom = 0; slidedom < dataGrabed.data.length; slidedom++ ){
        let tempDom = 
        `<div class="header-slogan-slider">
        <a href="products.html?id=${dataGrabed.data[slidedom].product_id}">
            <img src="https://api.appworks-school.tw${dataGrabed.data[slidedom].picture}" class="header-slogan-image" id="slider-link-${slidedom}"/>                    
            <div class="header-text">${dataGrabed.data[slidedom].story}</div>
        </a>
        </div>`;
        slidesDom += tempDom;
    }
    document.querySelector('#header-keyVisual').innerHTML = slidesDom;
    slideBanner(dataGrabed.data.length);
}
    //Nav btn color
    if(catogory && catogory !== 'all'){
    let colorSeleted = "#8b572a";
    document.querySelector('#navLink-women').style.color="#3f3a3a";
    document.querySelector('#navLink-men').style.color="#3f3a3a";
    document.querySelector('#navLink-accessories').style.color="#3f3a3a";
    document.querySelector('#navLink-women2').style.opacity=".3";
    document.querySelector('#navLink-men2').style.opacity=".3";
    document.querySelector('#navLink-accessories2').style.opacity=".3";
    document.getElementById(`navLink-${catogory}`).style.color = colorSeleted;
    document.getElementById(`navLink-${catogory}2`).style.opacity = "1";
    }
    //product browsing    
    if(dataGrabed.data.length===0){
        entries = '';
        document.querySelector('#main-content-root').innerHTML = `<span class="content-empty">目前沒有提供這個商品喔~</span>`
    } else if (dataGrabed.data[0].main_image){
        document.querySelector('#main-content-root').innerHTML = buildHomeSingleProduct(dataGrabed);
    }
}

function getSearchKeywordMobile(){
    document.querySelector('.header-search-mobile').style.display = 'block';
    document.addEventListener('keydown', function(e){ 
        let keyId = e.code;
        if(keyId==='Enter'){
        let keywordValue = document.querySelector('#search-mobile').value;
            //console.log(keywordValue)
            entries = keywordValue;
            getProductBrowse(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${keywordValue}`, 
            function(response, catogory){renderDOM(response, catogory)})
        } else if(keyId==='Escape'){
            keywordValue = document.querySelector('.header-search-mobile').value='';
            document.querySelector('.header-search-mobile').style.display = 'none';
        }
     }, false);

}

function getSearchKeyword(){
    let keywordValue = document.querySelector('#search-desktop').value;
    //If keywordValue exists, make querieString null.
    keywordValue ? queriedString = null : queriedString = queriedString;
    if(queriedString){
        entries= queriedString;
        getProductBrowse(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${queriedString}`,function(response, catogory){renderDOM(response, catogory)})
    } else {
        entries= keywordValue;
        getProductBrowse(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${keywordValue}`, 
        function(response, catogory){renderDOM(response, catogory)})}
}

function taskHub(srcProduct, catogory, handleResponse){
    entries= catogory;
    getProductBrowse(srcProduct, handleResponse);
    getBigBanner(catogory, handleResponse);
    isLoading = false;
    pageNum = 1;
}

function getProductBrowse(srcProduct, handleResponse){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',srcProduct, true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            handleResponse(response);
        }
    };
}

function getBigBanner(catogory, handleResponse){
    let xhr = new XMLHttpRequest();
    xhr.open('GET',"https://api.appworks-school.tw/api/1.0/marketing/campaigns", true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            handleResponse(response, catogory);
        }
    };
}

function slideBanner(camplaignNum) {//slides
    let timeoutID;
    for(let i=0; i<camplaignNum; i++){
        document.getElementById(`slider-dot-${i}`).addEventListener('click', ()=> {
            currentShow = i;
            clearTimeout(timeoutID);
            showSlides();
        });
    }
    let slides = document.getElementsByClassName("header-slogan-slider");
    let dots = document.getElementsByClassName("header-slogan-dot");
    let currentShow = 0;
    showSlides();
    function showSlides() {
        for(let i=0; i<camplaignNum; i++){
            slides.item(i).style.display = "none";
            dots.item(i).className = dots.item(i).className.replace(" header-slogan-dot-active", "");
        };
        slides.item(currentShow).style.display = "block";
        dots.item(currentShow).className += " header-slogan-dot-active";
        currentShow++
        if(currentShow > camplaignNum-1){
            currentShow=0;
        }
        timeoutID = setTimeout(showSlides,10000);
    };   
}
//Init global variables

function scrollToBrowse() {
    let distance = document.querySelector('#main-content-root').getBoundingClientRect().bottom - window.innerHeight;
    if ( !isLoading && distance < triggerDistance ) {
    isLoading = true;
    //Be careful. The entries means to query its catogory until no paging exists, so remember to get the entries right.
    getProductBrowse(`https://api.appworks-school.tw/api/1.0/products/${entries}?paging=${pageNum}`, dataGrabed => {
        if (pageNum){
            document.querySelector('#main-content-root').insertAdjacentHTML('beforeend',buildHomeSingleProduct(dataGrabed));
            isLoading = false;
            pageNum = dataGrabed.next_paging;
            } 
    })
  }
}
window.addEventListener('scroll', scrollToBrowse);

function setCartQty(data){
    cartQty = grabedStorage.order.list.length
    document.querySelector('.header-cart-number').innerHTML = cartQty
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
        if( queriedString ==='women') {
            taskHub("https://api.appworks-school.tw/api/1.0/products/women","women", function(response, catogory){renderDOM(response, catogory)})
        } else if( queriedString ==='men'){
            taskHub("https://api.appworks-school.tw/api/1.0/products/men","men", function(response, catogory){renderDOM(response, catogory)})
        } else if( queriedString ==='accessories'){
            taskHub("https://api.appworks-school.tw/api/1.0/products/accessories","accessories", function(response, catogory){renderDOM(response, catogory)})
        } else if( queriedString !=='men' && queriedString !== 'women' && queriedString !== 'accessories' && queriedString !== null ){
            //console.log('queriedString ', queriedString)    
            getSearchKeyword();
            getBigBanner("all", function(response, catogory){renderDOM(response, catogory)})
        } else {
            getProductBrowse('https://api.appworks-school.tw/api/1.0/products/all?paging=0', function(response, catogory){renderDOM(response, catogory)});
            getBigBanner("all", function(response, catogory){renderDOM(response, catogory)})
        }
    
        isLoading = false;
        pageNum = 1;

        //nav on desktop
        document.querySelector('#navLink-men').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/men","men", function(response, catogory){renderDOM(response, catogory)}))
        document.querySelector('#navLink-women').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/women","women", function(response, catogory){renderDOM(response, catogory)}))
        document.querySelector('#navLink-accessories').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/accessories","accessories", function(response, catogory){renderDOM(response, catogory)}))
        //nav on mobile
        document.querySelector('#navLink-men2').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/men","men", function(response, catogory){renderDOM(response, catogory)}))
        document.querySelector('#navLink-women2').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/women","women", function(response, catogory){renderDOM(response, catogory)}))
        document.querySelector('#navLink-accessories2').addEventListener('click', taskHub.bind(null,"https://api.appworks-school.tw/api/1.0/products/accessories","accessories", function(response, catogory){renderDOM(response, catogory)}))
        //search function
        document.querySelector('#header-search-btn').addEventListener('click', getSearchKeyword);
        document.querySelector('#search-btn-mobile').addEventListener('click', getSearchKeywordMobile);
        //cart
        document.querySelector('#cart-link').addEventListener('click', () => window.location = "./cart.html")
        document.querySelector('#cart-link-mobile').addEventListener('click', () => window.location = "./cart.html")
        document.querySelector('#cart-qty-mobile').innerHTML = cartQty
        //Member
        document.querySelector('#member-login').addEventListener('click', memberLogin);
    }
    init();