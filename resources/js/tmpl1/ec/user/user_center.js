$(function () {
    var nickName = "";
    var sHref = "";
    checkLogin(function(result){
        if (result.success == true) {
            var member = result.member;
            nickName = member.nickName;
            sHref = vars.root + "/ec/mbr/user_manage.html";
            setUserInfo();
        } else {
            nickName = "登录/注册";
            sHref = vars.root + "/ec/user/login.html";
        }
        $(".user-info .user-name").html(nickName);
        $("#userManage").bind("click", function () {
            toNewPage(sHref);
        });
    });

});

function setUserInfo() {
    var url = vars.root + "/ec/mbr/doUserInfo.do";
    $.ajax({
        type: "POST",
        url: url,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.success) {
                var orderCountByStatus = data.data.orderCountByStatus;
                var New = orderCountByStatus.New;
                var NotSent = orderCountByStatus.NotSent;
                var Sent = orderCountByStatus.Sent;
                var Uncommented = orderCountByStatus.Uncommented;
                if (New) {
                    $("#orderNew").append("<span class='mui-badge'>" + New + "</span>");
                }
                if (NotSent) {
                    $("#orderNotSent").append("<span class='mui-badge'>" + NotSent + "</span>");
                }
                if (Sent) {
                    $("#orderSent").append("<span class='mui-badge'>" + Sent + "</span>");
                }
                if (Uncommented) {
                    $("#orderUncommented").append("<span class='mui-badge'>" + Uncommented + "</span>");
                }
            }

        }
    });

}
