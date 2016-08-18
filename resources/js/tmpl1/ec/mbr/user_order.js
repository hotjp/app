mui.init();
var pageId = 1;
var pageCount = 1;
var self = "";
var tap_id = "";
var st = getUrlParam("status");
var domIndex = "";
var orderStatus = "";
$(function () {
    if (st == null) {
        listOrder("ds-allorder");
    } else {
        listOrder(st);
    }
    domIndex = $("#" + st).parents(".mui-slider-item").index();
    mui('.mui-bar').on('tap', 'a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        if (href == "#" || href == "" || href == "javascript:void(0)") {
        } else {
            location.href = href;
        }
    });
    (function ($) {
        mui('.mui-slider').slider().gotoItem(domIndex);
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        $('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        $.ready(function () {
            //循环初始化所有下拉刷新，上拉加载。使用mui插件非mui
            $.each(document.querySelectorAll('#ds-allorder'), function (index, pullRefreshEl) {
                $(pullRefreshEl).pullToRefresh({
                    up: {
                        contentdown: '上拉显示更多',
                        contentover: '释放立即刷新',
                        contentrefresh: '正在刷新...',
                        callback: listOrder
                    }
                });
            });
        });

    })(mui);

    mui(".order-control ul ").on("tap", "li", function () {//修复mui-slider切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());
    });

    //mui('.mui-table-view').on('tap', 'a', function(e) {//mui冲突链接
    //    href=$(this).attr("href");
    //    if(href=="#"||href==""||href=="javascript:void(0)"){}else{
    //        location.href=href;
    //    }
    //});

});

function listOrder(e) {//根据定位的Tab页加载订单信息
    //loader();
    if (e) {//第一次选中赋值
        $("#" + e + " .mui-table-view").html("");
        tap_id = e;
        self = mui("#" + e).pullToRefresh({up: {callback: listOrder}});
        pageId = 1;
        orderStatus = jQuery("#" + tap_id).attr("data-status");
    } else {//上拉加载
        self = self;
        pageId++;
    }
    if (pageId > pageCount) {

    } else {
        var status = jQuery("#" + tap_id).attr("data-status");

        var commentStatus = "";
        if (status == "40") {
            commentStatus = "0";
        }
        jQuery.ajax({
            type: "POST",
            url: vars.root + "/ec/mbr/doListOrder.do",
            data: {
                status: status,
                commentStatus: commentStatus,
                page: pageId
            },
            dataType: "json",
            success: function (data) {
                pageCount = (data.data.orders.pageCount == 0 ? 1 : data.data.orders.pageCount);
                var rowCount = data.data.orders.rowCount;
                var rows = data.data.orders;
                var ul = self.element.querySelector('.mui-table-view');
                if (orderStatus == data.data.status) {
                    ul.appendChild(createFragment(ul, 0, 10, tap_id, rows));
                    self.endPullUpToRefresh((ul.querySelectorAll('li.shop-order').length) == rowCount);
                } else {

                }
                //    removeloader();
            }
        });
    }

}
function createFragment(ul, index, count, reverse, data) {//输出格式化的html
    var length = ul.querySelectorAll('li.shop-order').length;
    var fragment = document.createDocumentFragment();
    var li;
    var orders = data.rows;
    for (var i = 0; i < orders.length; i++) {
        var skus = orders[i].skus;
        li = document.createElement('li');
        li.className = 'shop-order mui-table-view-cell';
        li.id = orders[i].id;
        li.setAttribute("data-no", orders[i].no);
        var shtml = "";
        shtml += "<div class='shop-title fs-12'>";
        if (reverse == "ds-waitpay") {
            shtml += "<div class='mui-input-row mui-checkbox mui-left'>";
            shtml += "<label>";
            shtml += "<i class='iconfont icon-dianpu c-9c4b0f'></i>&nbsp;<a href='" + vars.root + "/ec/shop/" + orders[i].shopId + ".html'>" + orders[i].shopName + "</a>";
            shtml += "<span class='mui-pull-right c-ff5b53 js-status'>新订单</span></label>";
            shtml += "<input name='checkbox' value='' type='checkbox' data-no='" + orders[i].no + "'>";
            shtml += "</div>";
        } else {
            shtml += "<i class='iconfont icon-dianpu fs-18 c-9c4b0f'></i>&nbsp;<a href='" + vars.root + "/ec/shop/" + orders[i].shopId + ".html'>" + orders[i].shopName + "</a>";
            shtml += "<span class='mui-pull-right c-ff5b53 js-status'>" + orders[i].orderStatusName + "</span>";
        }
        shtml += "</div>";
        shtml += "<ul class='goods-list'>";
        var isCommented = true;
        for (var j = 0; j < skus.length; j++) {
            shtml += "<li class='clearfix'>";
            shtml += "<a href='" + vars.root + "/ec/mbr/" + orders[i].id + ".html'><img class='fl' src='" + buildUrl(skus[j].skuIconUrl == null ? "" : skus[j].skuIconUrl) + "' onerror='errorImg(this);'/>";
            shtml += "<div class='goods-info fl'>";
            shtml += "<p class='c-333 fs-13'>" + skus[j].skuName + "</p>";
            shtml += "<p class='c-999 fs-11'>" + skus[j].skuPropTextList + "</p>";
            shtml += "</div>";
            shtml += "<div class='goods-price fr'>";
            shtml += "<p class='fs-13 c-333 mui-text-right'>" + "￥" + formatCurrency(skus[j].buyPrice) + "</p>";
            shtml += "<p class='fs-13 c-333 mui-text-right'>x" + skus[j].buyQty + "</p>";
            shtml += "</div></a>";
            shtml += "</li>";
            if (skus[j].commented == false) {
                isCommented = false;
            }
        }
        shtml += "</ul>";
        shtml += "<div class='shop-balance clearfix'>";
        shtml += "<p class='c-333 fs-12'>共<span class='goods-num'>" + skus.length + "</span>件商品 合计<span class='price fs-16'>" + "￥" + formatCurrency(orders[i].payableAmount) + "</span>（含运费<span class='freight'>" + "￥" + formatCurrency(orders[i].deliveryFeeAmount) + "</span>）</p>";
        shtml += "<div class='js-status-btn'>";
        var orderParam = {status: orders[i].orderStatus, isCommented: isCommented, payExpired: orders[i].payExpired};
        shtml += orderBtns(orderParam);
        shtml += "</div>";
        shtml += "</div>";
        li.innerHTML = shtml;
        fragment.appendChild(li);
    }

    return fragment;
}

