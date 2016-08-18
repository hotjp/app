mui.init();


$(function () {
    (function ($) {
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        $('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
    })(mui);

    mui('.mui-scroll-wrapper').scroll();

    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    mui('body').on('shown', '.mui-popover', function (e) {
        //console.log('shown', e.detail.id);//detail为当前popover元素
        //mui(e.detail).popover('hide');//隐藏的方法
    });
    mui('body').on('hidden', '.mui-popover', function (e) {
        //console.log('hidden', e.detail.id);//detail为当前popover元素
    });

    mui(".order-control ul ").on("tap", "li", function () {//修复mui-slider切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());
    });

    mui(".mui-slider-group").on("tap", ".user-sub", function () {//点击按钮切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).parents(".mui-slider-item").index() + 1);
    });

    mui(".mui-slider-group").on("tap", "#upload-logi", function () {//上传退货物流凭证
        var id = $("#refundId").val();
        var comp = $("#comp option:selected").val();//物流公司
        var sn = $("#sn").val();///单号
        var contact = $("#contact").val();//物流电话
        var picUrlList = $("#imageUrls").val();
        var reg = /^([0-9]|[\-])+$/g;
        if (sn == "" || contact == "" || comp == "") {
            mui.alert("请确认物流信息填写完整！");
            return;
        }
        if (!reg.test(contact)) {
            mui.alert("请确认物流联系方式为电话号码");
            return;
        }

        loader();
        jQuery.ajax({
            type: "POST",
            url: vars.root + "/ec/mbr/refund/doUpdateRefundLogi.do",
            data: {
                id: id,
                comp: comp,
                sn: sn,
                contact: contact,
                picUrlList: picUrlList
            },
            dataType: "json",
            success: function (data) {
                removeloader();
                if (data.success) {
                    mui.alert("操作成功","",function(){
                        var url = vars.root + "/ec/mbr/refund/"+id+".html";
                        toNewPage(url);
                    });
                }else{
                    mui.alert(data.errorMessage);
                }
            }
        });

    });
    mui('.mui-slider').slider().gotoItem(jQuery(".mui-slider-item").length - 1);
});
