$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    $("textarea").each(function(){
        $(this).css("height",$(this).attr("scrollHeight"));
    });
    /*$('textarea').autoResize({   //自动扩展文本框
        // 文本框改变大小时触发事件，这里改变了文本框透明度
        onResize: function () {
            $(this).css({opacity: 0.8});
        },
        // 动画效果回调触发事件，这里改变了文本框透明度
        animateCallback: function () {
            $(this).css({opacity: 1});
        },
        // 动画效果持续时间（ms），默认150
        animate: false,
        // 每次改变大小时，扩展（缩小）的高度（像素），默认20   
        extraSpace: 30,
        //当文本框高度大于多少时，不再扩展，出现滚动条，默认1000   
        limit: 200
    });*/
    mui("body").on("tap", ".assess-star .stars i", function () {
        num = jQuery(this).index();
        elms = jQuery(this).parent().find(".iconfont");
        jQuery(elms).each(function () {
            if (jQuery(this).index() <= num) {
                jQuery(this).removeClass("icon-xing icon-kongxing").addClass("icon-xing");
            } else {
                jQuery(this).removeClass("icon-xing icon-kongxing").addClass("icon-kongxing");
            }
        });
        jQuery(this).parents(".assess-star").find(".star_num").val(num + 1);
    });

    mui("body").on("tap", "#commentBtn", function () {
        commentSubmit();
    });
});

function commentSubmit() {
    var json = [];
    var anonymous = 0;
    if ($("#anonymous:checked").length > 0) {
        anonymous = 1;
    }

    var result = false;
    var curI = 0;
    $("[data-type='comment']").each(function (i, o) {
        var id = $(this).attr("data-id");
        var rank = $(this).find("[name='rank']").val();
        var content = $(this).find("[name='content']").val() || "";
        var picUrls = $(this).find("[name^='imageUrls']").val();
        json.push({id: id, rank: rank, content: content, picUrls: picUrls, anonymous: anonymous});
        if (content == "") {
            curI = i;
            result = true;
            return false;
        }
    });
    if (result) {
        mui.alert("请对第" + (curI + 1) + "个商品留下您的评价");
        return;
    }

    loader();
    var url = vars.root + "/ec/mbr/doCommentOnSku.do";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            json: JSON.stringify(json)
        },
        dataType: "json",
        success: function (data) {
            removeloader();
            if (data.success == true) {
                mui.alert("评价成功!","",function(){
                    var sHref = vars.root + "/ec/mbr/user_order.html";
                    toNewPage(sHref);
                });
            } else {
                mui.alert(data.errorMessage);
            }
        }
    });
}
