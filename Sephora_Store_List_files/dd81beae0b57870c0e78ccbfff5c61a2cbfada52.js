/*
  Although this code actually lives in our TMS(Signal Tag),
  we will update this sephora file when changes are made so we can 
  track them with git. So for now, changes should be in the TMS and committed to
  the Sephora code base as well.
*/

var wa = wa || {};

wa.config = {};

wa.search = {requests: 0, requestCache: {}};

/* Some environments don't load these libraries. This property tells us that 
** this library has been loaded and that the functions within it will be available.*/
wa.l = true;

var sephoraAnaData = (typeof Sephora != "undefined" && Sephora.analytics && Sephora.analytics.data) ? Sephora.analytics.data : {};
wa.anaPageLoadInfo = (wa.anaPageLoadInfo || sephoraAnaData.pageLoadInfo || {});
wa.anaEventInfo = (sephoraAnaData.eventInfo || {});

/* Keep this as well as Sephora.analytics.saveForBtReady
** We need this for sites that don't load Sephora.js */
wa.saveForBtReady = function(eName, args, opts){
  if (wa.btReady){
    wa.analyze(eName, args, opts);
  }
  else {
    $(window).on("btReady", function(){
     wa.analyze(eName, args, opts);
    });
  }
};

   /**
   * @param  {array or string} path - Path to the desired value
   * @param  {obj} start The object with which to start looking up properties of
   * @return {*} - Whatever value is stored in the desired property or "".
   * Note: This exact func also lives in Signal library "wa" and needs to be updated
   * there anytime this changes.
   */
  wa.safelyRead = function(path, start){
    var i,
        path = (typeof path === "string") ? path.split(".") : path,
        currLoc = (start || digitalData);

    for(i=0;i<path.length;i+=1){
      if(currLoc[path[i]]){
        currLoc = currLoc[path[i]];
        if(i === path.length-1){
          return (currLoc || "");
        }
      }
      else {
        return "";
      }
    }
  };

/** Replace Sephora.analytics.analyze with a real function ***/
(function($) {
  /********************** 
  * Setup "For next page" *
  **********************/
  var nextPageMatrix = {};
  nextPageMatrix["love"] = function (args){
    wa.forNextPage({events : args[1] ? "event27" : "event28"});
  };
  nextPageMatrix["store_search"] = function(args){
    wa.forNextPage({
      prop57 : args.criteria,
      prop59 : "find a store:search:" + args.location
    });
  };

  nextPageMatrix["addSampleToBasket"] = function (args){
    wa.forNextPage({
      events: "scAdd,event17,event61",
      productAdd: "test",
      eVar63: location.href
    });
  };

  nextPageMatrix["productClickThrough"] = function (args){

    var pageName;
    if (wa.pageName.split(":")[0] === "category") {
      pageName = wa.pageName + ":";
    } else { 
      pageName = wa.pageName.split(":")[0] + ":";
    }

    //var pageName = wa.pageName.split(":")[0] + ":",
    var category = "",
        eVar6 = "",
        isRec = args[0].isRec,
        algorithmId = args[0].certAlgId;

    var placementPage = (typeof wa.pageType != "undefined") 
                      ? (wa.pageType.indexOf("page") > -1 
                      ? wa.pageType 
                      : wa.pageType + "page") 
                      : "";

    var carouselName = args.title ? args.title.toLowerCase()
                      : args[0].title ? args[0].title.toLowerCase() 
                      : "Seph Analytics : Car Title Error";

    var slideNumber = args.slideNumber ? args.slideNumber : args[0].slideNumber;

    if (wa.pageType == "product"){
      category = "";
      eVar6 = wa.pageName;
    }

    wa.forNextPage({
      productAdd: "|eVar69="+ pageName + category + carouselName + ":slide " + slideNumber + ":click",
      recInfo: {isRec: isRec, placementPage: placementPage, carouselName: carouselName, algorithmId: algorithmId},
      eVar6: eVar6
    });
  };

  /**
   * Don't fire the event to the TMS until window.s is ready
   * @param  {string} eName - Event Name
   * @param  {*} args - Event Data
   * @param  {object} opts - Optional options object. Used in wa.analyze
   */
  wa.waitForS = function(eName, args, opts){
    if ( (typeof s !="undefined") && wa.btReady){//Fire if ready
      wa.analyze(eName, args, opts);
    }
    else {
      $("body").on("sIsReady", function(){//Listen for event
        wa.analyze(eName, args, opts);
      });
    }
  };

  wa.analyze = function(eName, args, opts) {
    var fire, fireWhenReady, b = $("body"), opts = (opts || {});

    fire = function(){
      b.trigger(eName, args);
    };

    waitFor = function(evtName){
      b.on(evtName, function(){
        fire();
      });
    };

    fireWhenReady = function(){
      if (wa.btReady){//Wait for TMS
        if(opts.waitForS && (typeof s === "undefined")){
          waitFor("sIsReady");//Fired from s_code Signal (TMS) Library
        }
        else {
          fire();
        }
      }
      else {
        b.on("btReady", function(){
          //Don't just call fire() because there could be other things to wait for as well.
          fireWhenReady(eName, args, opts);
        });
      }
    };

    if (opts.fireOnlyOnce || opts.doOnce){
      if( !digitalData.util.checkIfFiredAndRemember(eName) ){//Don't combine this with the check above
        fireWhenReady(eName, args);
      }
    }
    else if(opts.nextPage){
      nextPageMatrix[eName](args);
    }
    else if(opts.sameThread) { // for links that leave page. Need to make sure then get executed
      fireWhenReady();
    }
    else {
      setTimeout(function() {
        fireWhenReady();
      }, 0);
    }
    
  };//End Analyze

  if( (typeof Sephora != "undefined") && Sephora.analytics){
    $.extend(Sephora.analytics, {"analyze": wa.analyze});
  }

})(jQuery);



