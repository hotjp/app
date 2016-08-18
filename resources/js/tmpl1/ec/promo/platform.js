var curTime;
var startTime;
var endTime;
var intervalId;
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            callback: pullupRefresh
        }
    }
});

function pullupRefresh() {
    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
}
function setPromoTime() {
    getCurTime(function(sCurTime){
        var sStartTime = $("#startTime").val();
        var sEndTime = $("#endTime").val();

        curTime = getDateByStr(sCurTime).getTime();
        startTime = getDateByStr(sStartTime).getTime();
        endTime = getDateByStr(sEndTime).getTime();

        setIntervalTime();
        intervalId = setInterval(setIntervalTime, 1000);
    });//yyyy-MM-dd HH:mm:ss
}


function setIntervalTime() {
    curTime = curTime + 1000;
    var t = curTime - startTime;
    if (t < 0) {//距活动开始
        $("#pTitle").html("距活动开始");
    } else {
        t = endTime - curTime;
        if (t > 0) {//距活动结束
            $("#pTitle").html("距活动结束");
        } else {//活动已结束
            $("#pTitle").html("活动已结束");
            t = 0;
            clearInterval(intervalId);
        }
    }
    if (t < 0) {
        t = -t;
    }
    var o1 = parseTime(t);
    $("#pDay").text(o1.d);
    $("#pHour").text(o1.h);
    $("#pMin").text(o1.m);
    $("#pSec").text(o1.s);
    if(o1.d == 0){
        $("#pDay,#pDayTitle").remove();
    }
}
$(function () {
    $(".change-view").click(function () {//改变排版
        if ($(".good-lists-list").hasClass("change-view-new")) {
            $(this).children("i.iconfont").addClass("icon-liebiao").removeClass("icon-fenleifull");
            $(".good-lists-list").removeClass("change-view-new");
            $('.tools-cover').fadeOut(200);
            $(".goods-sort-list").slideUp(200);
            $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");
            $(".tools-sort").children("i.iconfont").addClass("icon-jiantou").removeClass("icon-jiantoushang")
            $(".sort-form").removeClass("on").slideUp(200);
        } else {
            $(this).children("i.iconfont").addClass("icon-fenleifull").removeClass("icon-liebiao");
            $(".good-lists-list").addClass("change-view-new");
            $('.tools-cover').fadeOut(200);
            $(".goods-sort-list").slideUp(200);
            $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");
            $(".tools-sort").children("i.iconfont").addClass("icon-jiantou").removeClass("icon-jiantoushang")
            $(".sort-form").removeClass("on").slideUp(200);
        }
    });

    mui('.mui-table-view').on('tap', 'a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        toNewPage(href);
    });

    setPromoTime();
});



