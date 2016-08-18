$(document).ready(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    $(".sort-left ul li a").click(function () {
        $(".sort-right ul li").hide();
        var pid = $(this).attr("id");
        $(".sort-right ul li:has(a[p-id='" + pid + "'],a[cat-id='" + pid + "'])").show();
        $(".sort-left li").removeClass();
        $(this).parent("li").addClass('on');
    });

    mui('.sort-right').on('tap', "a", function () {
        var sHref = $(this).attr("href");
        toNewPage(sHref);
    });

})
