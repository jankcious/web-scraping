function topNav(e, link) {
  
  /* Commenting out while I test another way
  wa.forNextPage({prop6 : wa.pageName});
  */

  var path = [];
  var go = true;
  var linkText = "";
  while(go && link.length != 0){ 
    if(link.parent(".Meganav-promo").length || link.parent(".foot").length){
      path.push(Sephora.util.ParameterUtils.extractParam("icid2", link.attr("href").split("?")[1]));
    } else if(link.parent(".imageComponent").length){
      path.push(link.attr("title").trim().toLowerCase());
      link = link.parent(".imageComponent");
    } else if (link.attr("data-wa-info")) {
      path.push(link.attr("data-wa-info"));
    } else if ( !(link.hasClass("meganav__sub")) ) {
      path.push(link.text().trim().toLowerCase());
    } 
    if(link.hasClass("link-top")){
      go = false;
    } else if(link.filter("h4").length > 0 || link.parent("h4").length > 0 || link.parent(".Meganav-promo").length > 0
        || link.parent(".foot").length > 0 || link.parent(".see-all, .shop-sc").length > 0){
      link = link.closest(".Meganav-drop").siblings("a");
    } else if(link.hasClass("imageComponent")){
      link = link.closest(".Meganav-drop").next();
    } else if (link.hasClass("Meganav-brandTop")) {
      link = link.closest(".Meganav-drop").siblings("a");
    } else {
      link = link.closest("ul");
      if(link.prev().filter("h4").length == 0){
        link = link.closest(".Meganav-drop").next();
      }
      else {
        link = link.prev();
        linkText = link.text().trim();
        if (linkText.length == 1 || (linkText.indexOf("X Y Z") != -1) ) { //Don't include the single letter of the section such as "E"
        link = link.closest(".Meganav-drop").siblings("a");
        }
      }
    }
  }
  path.push("top nav");
  path.reverse();
  while(path.length < 5 && path.length > 0){
    path.push(path[path.length -1]);
  }

  path = wa.removeSpecialChars(path.join(":"));
  Sephora.util.CookieUtils.write_cookie("navTrack", path, 1);
}

function leftNav(link){
  function getText(ele){
    var clone = ele.clone();
    clone.find("span").remove();
    return clone.text().trim().toLowerCase();
  };

  var path = [];
  var ogText = getText(link);

  var ele = link.closest(".nav").prev();
  var runAway = 1;
  while(ele.length > 0 && runAway < 5) {
    path.push(getText(ele));
    if(ele.hasClass("nav-subhead")){
      ele = ele.siblings(".nav-title");
      path.push(getText(ele));
    }
    ele = ele.closest(".nav").prev();
    runAway++;
  }

  if($("meta[name='searchtype']").attr("content") == "category"){
    path.push($($(".breadcrumb li")[0]).text().trim().toLowerCase());
  }
  else if ($("[data-ana-category]").text()) {
    path.splice(-1, 0, $("[data-ana-category]").text().trim().toLowerCase());
  }

  path.push("left nav");
  path.reverse();

  var l = path.length;
  for(var i=l; i<5; i++){
    path.push(ogText);
  }

  Sephora.util.CookieUtils.write_cookie("navTrack", path.join(":"), 1);
}

jQuery(".sidenav").on("click", "li:not(.more-cats) a, h2 a", function () {
    leftNav($(this));
    Sephora.util.CookieUtils.write_cookie("navSource", "left nav");
});

$(".Meganav").on("click", "a[href], .view-all-cat", function () {
    var anchor = $(this);
    topNav("top nav", anchor, $(".breadcrumb li"));
    Sephora.util.CookieUtils.write_cookie("navSource", "top nav");
});

// ---------------------- TOP NAV LINKS ------------------------------------------------------
//Stores
$(".MySeph [data-analytics='stores']").on("click",function () {
  Sephora.util.CookieUtils.write_cookie("sendData", ":top bar:stores:stores:stores:stores",1);
  Sephora.util.CookieUtils.write_cookie("navTrack", "top bar:stores:stores:stores:stores",1);
    Sephora.util.CookieUtils.write_cookie("navSource", "top bar:stores:stores:stores:stores");
});

//Loves
$(".MySeph [data-original-title='LOVES: YOUR SHOPPING LIST']").on("click", function () {
    Sephora.util.CookieUtils.write_cookie("sendData", ":top bar:love link:love link:love link:love link",1)
    Sephora.util.CookieUtils.write_cookie("navTrack", "top bar:love link:love link:love link:love link",1)
    Sephora.util.CookieUtils.write_cookie("navSource", "top bar:love link:love link:love link:love link");
});
//-----------------------------------------------------------------------------------------------

// QuickLook cookie
jQuery("a[rel='#quick-look']").on("click", function(){
    var prodId = jQuery(this).attr("id").split("product-")[1];
    Sephora.util.CookieUtils.write_cookie("quickLook",wa.pageName + "_quicklook_" + prodId,1);
});

// Temporary solution in 15.7 for top nav sephora tv tracking
$(".Meganav").on("click", ".Meganav-drop--3 .c-Image a", function () {
    var indexOfSephoraTv = $(this).html().toLowerCase().indexOf("sephora tv");
    if (indexOfSephoraTv > -1) {
        var cookieText = "top nav:inspire me:sephora tv:sephora tv:sephora tv";
        Sephora.util.CookieUtils.write_cookie("navTrack", cookieText, 1);
    }
}); 