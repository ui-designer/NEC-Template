$(document).ready(function () {
  //localStorageFun is used for store the tab selected value;
  localStorageFun("email");

 // onclick to search
 $('#btn-search').on('click', function (e) {
    var getFieldValue = localStorage.getItem("selectedValue");
    validateSearch(e,getFieldValue)
  });
  
  // enter to search
  $('input[type="text"]').keypress(function (e) {
	  keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
      var getFieldValue = localStorage.getItem("selectedValue");
      validateSearch(e,getFieldValue)
    }
  })
//Used for tabing email and phone number
  $('.custom_tabs li:not(:first-child)').click(function(){
    $(this).addClass('active').siblings('li').removeClass('active');
    var dataValue = $(this).data().value;
    localStorageFun(dataValue);
    $(this).parents('.input-group').siblings('.input-group').removeClass('error');
    $(this).parents('.input-group').siblings('.input-group').children('input').val('');
    if(dataValue == 'email'){
      $('.custom_field input').attr("type", "email");
      $('.custom_field input').attr("name", "email");
      $('.custom_field input').attr("placeholder", "Enter an Email Address");
	    $('.error-msg').text('Please enter a valid email address');
    }else if(dataValue == 'phone'){
      $('.custom_field input').attr("type", "tel");
      $('.custom_field input').attr("name", "phone");
      $('.custom_field input').attr("placeholder", "Enter an Phone Number");
	    $('.error-msg').text('Please enter a valid phone number');
    }
  })
});

function localStorageFun(dataValue){
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.setItem("selectedValue", dataValue);
  } else {
    // Sorry! No Web Storage support..
    console.log('Sorry! No Web Storage support')
  }
}

function validateSearch(e,getFieldValue){
  e.preventDefault();
  var getSearchValue = $('.custom_field input').val().toLowerCase();
  var regEx;
  if(getFieldValue == "email"){
    regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  }else if(getFieldValue == "phone"){
    regEx = /^[0-9]{10}$/;
  }
  if(getSearchValue.match(regEx) ){
    $('.above-the-fold').hide();
    $('.features').hide();
    $('.loader').show();
    document.querySelector('.custom_field input').parentNode.classList.remove("error");
    const proxyurl = "";
    const url =
      'https://ltv-data-api.herokuapp.com/api/v1/records.json?'+getFieldValue+'='+getSearchValue;
    fetch(proxyurl + url)
      .then((response)=>response.text())
    .then(function (contents) {
        localStorage.setItem("userObject", contents);
        window.location.href = "result.html";
      })
      .catch((e) => console.log(e));
  } else {
    document.querySelector('.custom_field input').parentNode.classList.add("error");
  }
}
