/**
 * 上拉加载具体业务实现
 */
if (mui.os.plus) {
    mui.plusReady(function () {
        setTimeout(function () {
            mui('#pullrefresh').pullRefresh().pullupLoading();
        }, 1000);
    });
} else {
    mui.ready(function () {
        mui('#pullrefresh').pullRefresh().pullupLoading();

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
                callback: listRefunds
            }
        }
    });
    mui('#pullrefresh').on('tap', 'a', function (e) {
        var href=$(this).attr("href");
        toNewPage(href);
    });
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toUserPage();
    });
});
function listRefunds() {//加载退款订单列表
    var status = "";
    var commentStatus = "";
    var refundFrom = "";
    var refundTo = "";
    var shop = "";
    var page = "";
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/refund/doListRefunds.do",
        data: {
            status: status,
            commentStatus: commentStatus,
            refundFrom: refundFrom,
            refundTo: refundTo,
            shop: shop,
            page: page
        },
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                $(".mui-table-view").empty();//清空列表
                mui('#pullrefresh').pullRefresh().endPullupToRefresh((++data.data.pageId > data.data.pageCount)); //参数为true代表没有更多数据了。
                var table = document.body.querySelector('.mui-table-view');
                var cells = document.body.querySelectorAll('.mui-table-view li');
                var refundsList = data.data.rows;
                if (refundsList == null) {

                } else {
                    for (var i = cells.length; i < data.data.rowCount; i++) {
                        var li = document.createElement('li');
                        li.className = 'shop-order';
                        var shtml = "";
                        shtml += '<div class="shop-title fs-12">';
                        shtml += "<i class='iconfont icon-dianpu fs-18 c-9c4b0f'></i>&nbsp;<a href='" + vars.root + "/ec/shop/" + refundsList[i].shopId + ".html'>" + refundsList[i].shopName + "</a>";
                        shtml += '<span class="mui-pull-right c-ff5b53">' + refundsList[i].refundStatusName + '</span>';
                        shtml += '</div>';
                        shtml += '<ul class="goods-list">';
                        shtml += '<li class="clearfix">';
                        shtml += '<a href="' + vars.root + '/ec/mbr/refund/' + refundsList[i].id + '.html">';
                        shtml += '<img class="fl" src="' + buildUrl(refundsList[i].skuIconUrl == null ? "" : refundsList[i].skuIconUrl) + '" onerror="errorImg(this);"/>';
                        shtml += '<div class="goods-info fl">';
                        shtml += '<p class="c-333 fs-13">' + refundsList[i].skuName + '</p>';
                        shtml += '<p class="c-999 fs-11">' + refundsList[i].skuPropTextList + '</p>';
                        shtml += '</div>';
                        shtml += '<div class="goods-price fr">';
                        //shtml += '<p class="fs-13 c-333 mui-text-right">' + "￥" + formatCurrency(refundsList[i].paidAmount) + '</p>';
                        //shtml += '<p class="fs-13 c-333 mui-text-right">x1</p>';
                        shtml += '</div>';
                        shtml += '</a>';
                        shtml += '</li>';
                        shtml += '</ul>';
                        shtml += '<div class="shop-balance clearfix">';
                        shtml += '<p class="c-333 fs-12"></span>&nbsp;&nbsp;退款金额:<span class="price fs-16">' + "￥" + formatCurrency(refundsList[i].amount) + '</span> </p>';
                  //      shtml += '<a class="red-border-btn fs-12 fr" href="#">钱款去向</a>';
                        shtml += '</div>';
                        li.innerHTML = shtml;
                        table.appendChild(li);
                    }
                }

            }, 500);
        }
    });
}