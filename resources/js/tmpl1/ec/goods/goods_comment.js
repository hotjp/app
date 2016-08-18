var page = {all: 1, high: 1, medium: 1, low: 1, img: 1};
var pageSize = 5;
$(function () {
    /**
     * 星级评价
     */
    /*$(function () {
        $(".comment-stars").html(function () {
            htm = '';
            starnum = $(this).attr("data-starnum");
            xing = '<i class="iconfont icon-xing"></i>';
            banxing = '<i class="iconfont icon-banxing"></i>';
            kongxing = '<i class="iconfont icon-kongxing"></i>';
            for (i = 0; i < 5; i++) {
                if (i < starnum) {
                    if (starnum - i < 1) {
                        htm = htm + banxing;
                    } else {
                        htm = htm + xing;
                    }
                } else {
                    htm = htm + kongxing;
                }
            }
            return htm;
        });
    });*/
    //mui初始化
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
                        loader();//系统自带的效果（圆圈加载）
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
        listData("high");
        listData("medium");
        listData("low");
        listData("img");
    });
    //修复mui-slider切换页面
    mui(".comment-title ul").on("tap", "li", function () {
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());

    });

    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });

    $(".mui-pull-right").click(function () {//
        toIndexPage();
    });
});


function listData(curType) {//根据定位的Tab页加载积分详细信息
    var flag = false;

    var type = curType;
    if (!curType) {
        type = $(".goods-comment-content .comment-title ul li.mui-active").data("type");
    }

    $.ajax({
        type: "POST",
        url: vars.root + "/ec/goods/doSearchComments.do",
        data: {
            goodsId: $("#goodsId").val(),
            type: type,
            async: false,
            page: page[type],
            pageSize: pageSize
        },
        async: false,
        dataType: "json",
        success: function (data) {
            page[type]++;
            setDataList(data.data.commentPagedList, type);
            if (pageSize > data.data.commentPagedList.rows.length) {
                flag = true;
            }
            removeloader();
            $(".comment-stars").html(function () {
                htm = '';
                starnum = $(this).attr("data-starnum");
                xing = '<i class="iconfont icon-xing"></i>';
                banxing = '<i class="iconfont icon-banxing"></i>';
                kongxing = '<i class="iconfont icon-kongxing"></i>';
                for (i = 0; i < 5; i++) {
                    if (i < starnum) {
                        if (starnum - i < 1) {
                            htm = htm + banxing;
                        } else {
                            htm = htm + xing;
                        }
                    } else {
                        htm = htm + kongxing;
                    }
                }
                return htm;
            });
        }
    });
    return flag;
}

function setDataList(commentsData, curType) {
    var type = curType;
    if (!curType) {
        type = $(".goods-comment-content .comment-title ul li.mui-active").data("type");
    }
    var comments = commentsData.rows;
    if (comments == null) {
        return;
    }
    //评价数量
    var rowCount = commentsData.rowCount;
    $("[data-type='" + type + "'] span").html(rowCount);

    if (type == "all") {
        $("#header h1 i").html(rowCount);
    }

    var sHtml = "";
    for (var i = 0; i < comments.length; i++) {
        var o = comments[i];

        if (o == null) {
            continue;
        }
        //获得评价星级数量
        var xingCount = o.rank;

        //获得图片的URL
        var pic = o.picUrls;

        sHtml += "<li>";
        sHtml += " <div class='comment-user'>";
        sHtml += "<img class='comment-user-img' src='"+buildUrl(o.headUrl)+"' onerror='errorImg(this);'/>";
        sHtml += "<span class='comment-user-name fs-13 c-333'>"
        sHtml += o.mbrNickName;
        sHtml += "<div class='comment-stars' data-starnum='" + xingCount + "'></div>";
        sHtml += " <div class='comment-text fs-13 c-777'>";
        sHtml += o.content || "";
        sHtml += " </div>";
        sHtml += " <div class='comment-img'>";
        //评价的图片信息
        for (var j = 0; j < pic.length; j++) {
            var picUrl = pic[j];
            sHtml += "<img src='" + buildUrl(picUrl) + "' onerror='errorImg(this);'/>&nbsp;";
        }
        sHtml += "</div>";
        sHtml += " <div class='comment-moreinfo fs-11 c-999'>";
        sHtml += "<span>";
        sHtml += o.date;
        sHtml += "</span>";
        sHtml += "<span>";
        sHtml += "颜色分类:" + o.skuPropTextList;
        sHtml += "</div>";
        sHtml += "</li>";

    }
    $("#" + type + " .mui-table-view").append(sHtml);
}