/** @constructor */
wa.lineItem = function (productId, productName, skuId, skuName, quantity, price, special, biType, notInStock, isAncillary) {
  this.productId = productId;
  this.productName = productName;
  this.skuId = skuId;
  this.skuName = skuName;
  this.quantity = quantity;
  this.price = price;
  this.special = special ? special.toLowerCase() : "";
  this.biType = biType ? biType.toLowerCase() : "unspecified";
  this.notInStock = notInStock;
  this.isAncillary = isAncillary;
};

/** @constructor */
wa.Payment = function (type, value) {
  this.type = type;
  this.value = value;
};

/** @constructor */
wa.Refinement = function (type, value) {
  this.type = type;
  this.value = value;
};


wa.setCookie = function (name, value, days, onTopDomain) {
    var days = (days || 365),
        cookieStr,
        dom,
        parts,
        makeTopDomain,
        makeExpiresString,
        toDelete = "";

    makeTopDomain = function(cookieString){
      if(isNaN(parseInt(document.domain.replace(/\./g, "")))) {
        parts = document.domain.split(".");
        dom = parts.slice(-2).join(".");
      } else {
        dom = document.domain;
      }
      return cookieString + ";domain=" + dom; //Don't overwrite cookieStr.
    };

    makeExpiresString = function(millis){
      var now, then, exp;
      now = new Date();
      then = new Date(now.getTime() + millis);
      exp = then.toGMTString();
      return ("; expires=" + exp);
    };

    var millis = days*86400000;

    millis||(millis=0);

    cookieStr = escape(name) + "=" + escape(value);//use encodeURI, decodeURI, encodeURIComponent, and decodeURIComponent

    if(millis!==0) {
      cookieStr += makeExpiresString(millis);
    }
    cookieStr += "; path=/";

    /* Remove any other instances of this cookie before setting it.
    ** This is important because otherwise when we read the cookie, if there are 
    ** more than one, we won't know which one to use. */
    if(document.cookie.indexOf(name) != -1){
      toDelete = escape(name) + "=" + "" + makeExpiresString(-86400000) + "; path=/";
      document.cookie = toDelete;//Delete normal cookie
      document.cookie = makeTopDomain(toDelete);//Delete top level cookie
    }

    if(onTopDomain){
      document.cookie = makeTopDomain(cookieStr);
      return makeTopDomain(cookieStr);
    }
    else {
      document.cookie = cookieStr;
      return cookieStr
    }
};

