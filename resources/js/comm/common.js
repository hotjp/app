// 原生交互混合APP
// 
var connectWebViewJavascriptBridge= function (callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

function toIndexPage() {
    //ios返回首页代码
    connectWebViewJavascriptBridge(function(bridge) {
            bridge.send("dismiss");
    })
    //微信返回首页代码
     var href = vars.root + "/ec/goods/index.html";
     toNewPage(href);
}

function toPrePage() {
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.send("goback");
    })
    history.back();
}

function toOrderPage() {
    var href = vars.root + "/ec/mbr/user_order.html";
    toNewPage(href);
}

function toUserPage() {
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.send("dismiss");
    })
    var href = vars.root + "/ec/user/user_center.html";
    toNewPage(href);
}

function toLoginPage() {
    var href = vars.root + "/ec/user/login.html";
    toNewPage(href);
}

function toNewPage(href) {
    if (href == "#" || href == "" || href == "javascript:void(0)" || href == "javascript:void(0);" || href == "javascript:;") {
        return;
    }
    //href = "http://wx7.jerehsoft.com" + href;
    //var bottom = 0;
    //if (href.indexOf("index") > -1 || href.indexOf("sort") > -1) {
    //    bottom = "50px";
    //}
    //mui.openWindow({
    //    id: location.href,
    //    url: href,
    //    styles: {
    //        top: 0, //新页面顶部位置
    //        bottom: bottom //新页面底部位置
    //    },
    //    show: {
    //        autoShow: true, //页面loaded事件发生后自动显示，默认为true
    //        aniShow: "" //页面显示动画，默认为”slide-in-right“；
    //    }
    //})

    location.href = href;

}


/**
 * @description 页面添加代码
 */
function node() {
    $("body").append('<div class="wait_bg"></div>')
}
/**
 * @description 移除等待
 */
function removeloader() {
    $(".wait_bg").remove()
}
/**
 * @description 载入
 * @param {Object} timer
 */
function loader(timer) {
    timer = timer || 10;
    var settime = 1000 * 10;
    if (timer) {
        settime = timer * 1000;
    }
    node();
    setTimeout('removeloader()', settime);
}

/**
 * 错误图片处理
 * @param img
 */
function errorImg(img, type) {
    var size = "";
    switch (type) {
        case 1:
            size = "360x150";
            break;
        case 2:
            size = "720x150";
            break;
        case 3:
            size = "720x400";
            break;
        case 4:
            size = "720x250";
            break;
    }
    if (size != "") {
        size = "_" + size;
    }
    var imgSrc = vars.theme.ecImg + "/error_img" + size + ".gif";
    img.src = imgSrc;
    img.onerror = null;
}

/**
 * 判断是否登录
 * {success:true}
 * {success:false,url:*****}
 * @returns {*}
 */
function checkLogin(returnDate) {
    var json;
    var curUrl = window.location.href;
    $.ajax({
        type: 'POST',
        async: false,
        url: vars.root + "/comm/login/doCheck.do",
        data: {curUrl: curUrl},
        dataType: 'json',
        success: function (data) {
            json = data.data;
            returnDate(json);
        }
    });
}

/**
 * 获取当前页面
 * @returns {*}
 */
function curPage() {
    var curPage = window.location.href;
    curPage = encodeURI(curPage);
    return curPage;
}


/**
 * 创建form并提交
 * @param url
 * @param data
 */
$.postForm = function (url, data) {
    var form = $("<form method='post' style='display:none'></form>")
        .attr("action", url);

    for (var i in data) {
        if (!data.hasOwnProperty(i))
            continue;
        var v = data[i];
        if (typeof v == "function")
            continue;
        if (v instanceof Array) {
            for (var a = 0; a < v.length; ++a)
                $("<input type='hidden'/>").attr("name", i).val(v[i]).appendTo(form);
        } else {
            $("<input type='hidden'/>").attr("name", i).val(v).appendTo(form);
        }
    }

    form.appendTo($(document.body)).submit();
};

