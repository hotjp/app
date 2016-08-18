var tArr = [];
var intervalId;

(function () {
    var sCurTime = getCurTime();//yyyy-MM-dd HH:mm:ss
    $("[data-type='promo']").each(function (i, o) {
        var id = $(this).attr("data-id");
        var promoName = $(this).find("[name='promoName']").val();
        var sStartTime = $(this).find("[name='startTime']").val();
        var sEndTime = $(this).find("[name='endTime']").val();

        var curTime = getDateByStr(sCurTime).getTime();
        var startTime = getDateByStr(sStartTime).getTime();
        var endTime = getDateByStr(sEndTime).getTime();
        var obj = {id: id, curTime: curTime, startTime: startTime, endTime: endTime, promoName: promoName};
        tArr.push(obj);
    });
    setIntervalTime();
    intervalId = setInterval(setIntervalTime, 1000);

    setPromoType();
})();

function setPromoType() {
    $("[data-type='promo']").each(function (i, o) {
        var type = $(this).find("[name='type']").val();
        var seckill = $(this).find("[name='seckill']").val();
        var typeName = getPromoName(type, seckill);
        $(this).find("[data-type='promoType']").html(typeName);
    });
}

function setIntervalTime() {
    $(tArr).each(function (i, o) {
        var id = o.id;
        var promoName = o.promoName;
        var curTime = o.curTime;
        var startTime = o.startTime;
        var endTime = o.endTime;
        curTime = curTime + 1000;
        var pTitle = "";
        var t = curTime - startTime;
        if (t < 0) {//距活动开始
            pTitle = "活动即将开始";
        } else {
            t = endTime - curTime;
            if (t > 0) {//距活动结束
                pTitle = promoName;
            } else {//活动已结束
                pTitle = "活动已结束";
                t = 0;
                clearInterval(intervalId);
            }
        }
        if (t < 0) {
            t = -t;
        }

        var id = o.id;
        var o1 = parseTime(t);
        o.curTime = curTime;
        $("[data-id='" + id + "']").find(".hour").html(o1.dh);
        $("[data-id='" + id + "']").find(".min").html(o1.m);
        $("[data-id='" + id + "']").find(".sec").html(o1.s);

        $("[data-id='" + id + "']").find("[data-type='promoName']").html(pTitle);

    });
}