wa.getCookie = function (key, opts) {
  var matchedCookies = [],
      opts = (opts || {});
  if (opts.skips == null){opts.skips = 0};
  var cookie_string = "" + document.cookie;
  var cookie_array = cookie_string.split("; ");
  for (var i = 0; i < cookie_array.length; ++i) {
    var single_cookie = cookie_array[i].split("=");
    if (single_cookie.length != 2){continue;}
    var name = unescape(single_cookie[0]);
    var value = unescape(single_cookie[1]);
    // Return cookie if found:
    /*if (key == name && opts.skips-- == 0){
      /*return value;
    }
    */
    if (key == name){
      matchedCookies.push(value);
    }
  }
  // When there are more than one of the same name, get the second.
  if (matchedCookies.length > 1){

    if(opts.clear){
      wa.setCookie(key, "", 1)
    }

    return matchedCookies[1];
    /*I don't know if/where skips are used but this may need to be added back in...
    return matchedCookies[skips];*/
  }
  else if(matchedCookies.length){
    if(opts.clear){
      wa.setCookie(key, "", 1)
    }
    return matchedCookies[0];
  }
  else{return null;}

};

wa.country = wa.getCookie("ship_country");

wa.deleteCookie = function (name, topLevelDomain) {
  this.setCookie(name, '', -1, topLevelDomain);
};

wa.isEmpty = function (a) {
  return a === null || typeof a == 'undefined' || a === '';
};

/*
@param bool includeUS - When true return even if sitLoc is 'us' and use '-' instead of ':'
*/
wa.getLocLangPrefix = function(includeUS){
  var siteLang = wa.getCookie("site_language");
  var siteLoc = wa.getCookie("site_locale");
  var prefix = "";
  if (siteLang && siteLoc){
    if (includeUS) { prefix = siteLoc + "-" + siteLang; }
    else if (siteLoc !== "us") { prefix = siteLoc + ":" + siteLang + ":"; }
  }
  return prefix;
}

wa.getShippingCountry = function(){
    var country = wa.getCookie("ship_country");
    return country ? country.toLowerCase() : "us";
}

wa.countryPath = function(newSelection){
    var path = sessionStorage.countryPath;
    if(newSelection){
      path = path ? path + "<" + newSelection : newSelection;
      sessionStorage.countryPath = path.toLowerCase();
    }
    return path;
}

wa.isOriginalContent = true; // used to tell if the ajax page is the first one for setting events

//fix for pages that lose data when switching between https and http
(function(){
  var was = wa.getCookie("wasHttps");
    var is = location.protocol == "https:";
    wa.setCookie("wasHttps", is, 1);
  wa.wasHttps = was;
})();

wa.inStringRegExpList = function (a,v) {
  for (var i = a.length; i--;) {
    if (typeof a[i] == 'string' && a[i] == v) {
      return true;
    } else if (a[i] instanceof RegExp && a[i].test(v)) {
      return true;
    }
  }
  return false;
};

wa.getQueryParam = function(name, href) {
  if(href.indexOf("%20&%20")>0){
    href = href.replace("%20&%20", "ampersand");
  }
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var result = RegExp('[\\?&]' + name + '=([^&#]*)').exec(href);
  return result === null ? '' : name === 'om_mmc' ? decodeURIComponent(result[1]) : decodeURIComponent(result[1].replace(/\+/g, ' '));
};

wa.findStoreName = function(){
  return $(".storehq-detail .store-name").length > 0 ? $(".storehq-detail .store-name").text().trim() +":" : "";
}

// cleanup data being passed into SiteCatalyst
// (perform recursive URL-decoding, etc.)
wa.clean = function(txt) {
  // called 3x because some content is encoded multiple times
  txt = decodeURIComponent(decodeURIComponent(decodeURIComponent(txt)));
  return txt;
};

