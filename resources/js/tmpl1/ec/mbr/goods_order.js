$(function () {
    $("body").on("click", ".kuaidi", function () {
        $(this).parents(".shop-order").find(".select-balance").fadeIn(200)
    });
    $("body").on("click", ".select-balance", function () {
        $(this).fadeOut(200);
        var _checked = $(this).find(":radio[name^='radio_']:checked").parent();
        var deliveryName = _checked.attr("data-inner-text");
        var id = _checked.attr("data-id");
        $(".kuaidi .js-dlv").text(deliveryName);
        $(".kuaidi .js-dlv").attr("dtp-id", id);
    });

    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });

    //发票填写
    $("[data-type='invoice']").each(function () {
        dealInvoice(this);
    });

    $("body").on("click", ".mui-input-row:not(.mui-disabled),.js-jifen:not(.mui-disabled)", function () {//绑定动态修改数据方法
        updateData(this);
    });

    $("body").on("change", "[data-type='promo'],.js-dlv", function () {//绑定动态修改数据方法
        updateData(this);
    });

    $("body").on("change", "[data-type='cashCoupon']", function () {//绑定动态修改数据方法
        updateData(this);
    });

    $("#confirm").click(function () {//确认订单
        var addrId = $(".address-info").attr("id");
        var url = curPage();
        if (addrId == null || addrId == "") {
            mui.alert("请添加收货地址！", "", function () {
                var sHref = vars.root + "/ec/mbr/user_address.html?url=" + url;
                toNewPage(sHref);
            });
        } else {
            confirmOrder();
        }
    });

    $(".address-info").click(function () {//选择地址跳转
        var url = curPage();
        var href = vars.root + "/ec/mbr/user_address.html?url=" + url;
        toNewPage(href);
    });

    setAreaName();

});

function setAreaName() {
    /*var districtId = $("#districtId").val();
    var areaJson = getAreaNameById(districtId);
    var areaName = areaJson.provinceName + " " + areaJson.cityName + " " + areaJson.districtName;
    $("#areaName").html(areaName);*/
}

/**
 * 确认订单
 */
function confirmOrder() {
    var addrId = $(".address-info").attr("id");
    var provinceId = $("#provinceId").val();
    var cityId = $("#cityId").val();
    var districtId = $("#districtId").val();
    var address = $("#address").val();
    var postcode = $("#postcode").val();
    var contact = $("#contact").val();
    var tel = $("#tel").val();
    var tel2 = $("#tel2").val();
    var key = $("#key").val();
    var usePoints = $("#ck-pt-points").prop("checked");
    var useBalance = $("#ck-pt-balance").prop("checked");
    var useCredits = $("#ck-pt-credits").prop("checked");
    var useCashCoupons = $("#ck-pt-cash-coupons").prop("checked");
    var total = $("#order-amount").text().replace('￥', '').replace(',', '');
    var data_confirm = {
        addrId: addrId,
        provinceId: provinceId,
        cityId: cityId,
        districtId: districtId,
        address: address,
        postcode: postcode,
        contact: contact,
        tel: tel,
        tel2: tel2,
        key: key,
        usePoints: usePoints,
        useBalance: useBalance,
        useCredits: useCredits,
        useCashCoupons: useCashCoupons,
        total: total
    };

    $(".shop-order").each(function () {
        var shopId = $(this).find(".shop-title").data("shop");
        var invoiceTitle = $(this).find("[data-invoice='title']").html();
        var remark = $(this).find("input[name='remark']").val();
        if (invoiceTitle) {
            data_confirm["s-invoiceTitle-" + shopId] = invoiceTitle;
        }
        if (remark) {
            data_confirm["s-remark-" + shopId] = remark;
        }
    });

    $.postForm(vars.root + "/ec/mbr/order_pay.html", data_confirm);
}

/**
 * 更新数据
 * @param obj
 */
