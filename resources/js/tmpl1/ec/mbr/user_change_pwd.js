$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    initCheck();

    $(".mui-pull-right").bind("click", function () {
        $("#form-passWord").submit();
        /* var oldPwd = "";
         var newPwd = "";
         var definePwd = "";
         if ($("#oldPwd").length > 0) {
         oldPwd = $("#oldPwd").val();
         }
         if ($("#newPwd").length > 0) {
         newPwd = $("#newPwd").val();
         }
         if ($("#definePwd").length > 0) {
         definePwd = $("#definePwd").val();
         }
         $.ajax({
         type: "POST",
         url: vars.root + "/ec/mbr/doUpdatePwd.do",
         data: {
         oldPwd: oldPwd,
         newPwd: newPwd
         },
         dataType: "json",
         success: function (data) {
         if (data.success) {
         mui.alert("密码修改成功，请重新登录","",function(){
         var sHref = vars.root + "/ec/mbr/user_manage.html";
         toNewPage(sHref);
         });
         } else {
         mui.alert(data.errorMessage);
         }
         }
         });*/
    });
})

function initCheck() {
    $("#form-passWord").validate({
        rules: {
            oldPwd: {
                required: true,
                isPassword: true,
                maxlength: 20,
                minlength: 6
            },
            newPwd: {
                required: true,
                isPassword: true,
                maxlength: 20,
                minlength: 6


            },
            definePwd: {
                required: true,
                isPassword: true,
                maxlength: 20,
                minlength: 6,
                equalTo: "#newPwd"
            }
        },

        submitHandler: function (form) {

            loader();
            var url = vars.root + "/ec/mbr/doUpdatePwd.do";
            var postData = $("#form-passWord").serialize();
            $.post(url, postData, function (data) {
                removeloader();
                if (data.success) {
                    mui.alert("密码修改成功，请重新登录","",function(){
                        toLoginPage();
                    });
                } else {
                    mui.alert(data.errorMessage);
                }
            }, "json");
        }
    });
}