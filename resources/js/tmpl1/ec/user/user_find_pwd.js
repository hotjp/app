$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    initCheck();

    $(".mui-pull-right").bind("click", function () {
        $("#form-findPwd").submit();
    });
})

function initCheck() {
    $("#form-findPwd").validate({
        rules: {
            name: {
                required: true,
                maxlength: 20,
                minlength: 1,
                isAccount: true
            },
            mobile: {
                required: true
            }

        },
        submitHandler: function (form) {
            var emailOrMobile = $("#emailOrMobile").val();
            //if (!/^1\d{10}$/.test(emailOrMobile)) {
                if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(emailOrMobile)) {
                    mui.alert("请输入正确的邮箱！");
                    return;
                }
            //}
            loader();
            var name = $("#name").val();
            var url = vars.root + "/ec/user/doPwdRecovery.do";
            var postData = {name: name, emailOrMobile: emailOrMobile};
            $.post(url, postData, function (data) {
                removeloader();
                if (data.success) {
                    mui.alert(data.data.message, "", function () {
                        toLoginPage();
                    });
                } else {
                    mui.alert(data.errorMessage);
                }
            }, "json");
        }

    });
}