function updateData(obj) {
    $(obj).parents(".shop-order").find(".js-dlv").html($(this).attr("data-inner-text"));
    $(obj).parents(".shop-order").find(".js-dlv").attr("dtp-id", $(this).attr("id"));
    // 准备订单调整数据
    var extraData = {};
    // 0. 缓存
    extraData.key = $("#key").val();
    extraData.items = getUrlParam("items");
    extraData.addrId = $(".address-info").attr("id");
    // 1. 店铺
    var shopData = {};
    // 1.0 发票
    $("[data-invoice='check']").each(function () {
        var shopId = parseInt($(this).closest("[data-shop]").attr("data-shop"), 10) || 0;
        if (this.checked) {
            shopData[shopId] = (shopData[shopId] || []).concat("invoiceRequired:true");
        }
    });

    // 1.1 发货方式
    $(".select-balance").each(function () {
        var shopId = $(this).attr("shop-id");
        var dlvTypeId = $(this).find(".mui-input-row:has(:radio[name^='radio_']:checked)").data("id");
        shopData[shopId] = (shopData[shopId] || []).concat("deliveryType:" + dlvTypeId);
    });
    // 1.2 优惠
    $(".mui-input-row INPUT[type=checkbox]:checked").each(function () {
        var shopId = parseInt($(this).closest("[data-shop]").attr("data-shop"), 10) || 0;
        shopData[shopId] = (shopData[shopId] || []).concat(this.name + ":true");
    });

    // 组装店铺数据
    for (var i in shopData) {
        if (shopData.hasOwnProperty(i) && /^\d+$/.test(i)) {
            var data = shopData[i];
            if (data && data.constructor == Array)
                extraData["shop:" + i] = data.join(";");
        }
    }

    // 2. 平台数据
    $(".js-jifen INPUT[type=checkbox]:checked").each(function () {
        extraData[this.name] = 1;
    });

    // 1.3 商品优惠
    $("[data-type='promo']").each(function () {
        var promoId = $(this).val();
        if (!promoId) {
            return true;
        }
        var shopId = parseInt($(this).closest("[data-shop]").attr("data-shop"), 10) || 0;
        var skuId = parseInt($(this).closest("[data-sku]").attr("data-sku"), 10) || 0;
        var launcher = $(this).find("option[value='" + promoId + "']").attr("data-launcher");

        var data = shopData[shopId],
            dataIdx = -1,
            promo;
        for (var i = 0; i < data.length - 1; i++) {
            var p = data[i];
            if (p.indexOf("promos:") == 0) {
                dataIdx = i;
                promo = p;
                break;
            }
        }

        if (dataIdx == -1) {
            dataIdx = data.length;
            promo = "promos:";
        }
        data[dataIdx] = promo + (promo.charAt(promo.length - 1) == ":" ? "" : ",") + skuId + "|" + promoId + "|" + launcher;

    });

    // 1.4 优惠券
    $("[data-type='cashCoupon']").each(function () {
        var shopId = parseInt($(this).closest("[data-shop]").attr("data-shop"), 10) || 0,
            cashCoupon = parseInt($(this).val(), 10) || 0;
        shopData[shopId] = (shopData[shopId] || []).concat("cashCoupon:" + cashCoupon);
    });

    // 组装店铺数据
    for (var i in shopData) {
        if (shopData.hasOwnProperty(i) && /^\d+$/.test(i)) {
            var data = shopData[i];
            if (data && data.constructor == Array)
                extraData["shop:" + i] = data.join(";");
        }
    }

    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doUpdateOrder.do",
        data: extraData,
        dataType: "json",
        success: function (data) {
            if (data.success) {
                var orders = data.data.ordering.preOrderings;
                for (var i = 0; i < orders.length; i++) {
                    $("#shop-amount-" + i + "").html("￥" + formatCurrency(orders[i].totalPrice) + "");
                    var deliveryFeeAmount = orders[i].deliveryFeeAmount;
                    if (deliveryFeeAmount) {
                        $("[data-type='dlvAcount']").html("&nbsp;" + deliveryFeeAmount + "元");
                    }
                }
                $("#order-amount").html("￥" + formatCurrency(data.data.ordering.totalPrice));
            }


        }
    })
}

/**
 * 发票填写
 * @param obj
 */
function dealInvoice(obj) {
    var _invoiceLabel = $(obj).find("[data-invoice='label']");
    var _invoiceCheck = $(obj).find("[data-invoice='check']");
    var _invoiceTitle = $(obj).find("[data-invoice='title']");
    _invoiceCheck.bind("click", function () {//发票抬头
        var btnArray = ['取消', '确定'];
        mui.prompt('请输入发票抬头：', "请输入发票抬头", "发票抬头", btnArray, function (e) {
            if (e.index == 0 || !e.value) {
                //没内容
                _invoiceCheck.removeAttr("checked");
                _invoiceTitle.html("");
            } else {
                //有内容
                _invoiceCheck.prop("checked", "checked");
                _invoiceTitle.html(e.value);
            }
        })
    });

}

function getUrlParam(name) { //获取url中的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}