function orderBtns(o) {//根据不同的状态输出不同的按钮
    if (!o) {
        return;
    }
    var status = o.status;
    var isCommented = o.isCommented;
    var payExpired = o.payExpired;
    var bhtml = "";
    if (status == "20") {
        //   bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>提醒发货</a>";
        //   bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>查看物流</a>";
    } else if (status == "0") {
        //   if(!payExpired){
        bhtml += "<a class='red-border-btn fs-12 fr js-pay' href='javascript:void(0)'>付款</a>";
        //   }
        bhtml += "<a class='gry-border-btn fs-12 fr js-cancel' href='javascript:void(0)'>取消订单</a>";
    } else if (status == "30") {
        bhtml += "<a class='red-border-btn fs-12 fr js-rec' href='javascript:void(0)'>确认收货</a>";
        //    bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>查看物流</a>";
    } else if (status == "40") {
        if (isCommented == true) {
            bhtml += "<a class='red-border-btn fs-12 fr' href='javascript:void(0)'>已评价</a>";
        } else {
            bhtml += "<a class='red-border-btn fs-12 fr' data-btn='comment' href='javascript:void(0)'>评价</a>";
        }
        //    bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>查看物流</a>";
        //    bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>删除订单</a>";
    } else if (status == "10") {
        //    bhtml += "<a class='gry-border-btn fs-12 fr' href='javascript:void(0)'>删除订单</a>";
    }
    return bhtml;
}


