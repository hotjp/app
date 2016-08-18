var Skus = null;
var Goods = null;
var skuId = null;
var stockQuantity = 0;

var props = "";
mui.plusReady(function () {
    mui.init();
    var slider = mui("#slider");
});
function removeclass() {
    $(".animated").removeClass("wobble");
}
$(function () {
    removeclass();
    $(".collcet").click(function () {//加入收藏动画
        setTimeout(removeclass, 800);
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").find("i").addClass("animated wobble");
            setTimeout(removeclass, 800);

        } else {
            //   $(this).addClass("on").find("i").addClass("animated wobble");
            setTimeout(removeclass, 800);
        }
    });
    $(".comment-stars").html(function () {//评价星级
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
    $("#intro .index-block-tit span.title").click(function () {//详情切换
        index = $(this).index();
        $(this).addClass("on").siblings("span").removeClass("on");
        $(".intro-content .content").eq(index).addClass("mui-block").siblings(".content").removeClass("mui-block");
    });
    mui('.index-block').on('tap', '.show-goods-sort', function (e) {//属性菜单弹出
        $(".goods-sort-cover").fadeIn();
        $(".goods-sort").animate({"bottom": 0}, 200);
    });
    mui('.goods-sort').on('tap', '.close-goods-sort', function (e) {//属性菜单收缩
        $(".goods-sort-cover").fadeOut();
        $(".goods-sort").animate({"bottom": "-100%"});
    });
    mui('.bottom-nav,#header,.shop-info,#shop,#promoList').on('tap', 'a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        toNewPage(href);
    });
    //$(".goods-sort-content dd>span").click(function () {
    //    $(this).addClass("on").siblings("span").removeClass("on");
    //});
    mui("body").on("tap", ".goods-sort-content dd>span", function () {
        $(this).addClass("on").siblings("span").removeClass("on");
    });

    mt = 250
    $(document).scroll(function () {//距离顶部mt显示按钮
        $top = $(window).scrollTop()
        if ($top > mt) {
            $("#header").css({
                'background-color': 'rgba(0,0,0,0.8)'
            });
        } else {
            $("#header").css({
                'background-color': 'rgba(0,0,0,0.3)'
            });
        }
    });

    /*
     * zh begin
     * */
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    setCartCount();
    var goodsId = $("#goodsId").val();

    findGoodsSorts(goodsId);

    $("body").on("tap", ".collcet,#addCollect", function () {//加入收藏
        checkLogin(function(result){
            if (result.success == false) {
                location.href = result.url;
                return false;
            }
            //if ($(this).hasClass("on")) {
            //    $.ajax({
            //        type: "POST",
            //        url: vars.root + "/ec/mbr/doRemoveGoodsFromFav.do",
            //        data: {
            //            id: goodsId
            //        },
            //        dataType: "json",
            //        success: function (data) {
            //        }
            //    })
            //} else {
            loader();
            $.ajax({
                type: "POST",
                url: vars.root + "/ec/mbr/doAddGoodsToFav.do",
                data: {
                    id: goodsId
                },
                dataType: "json",
                success: function (data) {
                    removeloader();
                    if (data.data == true) {
                        mui.alert("收藏成功");
                    } else {
                        mui.alert("您已收藏该商品");
                    }
                }
            })
        });

        //}

    });

    mui("body").on("tap", ".goods-sort-content dd>span", function () {//商品属性点击选择
        valueIds = new Array();
        var sortCheckView = "";
        $("#goods-sort-content dd>span").each(function () {
            if ($(this).hasClass("on")) {
                var valueId = $(this).attr("id").split("-")[1];
                valueIds.push(valueId);
                sortCheckView += "“" + $(this).text() + "” ";
            }
        });
        switchSku(valueIds.toString());
        if (sortCheckView != "") {
            $(".show-goods-sort .title").html("已选：" + sortCheckView);
        }
    });

    $("#good-details img").each(function () {//详情图放大
        $(this).attr({"data-preview-src": "", "data-preview-group": 1})
    })
    mui.previewImage();

    function sortShow() {//弹窗显示
        $(".goods-sort-cover").fadeIn();
        $(".goods-sort").animate({"bottom": 0}, 200)
    }

    function sortHidden() {//弹窗显示
        $(".goods-sort-cover").fadeOut();
        $(".goods-sort").animate({"bottom": "-100%"})
    }

    function checkSort(e,judge) {//检查是否选中sku属性
        checkLogin(function(result){
            if (result.success == false) {
                location.href = result.url;
                judge(false);
                return false;
            }
            var msg = new Array();
            $("#goods-sort-content dl").each(function () {
                if ($(this).find("span").hasClass("on")) {
                } else {
                    msg.push($(this).find("dt").text());
                }
            });

            if (msg.length < 1) {
                try{
                    judge(true);
                }catch(e){
                    alert(e.message);
                }
                return true;
            } else {
                if (e == 0) {
                    mui.alert("请选择" + msg);
                }
                sortShow();
                judge(false);
                return false;
            }
        });

    }

    mui('body').on('tap', '#buyNowT', function (e) {
        checkSort(0,function(ck){
            if (ck) {
                buyNow();
            }
        });
    });

    mui('body').on('tap', '#buyNowF', function (e) {
        checkSort(1,function(ck){
            if (ck) {
                sortShow();
            }
        });
    });
    mui('body').on('tap', '#addCartT', function (e) {
        checkSort(0,function(ck){
            if (ck) {
                addToCart();
            }
        });
    });
    mui('body').on('tap', '#addCartF', function (e) {
        checkSort(1,function(ck){
            if (ck) {
                sortShow();
            }
        });
    });

    mui('body').on('tap', '#btn_index', function (e) {
        toIndexPage();
    });

    function addToCart() {//添加到购物车
        var qty = $("#buy-qty").val();
        if (stockQuantity == 0 || qty > stockQuantity || props == "") {
            mui.alert("商品数量不足");
        } else {
            loader();
            $.ajax({
                type: "POST",
                url: vars.root + "/ec/mbr/doAddToCart.do",
                data: {
                    goodsId: goodsId,
                    skuIdsList: skuId,
                    qty: qty
                },
                dataType: "json",
                success: function (data) {
                    removeloader();
                    if (data.data.success == false) {
                        mui.alert(data.data.errorMessage);
                    } else {
                        mui.alert("添加购物车成功！");
                        sortHidden();
                        setCartCount();
                    }
                }
            })
        }

    }

    function buyNow() {//立即购买
        var qty = $("#buy-qty").val();
        if (stockQuantity == 0 || qty > stockQuantity || props == "") {
            mui.alert("商品数量不足");
        } else {
            //loader();
            //var isGroupBuy = $("#isGroupBuy").val();
            //var isSeckill = $("#isSeckill").val();
            //if (isGroupBuy == "true" || isSeckill == "true") {
            var sHref = vars.root + "/ec/mbr/goods_order.html?skus=" + skuId + ":" + qty;
            toNewPage(sHref);
            //} else {
            //    $.ajax({
            //        type: "POST",
            //        url: vars.root + "/ec/mbr/doAddToCart.do",
            //        data: {
            //            goodsId: goodsId,
            //            skuIdsList: skuId,
            //            qty: qty,
            //            makeOrder: true
            //        },
            //        dataType: "json",
            //        success: function (data) {
            //            removeloader();
            //            if (data.success == false) {
            //                mui.alert(data.errorMessage);
            //            } else if (data.data.success == false) {
            //                mui.alert(data.data.errorMessage);
            //            } else {
            //                location.href = vars.root + data.data.redirect;
            //            }
            //        }
            //    })
            //
            //
            //}

        }
    }


    function findGoodsSorts(goodsId) {//查询商品属性详情
        $.ajax({
            type: "POST",
            url: vars.root + "/ec/goods/doFindGoodsSorts.do",
            data: {
                goodsId: goodsId
            },
            dataType: "json",
            success: function (data) {
                if (data.success && data.data.skus.length > 0) {
                    //清空列表
                    props = data.data.props;
                    var skus = data.data.skus;
                    var goods = data.data.goods;
                    var html_sort = "";                 //商品分类信息
                    Skus = skus;
                    var minPrice = goods.minPrice;
                    var maxPrice = goods.maxPrice;
                    var stockQty = goods.stockQty;
                    $(".goods-more .goods-num i").html(stockQty);
                    $("#goods-info-sq").text("库存" + stockQty + "件");
                    if (minPrice) {
                        $("#sale-price").html("￥" + formatCurrency(minPrice));
                        if (maxPrice && minPrice != maxPrice) {
                            $("#sale-price").append("-" + formatCurrency(maxPrice));
                        }
                    }
                    $("#sale-price").show();
                    if (skus[0] && skus[0].iconUrl) {
                        $("#goods-info-img").attr("src", buildUrl(skus[0].iconUrl));
                    }
                    for (var key in props) {
                        html_sort = html_sort + "<dl>" +
                        "<dt class='fs-13' id='dt-" + props[key].id + "'>" + props[key].name + "</dt>" +
                        "<dd>";
                        var psv = props[key].values;
                        for (var i in psv) {
                            if (isExist(psv[i].id, skus)) {
                                html_sort = html_sort + "<span id='sp-" + psv[i].id + "'>" + psv[i].value + "</span>";
                            }
                        }
                        html_sort = html_sort + "</dd></dl>";
                    }
                    $("#goods-sort-content").append(html_sort);

                    setPromos(data.data.promos);
                    setStatistics(data.data.statistics);

                    $("[data-type='exSort'] dl").each(function (i, o) {
                        mui.trigger($(this).find("dd span:first")[0], 'tap');
                    });

                } else {
                    mui.alert("商品库存不足");
                }

            }
        });

    }

    function setPromos(promos) {
        if (!promos) {
            return;
        }
        $.each(promos, function (i, o) {
            var id = o.id;
            var name = o.name;
            var sHtml = "";
            var promoUrl = "";
            if (o.shopId) {
                //    promoUrl = vars.root + "/ec/promo/shop/" + id + ".html";
            } else {
                promoUrl = vars.root + "/ec/promo/" + id + ".html";
            }
            sHtml += "<li class='mui-table-view-cell act-style1'>";
            sHtml += "<a class='mui-navigate-right fs-13' href='" + promoUrl + "'>";
            sHtml += "<i class='act-left-icon'>" + getPromoName(o.type, o.seckill) + "</i>";
            sHtml += "<span>" + name + "</span>";
            sHtml += "</a>";
            sHtml += "</li>";
            $("#promoList").append(sHtml);

        });

    }

    function isExist(id, skus) {
        var result = false;
        $.each(skus, function (i, o) {
            var propValueIds = o.propValueIds;
            if ($.inArray(id, propValueIds) > -1) {
                result = true;
                return true;
            }
        });
        return result;
    }

    function resetMaxNum(MaxNum) {
        var numbox = mui(".mui-numbox").numbox();
        if (numbox) {
            numbox.setOption("max", MaxNum);
            if (MaxNum <= 0) {
                numbox.setOption("min", MaxNum);
                jQuery(".mui-numbox .mui-input-numbox").val(MaxNum)
            } else if (MaxNum <= jQuery(".mui-numbox .mui-input-numbox").val()) {
                jQuery(".mui-numbox .mui-input-numbox").val(MaxNum);
                numbox.setOption("min", 1);
            } else {
                numbox.setOption("min", 1);
                jQuery(".mui-numbox button").removeAttr("disabled");
                if (jQuery(".mui-numbox .mui-input-numbox").val() == 0) {
                    jQuery(".mui-numbox .mui-input-numbox").val(1);
                }
            }
        }
    }

    function switchSku(valueIds) { //匹配相应商品sku属性并替换
        $.each(Skus, function () {//循环对比sku属性列表
            if (this.propValueIds.sort().toString() == valueIds.split(",").sort()) {
                $("#goods-info-img").attr("src", buildUrl(this.iconUrl));
                $("#goods-info-price").text("￥" + formatCurrency(this.price));
                $("#goods-info-sq").text("库存" + this.stockQuantity + "件");
                stockQuantity = this.stockQuantity;
                skuId = this.id;
                return false;
            } else {
                $("#goods-info-img").attr("src", buildUrl(this.iconUrl));
                $("#goods-info-price").text("￥" + formatCurrency(0));
                $("#goods-info-sq").text("库存" + 0 + "件");
                skuId = "";
                return true;
            }
        });
        resetMaxNum(stockQuantity);
    }

    function setCartCount() {//设置购物车数量
        $.ajax({
            type: "POST",
            url: vars.root + "/ec/user/doSelCartSize.do",
            data: {},
            dataType: "json",
            success: function (data) {
                if (data.data.cartSize == null) {

                } else {
                    var html = "<span class='mui-badge fs-10'>" + data.data.cartSize + "</span>"
                    if(data.data.cartSize>0){
                        $(".mui-pull-right").append(html);
                    }
                }
            }
        });
    }

});

function setStatistics(statistics) {
    if (!statistics) {
        return;
    }
    var monthDealCnt = statistics.monthDealCnt;
    $(".goods-sale-num i").html(monthDealCnt);

}
