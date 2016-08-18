$(function () {
    /*$("body").on("click",".user-address-content ul li",function () {
     $(this).addClass("on").find("input").prop("checked",true);
     $(this).siblings("li").find("input").prop("checked",false);
     $(this).siblings("li").removeClass("on");
     });*/
    mui("body").on("tap", ".user-address-content li.clearfix", function () {
        var addrId = $(this).attr("id");
        var url = $("#url").val();
        if (url) {
            location.href = url + "&addrId=" + addrId;
        }
    });


    mui('body').on('tap', '.user-address-add-btn,.mui-pull-right a', function (e) {//mui冲突链接
        var sHref = $(this).attr("href");
        toNewPage(sHref);
    });

    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
});