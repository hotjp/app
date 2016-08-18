var page = 1;
var pageSize = 3;
var keyword = "";
var replied = false;
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
            var sHref = $(this).attr("href");
            toNewPage(sHref);
        });
    });
}
$(function () {
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            up: {
                callback: listData
            }
        }
    });

    mui('.mui-table-view').on('tap', "a", function () {
        var sHref = $(this).attr("href");
        toNewPage(sHref);
    });
});

function listData() {
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doSearchBeSpeakList.do",
        data: {
            keywords: keyword,
            page: page,
            pageSize: pageSize,
            replied: replied
        },
        dataType: "json",
        success: function (data) {
            page++;
            setDataList(data.data.appointmentList);
            var flag = false;
            if (pageSize > data.data.appointmentList.rows.length) {
                flag = true;
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(flag);
            removeloader();
        }

    });
}

function setDataList(appointmentListData) {

    var listAppointment = appointmentListData.rows;
    if (listAppointment == null) {
        return;
    }

    var sHtml = "";
    for (var i = 0; i < listAppointment.length; i++) {
        var o = listAppointment[i];
        sHtml += "<li class='shop-order mui-table-view-cell'>";
        sHtml += "<div class='shop-title fs-12'>";
        sHtml += "<a href='"+vars.root+"/ec/shop/"+o.shopId+".html'><i class='iconfont icon-dianpu c-9c4b0f'>";
        sHtml += "</i>&nbsp;";
        sHtml += o.shopName;
        sHtml += "<span class='mui-pull-right c-ff5b53'></span></a>";
        sHtml += "</div>";
        sHtml += "<ul class='goods-list'>";
        sHtml += "<li class='clearfix'>";
        sHtml += "<a class='fl' href='"+vars.root+"/ec/goods/"+o.goodsId+".html'><img src='" + buildUrl(o.skuIconUrl) + "' onerror='errorImg(this);'></a>";
        sHtml += "<div class='goods-info fl'>";
        sHtml += "<p class='c-333 fs-13'>";
        sHtml += o.skuName || "";
        sHtml += "</p>";
        sHtml += "<p class='c-999 fs-11'>";
        sHtml += o.skuPropTextList || "";
        sHtml += "</p>";
        sHtml += "</div>";
        sHtml += "<div class='goods-price fr'>";
        sHtml += "<p class='fs-13 c-333 mui-text-right'>面议</p>";
        sHtml += "<p class='fs-13 c-333 mui-text-right'></p>";
        sHtml += "</div>";
        sHtml += "</li>";
        sHtml += "</ul>";
        sHtml += "<div class='shop-balance clearfix'>";
        sHtml += "<p class='c-333 fs-12'>";
        sHtml += "预约时间：";
        sHtml += "<span class='c-ff5b53'>";
        sHtml += o.createTime || "";
        sHtml += "</span>";
        sHtml += "</p>";
        sHtml += " <p class='c-333 fs-12 e1'>";
        sHtml += "预约内容：";
        sHtml += "<span class='c-ff5b53'>";
        sHtml += o.mbrRemark || "";
        sHtml += "</span>";
        sHtml += "</p>";
        sHtml += "<p class='c-333 fs-12'>";
        sHtml += "回复时间：";
        sHtml += "<span class='c-ff5b53'>";
        sHtml += o.sellerReplyTime || "";
        sHtml += "</span>";
        sHtml += "</p>";
        sHtml += "<p class='c-333 fs-12'>";
        sHtml += "商家回复：";
        sHtml += "<span class='c-ff5b53'>";
        sHtml += o.sellerRemark || "";
        sHtml += "</span>";
        sHtml += "</p>";
        //sHtml += "<a class='gry-border-btn fs-12 fr' href='#'>";
        //sHtml += "取消预约";
        //sHtml += "</a>";
        sHtml += "</div>";
        sHtml += "</li>";

    }
    $(".mui-table-view").append(sHtml);
}


