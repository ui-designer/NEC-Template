const myApp = (function () {
  const domain = "https://ltv-data-api.herokuapp.com/api/v1/records.json?";
  const emailAttr = {
    name: "email",
    type: "email",
    placeholder: "Enter an Email Address",
  };
  const phoneAttr = {
    name: "phone",
    type: "tel",
    placeholder: "Enter an Phone Number",
  };
  return function app() {
    const inputSelector = $(".custom_field input");
    //localStorageFun is used for store the tab selected value;
    localStorageFun("email");
    // onclick to search
    $("#btn-search").on("click", function (e) {
      let getFieldValue = localStorage.getItem("selectedValue");
      validateSearch(e, getFieldValue);
    });
    // enter to search
    $("input[type='text']").keyup(function (e) {
      keycode = e.keyCode ? e.keyCode : e.which;
      if (keycode == "13") {
        let getFieldValue = localStorage.getItem("selectedValue");
        validateSearch(e, getFieldValue);
      }
    });
    //Used for tabing email and phone number
    $(".custom_tabs li:not(:first-child)").click(function () {
      const errorClass = $(this)
        .parents(".input-group")
        .siblings(".input-group");
      $(this).addClass("active").siblings("li").removeClass("active");
      let dataValue = $(this).data().value;
      localStorageFun(dataValue);
      errorClass.removeClass("error");
      errorClass.children("input").val("");
      if (dataValue == "email") {
        inputSelector.attr(emailAttr);
        $(".error-msg").text("Please enter a valid email address");
      } else if (dataValue == "phone") {
        inputSelector.attr(phoneAttr);
        $(".error-msg").text("Please enter a valid phone number");
      }
    });
    //Localstorage Function
    function localStorageFun(dataValue) {
      if (typeof Storage !== "undefined") {
        // Code for localStorage/sessionStorage.
        localStorage.setItem("selectedValue", dataValue);
      } else {
        // Sorry! No Web Storage support..
        console.log("Sorry! No Web Storage support");
      }
    }
    // Validate search function
    function validateSearch(e, getFieldValue) {
      e.preventDefault();
      let getSearchValue = inputSelector.val().toLowerCase();
      let regEx;
      if (getFieldValue == "email") {
        regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      } else if (getFieldValue == "phone") {
        regEx = /^[0-9]{10}$/;
      }
      if (getSearchValue.match(regEx)) {
        loaderFunction();
        inputSelector.parents().removeClass("error");
        fetchSearchData(getFieldValue, getSearchValue);
      } else {
        inputSelector.parents().addClass("error");
      }
    }
    //Fetch Search Data Function
    async function fetchSearchData(getFieldValue, getSearchValue) {
      try {
        const url = domain + getFieldValue + "=" + getSearchValue;
        const response = await fetch(url);
        const context = await response.text();
        localStorage.setItem("userObject", context);
        window.location.href = "result.html";
      } catch (error) {
        console.log(error);
      }
    }
  };
  //Loader Function
  function loaderFunction() {
    $(".above-the-fold").hide();
    $(".features").hide();
    $(".loader").show();
  }
})();

myApp();