function buildUrl(url) {
    if (!url) {
        return url;
    } else if (url.charAt(0) == '/') {
        return vars.root + url;
    } else if (/^http[s]?:\/\//i.test(url)) {
        return url;
    } else {
        return vars.uploadRoot + url; // FIXME
    }
}

/**
 * 取当前服务器时间
 * @returns {*}
 */
function getCurTime(result) {
    var curTime;
    $.ajax({
        type: 'POST',
        async: false,
        url: vars.root + "/comm/date/doCurTime.do",
        data: {},
        dataType: 'json',
        success: function (data) {
            curTime = data.data;
            result(curTime);
        }
    });
    //return curTime;
}


function parseTime(t) {
    var d = Math.floor(t / 1000 / 60 / 60 / 24);
    var h = Math.floor(t / 1000 / 60 / 60 % 24);
    var m = Math.floor(t / 1000 / 60 % 60);
    var s = Math.floor(t / 1000 % 60);
    var dh = d * 24 + h;
    if (d < 0) {
        h = "00";
        m = "00";
        s = "00";
    } else {
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        if (dh < 10) {
            dh = "0" + dh;
        }
    }

    var timeObj = {
        d: d, h: h, m: m, s: s, t: t, dh: dh
    };
    return timeObj;
}

function getDateByStr(sDate) {
    var dDate = new Date(Date.parse(sDate.replace(/-/g, "/")));
    return dDate;
}


/**
 * 将queryString的search部分拆解成字典
 * 比如uri?a=1&b=2的拆解结果为{ a : "1", b : "2" }，不会返回null
 * @returns
 */
function extractSearch(queryString) {
    var search = typeof queryString != "string" ? location.search : queryString;
    if (search && search.charAt(0) == "?")
        search = search.substring(1);
    var r = {};
    if (search) {
        var re = /([^&=]+)[^&]+/g, mts = null, res = [];
        while (mts = re.exec(search)) {
            var i = mts[0];
            var a = i.indexOf("=");
            if (a != -1) {
                var k = i.substr(0, a);
                var v = i.substr(a + 1);
                try {
                    v = decodeURIComponent(v);
                } catch (e) {
                }
                var ov = r[k];
                if (!ov) {
                    r[k] = v;
                } else {
                    if (ov instanceof Array)
                        ov.push(v);
                    else
                        r[k] = [ov, v];
                }
            }
        }
    }
    return r;
}
/*textarea自动扩展*/
function autoGrow(oField) {
    if (oField.scrollHeight > oField.clientHeight) {
        oField.style.height = oField.scrollHeight + "px";
    }
}

function toWxPayPage(data){
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.send("gowxpay"+data);
    })
}

/**
 * html代码转义
 *
 * @param str
 * @returns {String}
 */
function htmlJsEncode(str) {
    var s = "";
    if (str == null || str.length == 0) {
        return "";
    }
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br/>");
    s = s.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    return s;
}

function htmlJsDecode(str) {
    var s = "";
    if (str == null || str.length == 0) {
        return "";
    }
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}

/**
 * 格式化货币
 */
function formatCurrency(value, buyType) {
    if (buyType == "Appointment") {
        return "面议";
    } else if (buyType == "Enquiry") {
        return "询价";
    }

    value = value + "";
    if (/[^0-9\.]/.test(value)) {
        if (buyType) {
            return "￥0";
        } else {
            return "0";
        }
    }
    //value = value.replace(/^(\d*)$/, "$1.");
    //value = (value + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    //value = value.replace(".", ",");
    //var re = /(\d)(\d{3},)/;
    //while (re.test(value)) {
    //    value = value.replace(re, "$1,$2");
    //}
    //value = value.replace(/,(\d\d)$/, ".$1");
    //value = value.replace(",", "");
    //value = value.replace(/^\./, "0.");
    //   return "￥" + value;
    value = parseFloat(value);
    value = value.toFixed(2);
    value = eval(value);
    if (buyType) {
        value = "￥" + value;
    }
    return value;
}

