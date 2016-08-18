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