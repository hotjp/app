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