// called twice to make sure both document ready and script loaded
wa.initOnReady = function() {
  if (wa.config.ready) {
    if((typeof wa !== 'undefined') && ("waInitReady" in wa)) {
        wa.init();
    } else {
        $("body").on("waInitReady", function(){wa.init();});
    }
  } else {
    wa.config.ready=true;
  }
};

wa.getNextPageData = function(clear){
  var next = wa.getCookie('nextPage');
  next = (next || "{}");

  /* Protect against cookies that are in the wrong format such as non JSON format */
  if(next.indexOf("{") != -1){
    next = JSON.parse(next);
  }
  else {//Remove if it was in wrong format
    wa.setCookie("nextPage", "{}", 1);
  }

  if(clear){
    wa.setCookie("nextPage", "{}", 1);
  }
  return next;
};

wa.forNextPage = function(data){
  var next= wa.getNextPageData();
  var onTopDomain = false;
  if (data.onTopDomain){
    onTopDomain = true;
    delete data.onTopDomain;
  }
  for(var n in data){
    next[n] = data[n];
  }
  wa.setCookie("nextPage", JSON.stringify(next), 1, onTopDomain);
};

wa.addSavedVarsToObject = function(s){
  var combineIntoS = function(dataToAdd){
    var key;
    for(var key in dataToAdd){
      if(key == "events"){
        s[key] = s[key] && s[key].length > 0 ? s[key] + "," + dataToAdd[key] : dataToAdd[key];
      } else if (key.indexOf("prop") > -1 || key.indexOf("eVar") > -1){
        //This is a hack to stop reporting eVar53 in production, because we don't want to pass an unhashed email
        if ( key.indexOf("eVar53")===-1 ){
          s[key] = dataToAdd[key];
        }
      }
    }
  };

  //Legacy: Add data from cookie
  combineIntoS(wa.getNextPageData(true));

  //New method: Add data from sessionStorage
  combineIntoS(digitalData.util.getNextPageData(true));
};

wa.getURL = function(){
  return window.location.href.replace(/%3d/g, '=');
}

wa.manuallyUpdateS = function(){
  var s = (window.s || {});
  s.pageURL = wa.getURL();//We always need to update this because AJAX "page loads" change the url but don't refresh the page.
  wa.addSavedVarsToObject(s);
};

wa.findInitalSearchNum = function(tabName){
  var num = "0";
  if(wa.search.tabs){
    $(wa.search.tabs).each(function(){
      if(this.title.toLowerCase() == tabName.toLowerCase()){
        num = this.total_items;
      }
    });
  } else {
    return "";
  }
  return num.toString();
};

wa.firstClick = function (target) {
  // Test if clicked argument passed
  if ( !(target.attr("data-clicked")) ) {
    target.attr("data-clicked", "true");
    return true;
  }
  else {
    return false;
  }
};

/**
 * Checks if an event has been fired once before
 * @param {string} evtName - The arguments for the function that will be called.
 * @return {bool} Whether or not the function has been called before.
 */
  wa.doOnce = (function(){
    var doneOnce = [],
        i;

    var firedBefore = function(fnStr){
      if(doneOnce.length){
        for(i=0; i<doneOnce.length; i+=1){
          if(doneOnce[i] === fnStr){
            return true;
          }
        }
      }
      return false;
    };

    return function(evtName){
      if(!firedBefore(evtName)){
        doneOnce.push(evtName);
        return true;
      }
      return false;
    }
  }());

