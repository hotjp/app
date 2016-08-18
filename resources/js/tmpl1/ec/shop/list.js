/**
 * 上拉加载具体业务实现
 */
var page = 1;
var limit = 6;
var STORAGE_ID = "shopGoodsList";
var endFlag = false;

if (mui.os.plus) {
    mui.plusReady(function () {
        setTimeout(function () {
            mui('#pullrefresh').pullRefresh().pullupLoading();
        }, 10);
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
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            up: {
                contentdown: '上拉显示更多',
                contentover: '释放立即刷新',
                contentrefresh: '正在刷新...',
                callback: pullrefresh
            },
            down : {
                contentdown : "下拉可以刷新",
                contentover : "释放立即刷新",
                contentrefresh : "正在刷新...",
                callback :pullDownFunc
            }
        }
    });

    mui('.mui-table-view').on('tap', 'a', function (e) {//mui冲突链接
        var sHref = $(this).attr("href");
        setSessionStorage();
        toNewPage(sHref);
    });

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
    });
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
    $(".tools-sort,.send-form").click(function () {//展开收缩筛选
        if ($(".sort-form").hasClass("on")) {
            $(".tools-sort").children("i.iconfont").addClass("icon-jiantou").removeClass("icon-jiantoushang")
            $(".sort-form").removeClass("on").slideUp(200);
        } else {
            $(this).children("i.iconfont").addClass("icon-jiantoushang").removeClass("icon-jiantou");
            $(".sort-form").addClass("on").slideDown(200);
            $('.tools-cover').fadeOut(200);
            $(".goods-sort-list").slideUp(200);
            $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");
        }
    });
    $(".form-block-btn").click(function () {//展开收缩多选项
        if ($(this).parent().find(".middle-block").hasClass("on")) {
            $(this).addClass("icon-xia").removeClass("icon-shang");
            $(this).parent().find(".middle-block").css({"height": "2.117rem"});
            $(this).parent().find(".middle-block").removeClass("on");
        } else {
            $(this).addClass("icon-shang").removeClass("icon-xia");
            $(this).parent().find(".middle-block").css({"height": "auto"});
            $(this).parent().find(".middle-block").addClass("on");
        }
    });
    $(".back-to-top").click(function () {//返回顶部
        $("body,html").animate({"scrollTop": "0"});
    });
    mt = 150;
    $(document).scroll(function () {//距离顶部mt显示按钮
        $top = $(window).scrollTop();
        if ($top > mt) {
            $(".back-to-top").fadeIn(500);
        } else {
            $(".back-to-top").fadeOut(300);
        }
    });


    /*
     * zh begin
     * */
    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });


    $(".goods-sort-list li").click(function () {//选择某排序项
        serchGoodsListByProps();
        mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);
    });

    $("#search-goods-input").bind("keypress", function (event) {
        if (event.keyCode == "13") {
            serchGoodsListByProps();
        }
    });

    /*
     * zh end
     * */
});

function pullrefresh() {
    if (!useSessionStorage()) {
        serchGoodsListByProps(page);
    }
}

function serchGoodsListByPropsForPullDown(curPage) {//通过属性查询商品列表
    removetSessionStorageItem(STORAGE_ID);
    page=curPage;
    $(".mui-table-view").empty();//清空列表

    var postData = getSearchParams();

    $.ajax({
        type: "POST",
        url: vars.root + "/ec/shop/doSearchGoodsByProps.do",
        data: postData,
        dataType: "json",
        success: function (data) {
            endFlag = ++data.data.goodsListData.pageId > data.data.goodsListData.pageCount;
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            setDataList(data.data.goodsListData);
        }
    });
}
function pullDownFunc() {
    if (!useSessionStorage()) {
        serchGoodsListByPropsForPullDown(1);
    }
}
/*
 * 根据条件筛选产品列表
 * */
