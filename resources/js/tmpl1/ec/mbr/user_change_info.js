$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    initCheck();
    $(".mui-pull-right").bind("click", function () {
        $("#form-userInfo").submit();
    });
})

function initCheck() {

    $("#form-userInfo").validate({
        rules: {
            nickName: {
                maxlength: 20,
                minlength: 1,
                isName: true
            },
            mobile: {
                required: true,
                isMobile: true
            },
            email: {
                email: true
            }
        },

        submitHandler: function (form) {
            loader();
            var nickName = "";
            var mobile = "";
            var email = "";
            var type = "";
            if ($("#nickName").length > 0) {
                nickName = $("#nickName").val();
            }
            if ($("#mobile").length > 0) {
                mobile = $("#mobile").val();
            }
            if ($("#email").length > 0) {
                email = $("#email").val();
            }
            type = $("#type").val();
            var url = vars.root + "/ec/mbr/doUpdateInfo.do";
            var postData = {nickName: nickName, email: email, mobile: mobile,type:type};
            $.post(url, postData, function (data) {
                removeloader();
                if (data.success) {
                    mui.alert("修改成功","",function(){
                        var sHref = vars.root + "/ec/mbr/user_manage.html";
                        toNewPage(sHref);
                    });
                } else {
                    mui.alert(data.errorMessage);
                }
            }, "json");


        }
    });
}