wa.errorMessages = function(eventData){
  //When you only want to report field errors make the original call like this: Sephora.analytics.analyze("errorMessages", {field:resp.errors.field});
  if(typeof eventData != 'undefined'){
    //Safely account for any missed legacy calls with different argument
    var errData = (eventData[0].global || eventData[0].field) 
                  ? eventData[0]
                  : eventData[0].errors;

    var err = "",
        captchaErr = "",
        globalErr = (errData.global),
        fld = errData.field;

    if(fld){//Field errors
      for(n in fld){
        if (n === "challengeAnswer" || n === "challenge_answer" && fld[n].length > 0){captchaErr = "captcha error: " + fld[n]}
        else if(err.indexOf(fld[n])==-1){ /* Avoids duplicates */
          err += fld[n] + ",";
        }
      }
    }
    if(err.length < 100 && typeof globalErr === "object"){
      $.each(globalErr, function(i, value){
        if (value.indexOf("Please enter the correct code") > -1){
          captchaErr = "captcha error: " + value;
        }
        else {
          err += value;
        }
      })
    }
    else if(globalErr){
      err += globalErr;
    }

    if (captchaErr){err = captchaErr + "," + err};
    if(err.length > 100){
      err = err.substr(0,100) + "...";
    }
    return err.toLowerCase();
  }
};

wa.removeSpecialChars = function(str){
  var str = (str || "");
  var charMatrix = { ô:"o","&#244;":"o", è:"e", é:"e", "&#200;":"e", "È":"e", "&#233":"e", "&#201;":"e", à:"a", "®":"", "&#174;":"",
    "™":"", "&#153;":"", "&#8482":"", "&#192;":"a", "&#236;":"i", "&#238;":"i", "&#212;": "o", "&#232;": "e", "'":"", "ampersand":" & "};

  var re = new RegExp(Object.keys(charMatrix).join("|"),"gi");
  str = str.replace(re, function(matched){
    return charMatrix[matched];
  });
  return str;
};

wa.getUserProp = function(prop){
  /* This is needed because there are three different ways we get user data.
  ** This degrades gracefully and hopefully returns something useful. 
  ** Other Notes: 
  ** This is being changed in master by Gemma/Oleksandr and will probably need to be adapted.
  ** The Cookie is deleted after we get the full user data and set sessionStorage */
  
  //Props are called different things in differnt places - Map translates
  /*
  var nameMappingCookie = {
    "biType": //TO DO: Fill this in with name from cookie,
    "isFlash": //TO DO: Fill this in with name from cookie,
    "signInStatus": //TO DO: Fill this in with name from cookie
  }
  */
  var nameMappingSS = {
    "biType": "bi_status",
    "isFlash": "is_user_flash",
    "signInStatus": "login_status"
  }

  var data = (function(){
    var d,
        propName;
    //Fallback to cookie
    /**
    *** Due to ILLUPH-57061, no cookie is currently set in prod or QA. 
    *** Once that's fixed, this reading of the cookie needs to be tested
    *** and uncommented.
    **/
    /*
    if( d = wa.getCookie("user") ){
      d = JSON.parse(d); //This JSON.parse may need to be done twice.
      propName = nameMappingCookie[prop];
      d = d[propName];
    }
    */
    //Fallback to session storage 
    /** Once ILLUPH-57061 is fixed, cookie should be checked first and this
    *** should become "else if" 
    **/
    if( d = sessionStorage.getItem("sephUser") ){
      d = JSON.parse(d);
      propName = nameMappingSS[prop];
      d = d[propName];
    }
    if(!d){//Don't use else if! The last if could have been true, but then not had the value it needed.
      /*This is getting checked last because I think there may be faulty logic in production code
      ** that is setting wa values. Let's trust the cookie or SS*/
      d = wa[prop];
    }
    return d;
  }());

  if(data){
    if(typeof data === "string"){
      if(data === "loggedin"){
        data = "signed in"
      }
      data = data.toLowerCase();
      if(data === "non_bi"){
        data = data.replace("_","-");
      }
    }
    return data;
  }
  else{
    return false; //Handle false fallback in the actual signal binding.
  }
};


wa.setPageName = function(name){
  name = wa.removeSpecialChars(name);
  wa.pageName = name.toLowerCase();
};

wa.colorIqLookUp = "purchase"; //overridden in eventBridge if reverse lookup

