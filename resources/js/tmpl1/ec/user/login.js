checkLogin(function(result){
    if (result.success == true) {
        toUserPage();
    }
});
$(function () {
    $("body").on("click", ".user-sub", function () {
        login();
    });
    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });
    function login() {
        var loginname = $.trim($("#loginname").val());
        var loginpwd = $("#loginpwd").val();
        loader();
        $.ajax({
            type: "POST",
            url: vars.root + "/ec/user/doLoginUser.do",
            data: {
                loginname: loginname,
                loginpwd: loginpwd
            },
            dataType: "json",
            success: function (data) {
                removeloader();
                if (data.data.success == false) {
                    mui.alert("登录失败：" + data.data.errMessage);
                } else {
                    if ($("#platform").val() == "WX") {
                        autoLogin(0);
                    } else {
                        var btnArray = ['否', '是'];
                        mui.confirm('登录成功,是否记住密码？', '', btnArray, function (e) {
                            if (e.index == 1) {
                                autoLogin(1);
                            } else {
                                autoLogin(0);
                            }
                        });
                    }
                }
            }
        });
    }

});

function autoLogin(memberAutoLogin) {
    var url = $("#url").val();
    if (!url) {
        url = vars.root + "/ec/user/user_center.html";
    }
    if (memberAutoLogin == 1) {
        $.ajax({
            type: "POST",
            url: vars.root + "/ec/mbr/doAutoLogin.do",
            data: {},
            dataType: "json",
            success: function (data) {
                toNewPage(url);
            }
        });
    } else {
        toNewPage(url);
    }

}