$(function () {

    document.querySelector('.mui-slider').addEventListener('slide', function (event) {//新增合并订单
        if (event.detail.slideNumber === 1) {
            listOrder("ds-waitpay");
        } else if (event.detail.slideNumber === 0) {
            listOrder("ds-allorder");
            $(".merge").hide();
        } else if (event.detail.slideNumber === 2) {
            listOrder("ds-waitsend");
            $(".merge").hide();
        } else if (event.detail.slideNumber === 3) {
            listOrder("ds-waitget");
            $(".merge").hide();
        } else if (event.detail.slideNumber === 4) {
            listOrder("ds-waitassess");
            $(".merge").hide();
        } else {

        }
    });


    $(".mui-slider-group").on("click", "input[type=checkbox]", function () {
        var bool = false;
        (function ($) {
            $("input[type=checkbox]").each(function () {
                if ($(this).prop("checked") == true) {
                    bool = true;
                }
            })
        })(jQuery);
        if (bool) {
            $(".merge").show();
            $("#waitpay .mui-scroll-wrapper").css({"bottom": "50px"});
        } else {
            $(".merge").hide();
            $("#waitpay .mui-scroll-wrapper").css({"bottom": 0});

        }

    })


    mui('body').on('tap', '.js-cancel', function (e) {//取消订单
        var orderId = $(this).parents("li").attr("id");
        var selfLi = jQuery(this).parents("li");
        /*var statu = confirm("确认取消订单?");
        if (!statu) {
            return false;
        }*/
        var btnArray = ['否', '是'];
        mui.confirm('确认取消订单?', '', btnArray, function (e) {
            if (e.index == 1) {
                jQuery.ajax({
                    type: "POST",
                    url: vars.root + "/ec/mbr/doCancelOrder.do",
                    data: {
                        orderId: orderId
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            selfLi.find(".js-status").text("已取消");
                            selfLi.find(".js-status-btn").html(orderBtns({status: "10"}));
                            var newUrl=vars.root + "/ec/mbr/user_order.html?status=ds-waitpay";
                            toNewPage(newUrl);
                        } else {

                        }
                    }
                });
            } else {
            }
        });
    });
    mui('body').on('tap', '.js-rec', function (e) {//确认收货
        var orderId = $(this).parents("li").attr("id");
        var selfLi = jQuery(this).parents("li");
        /*var statu = confirm("确认已经收到货物?");
        if (!statu) {
            return false;
        }*/
        var btnArray = ['否', '是'];
        mui.confirm('确认已经收到货物?', '', btnArray, function (e) {
            if (e.index == 1) {
                jQuery.ajax({
                    type: "POST",
                    url: vars.root + "/ec/mbr/doConfirmReceiptOfOrder.do",
                    data: {
                        id: orderId
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            selfLi.find(".js-status").text("已签收");
                            selfLi.find(".js-status-btn").html(orderBtns({status: "40"}));
                            var newUrl=vars.root + "/ec/mbr/user_order.html?status=ds-waitget";
                            toNewPage(newUrl);
                        } else {

                        }
                    }
                });
            } else {
            }
        });
    });
    mui('body').on('tap', '.js-pays', function (e) {//合并付款
        var ordersNoStr = "";
        jQuery("input:checkbox[name='checkbox']:checked").each(function () {
            var no = $(this).parents("li").attr("data-no");
            ordersNoStr += no + ",";
        })
        location.href = vars.root + "/ec/mbr/pay.html?ordersNoStr=" + ordersNoStr + "";
    });
    mui('body').on('tap', '.js-pay', function (e) {//付款
        var ordersNoStr = $(this).parents("li").attr("data-no") + ",";
        location.href = vars.root + "/ec/mbr/pay.html?ordersNoStr=" + ordersNoStr + "";
    });

    //评价
    mui('body').on('tap', '[data-btn="comment"]', function (e) {
        var id = $(this).parents("li").attr("id");
        var sHref = vars.root + "/ec/mbr/order_comment.html";
        sHref += "?orderId=" + id;
        toNewPage(sHref);
    });

    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toIndexPage();
    });

    mui('.mui-table-view').on('tap', '.goods-list li a,.shop-title a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        toNewPage(href);
    });
})
function getUrlParam(name) {//获取url参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}