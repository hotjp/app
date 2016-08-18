mui('body').on('tap', ".mui-pull-right", function () {
    //toIndexPage();
    var href = vars.root + "/ec/mbr/goods_cart.html";
    location.href = href;
});
function setCartCount() {//设置购物车数量
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/user/doSelCartSize.do",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.data.cartSize == null) {

            } else {
                var html = "<span class='mui-badge fs-10'>" + data.data.cartSize + "</span>"
                if(data.data.cartSize>0){
                    $(".mui-pull-right").append(html);
                }
            }
        }
    });
}
$(function(){
    setCartCount();
});