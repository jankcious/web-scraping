/* Sephora Analytics */

//custom clicks

$("body").on("click", "[data-track-parallax]", function(){
  Sephora.analytics.analyze("sendData", ["parallax", "", {pid:$(this).data("product-id"), details:wa.pageType       +":"+ wa.pageName+":"+$(this).data("details")}], {sameThread:true});
});

$(".my-sephora [data-analytics='stores']").click(function(){ // not handled in eventBridge!!! or link delay do we want this?
  Sephora.analytics.analyze("sendData", ["stores", "top link"], {sameThread: true});
});

$(".footer-links a[href='/store-locations-events?mediaId=16400021']").click(function(){
  Sephora.analytics.analyze("sendData", ["stores", "footer link","store locartions & events"], {sameThread: true});
});

$("#skincare-iq .skiniq-nav a").click(function(){
  wa.forNextPage({prop55 : $("span", this).text().trim()});
});

$(".co-basket .btn-back").click(function(){
  wa.forNextPage({prop6 : wa.prevPageName + ":my basket back"});
});

$("[name='subscribeFlash']").submit(function(){
  wa.forNextPage({prop55 : "flash:request invite"});
});


$("#modal-ship-country-selector .btn-primary").click(function(){
  wa.countryPath($("#modal-ship-country-selector .country-select .selected").data("country"));
});

$(".purchases-content").on("click", ".list-item .coloriq-match a",function(){
  Sephora.analytics.analyze("sendData", ["coloriq", "directLookup", "purchase"], {sameThread:true});
});

$(".account-module.color-iq").on("click", ".skintone a", function(){
  Sephora.analytics.analyze("sendData", ["coloriq", "directLookup", "account"], {sameThread: true});
});

$(".maincontent").on("click", ".search-results a.SkuItem", function(){
  wa.forNextPage({prodIdx: $(this).data("idx")});
});

$(".mod-recommend a[data-productid]").click(function(){
  Sephora.analytics.analyze("productClickThrough", [ {title:"recommended just for you", slideNumber:1} ], {nextPage: true});
});

$("#list_pane").on("click", ".list-image a, .list-description a",function(){
  Sephora.analytics.analyze("productClickThrough", [ {title:"basket loves", slideNumber:1} ], {nextPage: true});
});


window.analyze = wa.analyze;


//custom clicks

//Temp fix for play pdp subscribe clicks
(function(){
  var playSubmitBtn = $($(".pdp-play .pdp-primary__actions button")[0]);
  playSubmitBtn.on("click", function(){
    //Check if modal is open now. If it wasn't, then the button was disabled when clicked
    if ($($(".pdp-play .pdp-primary__actions button:visible")[1]).length){
        Sephora.analytics.analyze("genericPopup", {"info": "play:subscribe now", "pageName": "pop-info: play"})
    }
  })
}());

$("body").on("click", "[data-track-parallax]", function(){
  Sephora.analytics.analyze("sendData", ["parallax", "", {pid:$(this).data("product-id"), details:wa.pageType       +":"+ wa.pageName+":"+$(this).data("details")}], {sameThread:true});
});

$(".my-sephora [data-analytics='stores']").click(function(){ // not handled in eventBridge!!! or link delay do we want this?
  Sephora.analytics.analyze("sendData", ["stores", "top link"], {sameThread: true});
});

$(".footer-links a[href='/store-locations-events?mediaId=16400021']").click(function(){
  Sephora.analytics.analyze("sendData", ["stores", "footer link","store locartions & events"], {sameThread: true});
});

$("#skincare-iq .skiniq-nav a").click(function(){
  wa.forNextPage({prop55 : $("span", this).text().trim()});
});

$(".co-basket .btn-back").click(function(){
  wa.forNextPage({prop6 : wa.prevPageName + ":my basket back"});
});

$("[name='subscribeFlash']").submit(function(){
  wa.forNextPage({prop55 : "flash:request invite"});
});


$("#modal-ship-country-selector .btn-primary").click(function(){
  wa.countryPath($("#modal-ship-country-selector .country-select .selected").data("country"));
});

$(".purchases-content").on("click", ".list-item .coloriq-match a",function(){
  Sephora.analytics.analyze("sendData", ["coloriq", "directLookup", "purchase"], {sameThread:true});
});

$(".account-module.color-iq").on("click", ".skintone a", function(){
  Sephora.analytics.analyze("sendData", ["coloriq", "directLookup", "account"], {sameThread: true});
});

$(".maincontent").on("click", ".search-results a.SkuItem", function(){
  wa.forNextPage({prodIdx: $(this).data("idx")});
});

$(".mod-recommend a[data-productid]").click(function(){
  Sephora.analytics.analyze("productClickThrough", [ {title:"recommended just for you", slideNumber:1} ], {nextPage: true});
});

$("#list_pane").on("click", ".list-image a, .list-description a",function(){
  Sephora.analytics.analyze("productClickThrough", [ {title:"basket loves", slideNumber:1} ], {nextPage: true});
});

$(".tv-list").on("click", ".tv-list__vid", function(){
    var origin = $(this).data("video-placement");
    var videoId = $(this).data("video-embed-code");
    wa.forNextPage({eVar24: "sephoratv_" + origin + "_" + videoId, eVar75: "sephoratv_na_" + origin + "_video"});
});

/* Commenting out while I test a different way.
if (wa.ajaxOnlyLoadPages()) {
    $("a").on("click", function() {
        wa.forNextPage({prop6 : wa.pageName});
    });
}
*/