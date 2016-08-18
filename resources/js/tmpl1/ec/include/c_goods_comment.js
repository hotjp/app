var page = 1;
var pageSize = 3;

(function () {
    mui('#comment').on('tap', 'a', function (e) {//mui冲突链接
        var href = $(this).attr("href");
        toNewPage(href);
    });
    /**
     * 星级评价
     */
    /*$(".comment-stars").html(function () {
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
    });*/
    listData();

})();
function listData(curType) {//根据定位的Tab页加载积分详细信息
    var flag = false;
    var type = curType;
    if (!curType) {
        type = "all";
    }
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/goods/doSearchComments.do",
        data: {
            goodsId: $("#goodsId").val(),
            type: type,
            async: false,
            page: page,
            pageSize: pageSize
        },
        async: false,
        dataType: "json",
        success: function (data) {
            page++;
            setDataList(data.data.commentPagedList, type);
            if (pageSize > data.data.commentPagedList.rows.length) {
                flag = true;
            }
            removeloader();
            /**
             * 星级评价
             */
            $(".comment-stars").html(function () {
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
        }
    });
    return flag;
}

function setDataList(commentsData, curType) {
    var type = curType;
    if (!curType) {
        type = "all";
    }
    var comments = commentsData.rows;
    if (comments == null) {
        return;
    }
    //评价数量
    var rowCount = commentsData.rowCount;
    $("#commentCount").html(rowCount);


    var sHtml = "";
    for (var i = 0; i < comments.length; i++) {
        var o = comments[i];

        if (o == null) {
            continue;
        }
        //获得评价星级数量
        var xingCount = o.rank;

        //获得图片的URL
        var pic = o.picUrls;

        sHtml += "<li>";
        sHtml += " <div class='comment-user'>";
        sHtml += "<img class='comment-user-img' src='"+buildUrl(o.headUrl)+"' onerror='errorImg(this);'/>";
        sHtml += "<span class='comment-user-name fs-13 c-333'>"
        sHtml += o.mbrNickName;
        sHtml += "<div class='comment-stars' data-starnum='" + xingCount + "'></div>";
        sHtml += " <div class='comment-text fs-13 c-777'>";
        sHtml += o.content || "";
        sHtml += " </div>";
        sHtml += " <div class='comment-img'>";
        //评价的图片信息
        for (var j = 0; j < pic.length; j++) {
            var picUrl = pic[j];
            sHtml += "<img src='" + buildUrl(picUrl) + "' onerror='errorImg(this);'/>&nbsp;";
        }
        sHtml += "</div>";
        sHtml += " <div class='comment-moreinfo fs-11 c-999'>";
        sHtml += "<span>";
        sHtml +=  formatDate(o.date);
        sHtml += "</span>";
        sHtml += "<span>";
        sHtml += "颜色分类:" + o.skuPropTextList;
        sHtml += "</div>";
        sHtml += "</li>";

    }
    $("#" + type + " .mui-table-view").append(sHtml);
}