function serchGoodsListByProps(curPage) {//通过属性查询商品列表
    removetSessionStorageItem(STORAGE_ID);
    if (!curPage) {
        page = 1;
        $(".mui-table-view").empty();//清空列表
        mui('#pullrefresh').pullRefresh().refresh(true);
    }

    var postData = getSearchParams();

    $.ajax({
        type: "POST",
        url: vars.root + "/ec/shop/doSearchGoodsByProps.do",
        data: postData,
        dataType: "json",
        success: function (data) {
            page++;
            endFlag = ++data.data.goodsListData.pageId > data.data.goodsListData.pageCount;
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(endFlag); //参数为true代表没有更多数据了。
            setDataList(data.data.goodsListData);
        }
    });
}

function setDataList(goodsListData) {
    var goodsList = goodsListData.rows;
    if (goodsList == null) {
        return;
    }
    var table = document.body.querySelector('.mui-table-view');

    for (var i = 0; i < goodsList.length; i++) {
        var o = goodsList[i];
        if (o == null) {
            continue;
        }
        var simplePromoLabel = o.simplePromoLabel;
        var promoView = "";
        if (simplePromoLabel) {
            promoView = "<span class='act-style1'><i class='act-left-icon'>" + simplePromoLabel + "</i></span>";
        }
        var li = document.createElement('li');
        li.className = '';
        li.innerHTML = "<a class='clearfix' href=" + vars.root + "/ec/goods/" + o.id + ".html>" +
        "<img src='" + buildUrl(o.iconUrl) + ".400x400.jpg' onerror='errorImg(this);'/>" +
        "<div class='goods-info'>" +
        "<span class='goods-tit fs-13'>" + promoView +
        "" + o.name + "" +
        "</span>" +
        "<span class='sale-price fs-15 c-ff5b53'>" +
        formatCurrency(o.minPrice, o.buyType) + "" +
        "</span>" +
            /* "<span class='old-price fs-11'>" +
             "" + formatCurrency(goodsList[i].minPrice) + "" +
             "</span>" +*/
        "</div>" +
        "</a>";
        table.appendChild(li);
    }

}


function getSearchParams() {
    var shopId = $("#shopId").val();

    var cat = $("#cat").val();
    var sprop = "";
    var brand = "";
    var kw = $("#search-goods-input").val();
    var sort = $(".goods-sort-list ul li.on").attr("sort");

    var postData = {
        id: shopId,
        cat: cat,
        prop: sprop,
        brand: brand,
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

    var _sort = $(".goods-sort-list ul li[sort='" + sort + "']");
    _sort.addClass("on").siblings().removeClass("on");
    _sort.find("i").addClass("icon-duihao")
    _sort.siblings().find("i").removeClass("icon-duihao");
    var sortView = _sort.find("span").html();
    $('.goods-sort-btn span').html(sortView);
    $('.goods-sort-btn').find("i.iconfont").removeClass("icon-jiantoushang");

    $("#search-goods-input").val(kw);

}

function useSessionStorage() {
    var result = false;
    var goodsList = getSessionStorageItem(STORAGE_ID);
    if (!goodsList || page != 1) {
        return result;
    }
    try {
        var muiPull = mui('#pullrefresh');

        $(".mui-table-view").empty();//清空列表
        muiPull.pullRefresh().refresh(true);

        var goodsListJson = JSON.parse(goodsList);
        $(".mui-table-view").html(goodsListJson.list);

        endFlag = goodsListJson.endFlag;
        muiPull.pullRefresh().endPullupToRefresh(endFlag); //参数为true代表没有更多数据了。

        //var transform = goodsListJson.muiParam.transform;
        //var transformArr = transform.split(",");
        //var height = transformArr[transformArr.length - 1];
        //height = parseInt(height);
        //muiPull.scroll().scrollTo(0, height);

        var postData = goodsListJson.postData;
        setSearchParams(postData);
        result = true;
    } catch (ex) {
    }
    return result;
}

function setSessionStorage() {
    var listView = $(".mui-table-view").html();
    var muiParam = {transform: jQuery("#pullrefresh .mui-scroll").css("transform")};
    var goodsList = {
        "list": listView,
        "endFlag": endFlag,
        "postData": getSearchParams(),
        "muiParam": muiParam
    };
    setSessionStorageItem(STORAGE_ID, JSON.stringify(goodsList));
}
