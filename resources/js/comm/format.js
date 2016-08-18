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