wa.isTablet = function() {
    /* If this is buggy, call it in init and not from ST data binding */
  if(wa.getCookie("isTablet") === null){
    try {
      var tablets = {iPad:"iPad|iPad.*Mobile",NexusTablet:"Android.*Nexus[\\s]+(7|9|10)|^.*Android.*Nexus(?:(?!Mobile).)*$",SamsungTablet:"SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-I9205|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T707A|SM-T807A|SM-T237P|SM-T807P|SM-P607T|SM-T217T|SM-T337T",Kindle:"Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI)\\b",SurfaceTablet:"Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",HPTablet:"HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",AsusTablet:"^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG",BlackBerryTablet:"PlayBook|RIM Tablet",HTCtablet:"HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",MotorolaTablet:"xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",NookTablet:"Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",AcerTablet:"Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b",ToshibaTablet:"Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",LGTablet:"\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",FujitsuTablet:"Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",PrestigioTablet:"PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD",LenovoTablet:"Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)",DellTablet:"Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",YarvikTablet:"Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",MedionTablet:"Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",ArnovaTablet:"AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",IntensoTablet:"INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",IRUTablet:"M702pro",MegafonTablet:"MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",EbodaTablet:"E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",AllViewTablet:"Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",ArchosTablet:"\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",AinolTablet:"NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",SonyTablet:"Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551",PhilipsTablet:"\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",CubeTablet:"Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",CobyTablet:"MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",MIDTablet:"M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733",MSITablet:"MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",SMiTTablet:"Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",RockChipTablet:"Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",FlyTablet:"IQ310|Fly Vision",bqTablet:"bq.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant)|Maxwell.*Lite|Maxwell.*Plus",HuaweiTablet:"MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim",NecTablet:"\\bN-06D|\\bN-08D",PantechTablet:"Pantech.*P4100",BronchoTablet:"Broncho.*(N701|N708|N802|a710)",VersusTablet:"TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",ZyncTablet:"z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",PositivoTablet:"TB07STA|TB10STA|TB07FTA|TB10FTA",NabiTablet:"Android.*\\bNabi",KoboTablet:"Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",DanewTablet:"DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",TexetTablet:"NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",PlaystationTablet:"Playstation.*(Portable|Vita)",TrekstorTablet:"ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",PyleAudioTablet:"\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",AdvanTablet:"Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",DanyTechTablet:"Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",GalapadTablet:"Android.*\\bG1\\b",MicromaxTablet:"Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",KarbonnTablet:"Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",AllFineTablet:"Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",PROSCANTablet:"\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",YONESTablet:"BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",ChangJiaTablet:"TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",GUTablet:"TX-A1301|TX-M9002|Q702|kf026",PointOfViewTablet:"TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",OvermaxTablet:"OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)",HCLTablet:"HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",DPSTablet:"DPS Dream 9|DPS Dual 7",VistureTablet:"V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",CrestaTablet:"CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",MediatekTablet:"\\bMT8125|MT8389|MT8135|MT8377\\b",ConcordeTablet:"Concorde([ ]+)?Tab|ConCorde ReadMan",GoCleverTablet:"GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",ModecomTablet:"FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",VoninoTablet:"\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",ECSTablet:"V07OT2|TM105A|S10OT1|TR10CS1",StorexTablet:"eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",VodafoneTablet:"SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7",EssentielBTablet:"Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",RossMoorTablet:"RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",iMobileTablet:"i-mobile i-note",TolinoTablet:"tolino tab [0-9.]+|tolino shine",AudioSonicTablet:"\\bC-22Q|T7-QC|T-17B|T-17P\\b",AMPETablet:"Android.* A78 ",SkkTablet:"Android.* (SKYPAD|PHOENIX|CYCLOPS)",TecnoTablet:"TECNO P9",JXDTablet:"Android.*\\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",iJoyTablet:"Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",FX2Tablet:"FX2 PAD7|FX2 PAD10",XoroTablet:"KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",ViewsonicTablet:"ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",OdysTablet:"LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",CaptivaTablet:"CAPTIVA PAD",IconbitTablet:"NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",TeclastTablet:"T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",JaytechTablet:"TPC-PA762",BlaupunktTablet:"Endeavour 800NG|Endeavour 1010",DigmaTablet:"\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",EvolioTablet:"ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",LavaTablet:"QPAD E704|\\bIvoryS\\b|E-TAB IVORY",CelkonTablet:"CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",MiTablet:"\\bMI PAD\\b|\\bHM NOTE 1W\\b",NibiruTablet:"Nibiru M1|Nibiru Jupiter One",NexoTablet:"NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",UbislateTablet:"UbiSlate[\\s]?7C",PocketBookTablet:"Pocketbook",Hudl:"Hudl HT7S3",TelstraTablet:"T-Hub2",GenericTablet:"Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bJolla\\b"}

      function findTablet(uAgent){
        var isTab = "false";
        for (tablet in tablets){
          if ( tablets.hasOwnProperty(tablet) ){
            if (uAgent.search(tablets[tablet]) > -1){
              isTab = "true";
              return true;
            }
            else {
              isTab = "false";
            }
          }
        }
        wa.setCookie("isTablet", isTab);
      }
      if (window.navigator && window.navigator.userAgent){
        return findTablet(window.navigator.userAgent);
      }
    } catch (e){}
  }
  else {
    return (wa.getCookie("isTablet") === "true");
  }  
};
wa.bindNextPageData = function(data) {
  var d = data;

  var pc = d.postCond;

  if (pc == "isStoreHQ") {
    if (wa.pageType == "storehq") {
      wa.internalCampaign = d.eVar75;
    }
  }
};

