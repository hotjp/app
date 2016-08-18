//包含底部栏的页面配置
var includeFooterPage = [
    {id: "index", page: ["index"]},
    {id: "sort", page: ["sort"]},
    {id: "cart", page: ["cart", "goods_cart"]},
    {id: "user", page: ["user_center"]}
];

mui.plusReady(function () {
    //首页返回键处理
    //处理逻辑：1秒内，连续两次按返回键，则退出应用；
    var first = null;
    plus.key.addEventListener('backbutton', function () {
        //首次按键，提示‘再按一次退出应用’
        if (!first) {
            first = new Date().getTime();
            mui.toast('再按一次退出应用');
            setTimeout(function () {
                first = null;
            }, 2000);
        } else {
            if (new Date().getTime() - first < 2000) {
                plus.runtime.quit();
            }
        }
    }, false);
});

function setCurSelect() {
    var urlStr = location.href;
    urlStr = urlStr.split("?")[0];
    var urlArr = urlStr.split("/");
    urlStr = urlArr[urlArr.length - 1].split(".")[0];

    var curPage = "";
    $.each(includeFooterPage, function (i, o) {
        var id = o.id;
        var page = o.page;
        if ($.inArray(urlStr, page) > -1) {
            curPage = id;
            return false;
        }
    });

    $("#footer a[data-id='" + curPage + "']").addClass("mui-active");
}


function setCartCount() {
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/user/doSelCartSize.do",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.data.cartSize == null) {

            } else {
                var sHtml = "<span class='mui-badge'>" + data.data.cartSize + "</span>";
                $("#footerCartCount").html(sHtml);
            }
        }
    });
}
$(function () {
    setCurSelect();//设置当前选中项样式
    setCartCount();//设置购物车的数量
    mui('.bottom-nav').on('tap', 'a', function (e) {//mui冲突链接
        var href = $(this).attr("href");
        toNewPage(href);
    });
})