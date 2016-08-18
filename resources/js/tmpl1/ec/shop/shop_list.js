var page = 1;
var limit = 6;
var pageSize = 6;
var endFlag = false;
var STORAGE_ID = "shop_list";

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentdown: '上拉显示更多',
            contentover: '释放立即刷新',
            contentrefresh: '正在刷新...',
            callback: pullupRefresh
        }
    }
});

/**
 * 上拉加载具体业务实现
 */
var count = 0;
function pullupRefresh() {
    serchGoodsListByProps(page);
}
if (mui.os.plus) {
    mui.plusReady(function () {
        setTimeout(function () {
            mui('#pullrefresh').pullRefresh().pullupLoading();
        }, 1000);
    });
} else {
    mui.ready(function () {
        mui('#pullrefresh').pullRefresh().pullupLoading();
        mui('#pullrefresh').on('tap', 'a', function (e) {
            if ($(this).attr("href") == "#" || $(this).attr("href") == "" || $(this).attr("href") == undefined) {
            } else {
                location.href = $(this).attr("href");
            }
        });
    });
}
$(function () {
    $('.tools-bar').on('click', '.goods-sort-btn', function () {//显示隐藏排序列表
        if ($('.goods-sort-btn').find("i.iconfont").hasClass("icon-jiantoushang")) {
            $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");
            $(this).next(".goods-sort-list").slideUp(200);
            $('.tools-cover').fadeOut(200);
        } else {
            $('.goods-sort-btn').find("i.iconfont").addClass("icon-jiantoushang");
            $(this).next(".goods-sort-list").slideDown(200);
            $('.tools-cover').fadeIn(200);
            $(".tools-sort").children("i.iconfont").addClass("icon-jiantou").removeClass("icon-jiantoushang")
            $(".sort-form").removeClass("on").slideUp(200);
        }
    });
    $(".goods-sort-list li").click(function () {//选择某排序项
        html = $(this).find("span").html();
        $('.goods-sort-btn span').html(html);
        $(this).addClass("on").siblings().removeClass("on");
        $(this).find("i").addClass("icon-duihao")
        $(this).siblings().find("i").removeClass("icon-duihao");
        $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");
        $(".goods-sort-list").slideUp(200);
        $('.tools-cover').fadeOut(200);
        //按条件排序
        serchGoodsListByProps();
        mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);
    });
    //搜索店铺西信息
    $("#search-goods-input").bind("keypress", function (event) {
        if (event.keyCode == "13") {
            serchGoodsListByProps();
        }
    });

    mui("#pullrefresh").on("tap", "a", function () {
        var href = $(this).attr("href");
        toNewPage(href);
    });

});

/*
 * 根据条件筛选店铺列表
 * */
function serchGoodsListByProps(curPage) {//通过属性查询商品列表
    if (!curPage) {
        page = 1;
        $(".mui-table-view").empty();//清空列表
        mui('#pullrefresh').pullRefresh().refresh(true);
    }
    var postData = getSearchParams();
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/shop/doSearchShopsByProps.do",
        data: postData,
        dataType: "json",
        success: function (data) {
            page++;
            //console.info(data.data.shopListData);
            setDataList(data.data.shopListData);
            var flag = false;
            if (pageSize > data.data.shopListData.rows.length) {
                flag = true;
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(flag); //参数为true代表没有更多数据了。
        }
    });
}

function setDataList(shopListData) {
    var shopList = shopListData.rows;
    //console.info(shopList);
    if (shopList == null) {
        return;
    }

    var sHtml = "";
    for (var i = 0; i < shopList.length; i++) {
        var o = shopList[i];
        //console.info(o);
        var m = o.goodsList;
        if (o == null) {
            continue;
        }
        //店铺信息回填
        sHtml += "<li>";
        //console.info(o.id);
        sHtml += " <a class='clearfix' href=" + vars.root + "/ec/shop/" + o.id + ".html>";
        sHtml += "<img src='" + buildUrl(o.logoUrl) + "' onerror='errorImg(this);'>";
        //sHtml += "<img src='../resources/img/ec/tmpl1/product_img.png'/>";
        sHtml += " <span class='shop-name fl fs-13 mui-ellipsis mui-col-xs-6'>";
        sHtml += o.name;
        sHtml += "</span>";
        sHtml += "<p class='shop-num fr fs-11 mui-ellipsis mui-col-xs-4'>共<span class='c-ff5b53'>";
        sHtml += o.stGoodsCount;
        sHtml += "</span>件商品</p>";
        sHtml += "<p class='shop-l fl fs-11 mui-ellipsis mui-col-xs-5'>信用评分：<span>";
        sHtml += o.stCredits;
        sHtml += ".00";
        sHtml += "</span></p>";
        sHtml += " <p class='fr fs-11 mui-ellipsis mui-col-xs-5'>好评率：<span>";
        sHtml += o.stComment * 100;
        sHtml += ".00";
        sHtml += "</span>%</p>";
        sHtml += "</a>";
        sHtml += "<div class='img-product clearfix'>";
        for (var j = 0; j < m.length; j++) {
            //console.info(m[j].id);
            sHtml += "<a href ='" + vars.root + "/ec/goods/" + m[j].id + ".html'>";
            sHtml += "<img src='" + buildUrl(m[j].iconUrl) + "' onerror='errorImg(this);'>";
            sHtml += "</a>";
        }
        sHtml += "</div>";
        sHtml += "<div class='major fs-13 mui-ellipsis'>主营：<span>";
        sHtml += o.product || "";
        sHtml += "</span></div>";
        sHtml += "</li>";

    }

    $(".mui-table-view").append(sHtml);
}

function getSearchParams() {
    var platform = "";
    var area = "";
    var sprop = "";
    var kw = $("#search-goods-input").val();
    var sort = $(".goods-sort-list ul li.on").attr("sort");

    var postData = {
        platform: platform,
        area: area,
        prop: sprop,
        kw: kw,
        sort: sort,
        page: page,
        items: limit
    };
    return postData;
}

function setSearchParams(postData) {
    if (!postData) {
        return;
    }
    page = postData.page;
    var sort = postData.sort;
    var kw = postData.kw;
    var prop = postData.prop;

    var _sort = $(".goods-sort-list ul li[sort='" + sort + "']");
    _sort.addClass("on").siblings().removeClass("on");
    _sort.find("i").addClass("icon-duihao")
    _sort.siblings().find("i").removeClass("icon-duihao");
    var sortView = _sort.find("span").html();
    $('.goods-sort-btn span').html(sortView);
    $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");

    $("#search-goods-input").val(kw);

    if (prop) {
        var props = prop.split(";");
        $.each(props, function (i, oStr) {
            if (!oStr) {
                return true;
            }
            var oStrArr = oStr.split(":");
            var id = oStrArr[0];
            var value = oStrArr[1];
            var valueArr = value.split(",");
        });
    }
}