wa.paidSearchUserAction = function(eventData){
  var d = eventData[0];
  
  if (typeof d === "string"){return d};

  var pc = d.postCond;

  if (typeof pc != "undefined"){
    if (pc == "isNowBi"){
      if (wa.biType && (wa.biType != "non-bi")){
        return d.scenario_code;
      }
    }
  }
  else {
    return d.scenario_code;
  }
};

wa.pageSpecificLoadEvents = function(page){
  /* This is usually called from the 'Additional Configuration' section of a page's page load tag.
  ** We need this because Signal will only fire code that binds data which is used in a tag.
  ** This code needs to fire regardless of whether data is bound as a result */
  switch (page){
    case "order_confirmation":
      if (wa.biType != "rouge"){
        wa.purchEvent.forEach(function(purchObj){
          if (purchObj.special.indexOf("flash")!=-1){
            wa.analyze("paidSearchUserAction", {"scenario_code":"flash"});
          }
        })
      }
    break;
  }
};



//See if there were EVENTS sent from the previous page to be fired on the next page (this page). If there were fire them now.
(function(){
  var events = ( wa.getCookie("anaNextPageEvent") || "");

  if (events.length){
    var i,
        currEvent,
        data;
    events = events.split(",");
    for(i=0; i<events.length; i+=1){
      currEvent = events[i].split(":");
      data = (function(){
        var dataObj = {},
            dataPairs,
            currPair,
            i;
        if(currEvent[1].indexOf("=>")!=-1){//Data needs to be converted to an obj
          dataPairs = currEvent[1].split("|");
          for (i=0; i<dataPairs.length; i+=1){
            currPair = dataPairs[i].split("=>");
            if (currPair[1]){ dataObj[currPair[0].trim()] = currPair[1];}
          }//end for dataPairs
          return dataObj;
        }
        else{//not an object
          return currEvent[1];
        }
      }()); //End data variable assignment


      if (currEvent[0] === "bindNextPageData"){
        /* For events that don't fire tags 
        ** we just set properties and tags already firing will pick them */
        wa.bindNextPageData(data);
      }
      else {
        //Some code will need to be added if we ever need to pass the third param (opts) in this scenario.
        try {
          Sephora.analytics.saveForBtReady(currEvent[0], data);
        }
        catch (e){
          try {
            wa.analyze(currEvent[0], data);
          }
          catch(e){/*do nothing;*/}
        }
      }

      //Clear out the session storage string
      wa.deleteCookie("anaNextPageEvent", true);
    } //End for i<events
  }//if (events.length)

}());//End check for anaNextPageEvent

