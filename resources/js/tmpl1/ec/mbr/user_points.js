$(function(){
    mui('body').on('tap',".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    mui('body').on('tap',".mui-pull-right", function () {//返回用户中心
        toUserPage();
    });
})
var page = {all: 1, add: 1, slow: 1};
var pageSize = 10;
$(function () {
    mui.init();
    //阻尼系数
    var deceleration = mui.os.ios ? 0.003 : 0.0009;
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: deceleration
    });
    mui.ready(function () {
        //循环初始化所有下拉刷新，上拉加载。使用mui插件非mui
        $('.mui-slider-group .mui-scroll').each(function (i, o) {
            var id = $(this).attr("id");
            mui("#" + id).pullToRefresh({
                up: {
                    callback: function () {
                        loader();
                        var self = this;
                        setTimeout(function () {
                            var flag = listData();
                            self.endPullUpToRefresh(flag);
                        }, 100);
                    }
                }
            });
        });
        //用于第一次打开就加载数据
        listData("all");
        listData("add");
        listData("slow");

    });

    mui(".cerdit-control ul").on("tap", "li", function () {//修复mui-slider切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());
    });

});


function listData(curType) {//根据定位的Tab页加载积分详细信息
    var flag = false;

    var type = curType;
    if (!curType) {
        type = $(".cerdit-slider .cerdit-control ul li.mui-active").data("type");
    }
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doSearchPoints.do",
        data: {
            type: type,
            async: false,
            page: page[type],
            pageSize: pageSize
        },
        async: false,
        dataType: "json",
        success: function (data) {
            page[type]++;
            setDataList(data.data.memberPoints, type);
            if (pageSize > data.data.memberPoints.rows.length) {
                flag = true;
            }
            removeloader();
        }
    });
    return flag;
}

function setDataList(memberPointsData, curType) {
    var type = curType;
    if (!curType) {
        type = $(".cerdit-slider .cerdit-control ul li.mui-active").data("type");
    }
    var points = memberPointsData.rows;
    if (points == null) {
        return;
    }
    var sHtml = "";
    for (var i = 0; i < points.length; i++) {
        var o = points[i];
        var color = "subtract";
        var point = o.points;
        if (o == null) {
            continue;
        }
        //判断积分颜色（正数为红色，负数为绿色）
        if (point > 0) {
            color = "plus";
            point = "+" + point;
        }
        sHtml += "<li class='fs-13'>";
       /* switch (o.operation) {
            case "MemberRegister":
                o.operation = "会员";
                break;
            case "OrderCreate":
                o.operation = "订单";
                break;
            case "Refund":
                o.operation = "退款";
                break;
            case "Manual":
                o.operation = "手动调整";
                break;
            default:
                o.operation = "其它";
                break;
        }*/
        sHtml += "<p class='el fs-13'>";
        sHtml += o.operationRemark ||"";
        sHtml += "</p>";
        sHtml += "<p class='fs-11'>" + o.time + "</p>";
        sHtml += "<span class='" + color + " fs-23'>" + point + "</span>";
        sHtml += "</li>";

    }
    $("#" + type + " .mui-table-view").append(sHtml);
}


