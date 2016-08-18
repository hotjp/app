mui.init();
var tap_id = "";
var pageId = ""
$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    mui('body').on('tap', ".mui-pull-right", function () {//返回用户中心
        toUserPage();
    });
    listCollect("data-goods");
    document.querySelector('.mui-slider').addEventListener('slide', function (event) {
        if (event.detail.slideNumber === 0) {
            listCollect("data-goods");
        } else {
            listCollect("data-shop");
        }
    });

    mui('.collect-content').on('tap', '.cancel-collect', function (e) {//删除收藏
        var btnArray = ['否', '是'];
        var type = $(this).parents(".mui-scroll").attr("id");
        var id = $(this).parents("li").attr("id");
        mui.confirm('将从收藏中删除，确定么？', '', btnArray, function (e) {
            if (e.index == 1) {
                if (type == "data-goods") {
                    $.ajax({
                        type: "POST",
                        url: vars.root + "/ec/mbr/doRemoveGoodsFromFav.do",
                        data: {
                            id: id
                        },
                        dataType: "json",
                        success: function (data) {
                            $("li[id='"+id+"']").remove();
                        }
                    })
                } else {
                    $.ajax({
                        type: "POST",
                        url: vars.root + "/ec/mbr/doRemoveShopFromFav.do",
                        data: {
                            id: id
                        },
                        dataType: "json",
                        success: function (data) {
                            $("li[id='"+id+"']").remove();
                        }
                    })
                }
            }
        })
    });
    mui('.collect-content').on('tap', 'a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        if (href == "#" || href == "" || href == "javascript:void(0)") {
        } else {
            location.href = href;
        }
    });
});


$(function () {
    (function ($) {
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        $('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        /*$.ready(function() {
         //循环初始化所有下拉刷新，上拉加载。使用mui插件非mui
         $.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
         $(pullRefreshEl).pullToRefresh({
         up: {
         contentdown: '上拉显示更多',
         contentover: '释放立即刷新',
         contentrefresh: '正在刷新...',
         callback: listCollect
         }

         });
         });
         });*/
    })(mui);

    mui(".collect-control ul").on("tap", "li", function () {//修复mui-slider切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());
    });
});

function listCollect(e) {//加载商品or店铺收藏列表
    if (e) {//第一次选中赋值
        $("#" + e + " .mui-table-view ul").html("");
        tap_id = e;
        self = mui("#" + e).pullToRefresh();
    } else {//上拉加载
        self = self;
    }

    var type = jQuery("#" + tap_id).attr("data-type");
    jQuery.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doLoadFavList.do",
        data: {
            type: type
        },
        dataType: "json",
        success: function (data) {
            var rows = data.data;
            if (type == "goods") {
                var ul = self.element.querySelector('.js-goods');
                ul.appendChild(createFragment(ul, 0, 50, tap_id, rows));
            } else {
                var ul = self.element.querySelector('.js-shop');
                ul.appendChild(createFragment(ul, 0, 50, tap_id, rows));
            }

        }
    });


}

function createFragment(ul, index, count, reverse, data) {
    var length = ul.querySelectorAll('li').length;
    var fragment = document.createDocumentFragment();
    var li;
    for (var i = 0; i < data.length; i++) {
        li = document.createElement('li');
        li.id = data[i].id;
        var shtml = "";
        if (reverse == "data-goods") {
            shtml += "<a href ='" + vars.root + "/ec/goods/" + data[i].id + ".html'>";
            shtml += "<img class='fl' src='" + buildUrl(data[i].iconUrl) + "' onerror='errorImg(this);'/>";
            shtml += "</a>";
            shtml += "<div class='goods-infos fl'>";
            shtml += "<a class='fs-13' href='" + vars.root + "/ec/goods/" + data[i].id + ".html'>" + data[i].name + "</a>";
            shtml += "<p class='price fs-15 blod'>" + formatCurrency(data[i].minPrice,data[i].buyType) + "</p>";
            shtml += "<div class='info-bottom fs-11'>";
            shtml += "<a href='" + vars.root + "/ec/shop/" + data[i].shopId + ".html'>";
            shtml += "<i class='iconfont icon-dianpu c-9c4b0f'></i>" + data[i].shopName + "";
            shtml += "</a>";
            shtml += "<div class='cancel-collect fs-10'>";
            shtml += "<i class='iconfont icon-xing mui-block fs-20'></i>取消收藏";
            shtml += "</div>";
            shtml += "</div>";
            shtml += "</div>";
        } else {
            shtml += "<a href='" + vars.root + "/ec/shop/" + data[i].id + ".html'>";
            shtml += "<img class='fl' src='" + buildUrl(data[i].logoUrl) + "'  onerror='errorImg(this);'/>";
            shtml += "</a>";
            shtml += "<div class='shop-infos fl'>";
            shtml += "<a href='" + vars.root + "/ec/shop/" + data[i].id + ".html'>";
            shtml += "<p class='fs-13'>&nbsp;" + data[i].name + "</p>";
            shtml += "</a>";
            // shtml += "<span class='fs-11'>促销(9)</span>";
            // shtml += "<span class='fs-11'>上新(9)</span>";
            shtml += "</div>";
            shtml += "</a>";
            shtml += "<div class='cancel-collect fs-10'>";
            shtml += "<i class='iconfont icon-xing mui-block fs-20'></i>取消收藏";
            shtml += "</div>";
        }

        li.innerHTML = shtml;
        fragment.appendChild(li);
    }
    return fragment;
}