function formatDate(dateTime) {
    if (!dateTime) {
        return "";
    }
    dateTime = dateTime.substr(0, 10);
    return dateTime;
}


var areaListPageData;
function listArea(result) {
    if (areaListPageData) {
        return areaListPageData;
    }
    var json;
    $.ajax({
        type: 'POST',
        async: false,
        url: vars.root + "/comm/area/doMuiAreaList.do",
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.success == true) {
                json = data.data;
                result(json);
            }
        }
    });
    //areaListPageData = json;
    //return json;
}

function getAreaNameById(areaId) {
    var areaList=[];
    listArea(function(result){
        areaList=result;
    });
    var provinceName = "", cityName = "", districtName = "";
    out:
        for (var i = 0; i < areaList.length; i++) {
            var pObj = areaList[i];
            var pValue = pObj["value"];
            var pText = pObj["text"];
            var pChildren = pObj["children"];
            if (areaId == pValue) {
                provinceName = pText;
                break out;
            }
            for (var j = 0; j < pChildren.length; j++) {
                var cObj = pChildren[j];
                var cValue = cObj["value"];
                var cText = cObj["text"];
                var cChildren = cObj["children"];
                if (areaId == cValue) {
                    provinceName = pText;
                    cityName = cText;
                    break out;
                }

                for (var k = 0; k < cChildren.length; k++) {
                    var dObj = cChildren[k];
                    var dValue = dObj["value"];
                    var dText = dObj["text"];
                    if (areaId == dValue) {
                        provinceName = pText;
                        cityName = cText;
                        districtName = dText;
                        break out;
                    }
                }
            }
        }
    provinceName = provinceName || "";
    cityName = cityName || "";
    districtName = districtName || "";
    var areaJson = {provinceName: provinceName, cityName: cityName, districtName: districtName};
    return areaJson;
}

/**
 * 得到促销活动类型名称
 * @param obj
 * @returns {string}
 */
function getPromoName(type, seckill) {
    type = parseInt(type);
    var promoName = "";
    switch (type) {
        case 1:
            if (seckill == true || seckill == "true")
                promoName = "秒杀";
            else
                promoName = "限时";
            break;
        case 2:
            promoName = "团";
            break;
        case 3:
        case 4:
            promoName = "满减";
            break;
        default:
            break;
    }
    return promoName;
}

//mui图片lazyload
mui("img").imageLazyload({
    placeholder: vars.theme.ecImg + "/error_img.gif"
});


//mui弹出层禁止滑动页面
mui("body").on("touchmove",".mui-popup-backdrop",function(){
    event.preventDefault();
    //return false;
});

(function () {
    var sessionStoragePage = [
        {id: "goodsList", page: [/ec\/goods\/goods_list/, /ec\/goods\/\d/]},
        {id: "shopGoodsList", page: [/ec\/shop\/\d\/list/, /ec\/goods\/\d/]}
    ];
    var urlStr = location.href;
    $.each(sessionStoragePage, function (i, o) {
        var id = o.id;
        var page = o.page;
        var result = false;
        $.each(page, function (pI, reg) {
            var curResult = reg.test(urlStr);
            if (curResult == true) {
                result = true;
            }
        });
        if (!result) {
            removetSessionStorageItem(id);
        }
    });
})();

function removetSessionStorageItem(id) {
    sessionStorage.removeItem(id);
}

function setSessionStorageItem(id, value) {
    sessionStorage.setItem(id, value);
}

function getSessionStorageItem(id) {
    return sessionStorage.getItem(id);
}

mui('body').on('tap','a',function(){
    var dhref=$(this).attr('data-href');
    location.href=dhref;
});



