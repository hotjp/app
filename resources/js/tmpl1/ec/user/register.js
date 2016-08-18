function removeclassIn() {
    $(".animated").removeClass("slideInRight");
}
function removeclassOut() {
    $(".animated").removeClass("slideOutRight");
}
$(function () {
    initCheck();
    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });
    //用户协议
        $(".qlm_chk").click(function(){
            if($(this).is(":checked")){
                $(".qlm_sub").removeClass("disabled");
            }else{
                $(".qlm_sub").addClass("disabled");

            }
        });
        $(".user_protocol").click(function () {
            setTimeout(removeclassIn, 800);
            $(".protocal_nr").addClass("animated slideInRight").show();
            $(".protocol").fadeIn(500);
        })
        $(".checkout").click(function () {
            setTimeout(removeclassOut, 800);
            $(".protocal_nr").addClass("animated slideOutRight").fadeOut(600);
            $(".qlm_chk").prop("checked","checked");
            $(".qlm_sub").removeClass("disabled");
            $(".protocol").fadeOut(500);
        });

});



function initCheck() {
    $("#form-register").validate({
        rules: {
            userName: {
                required: true,
                maxlength: 24,
                minlength: 4,
                isAccount: true,
                remote: {
                    type: "post",
                    url: vars.root + "/ec/user/doCheckUserName.do",
                    data: {
                        userName: function () {
                            return $("#form-register [name='userName']").val();
                        }
                    }
                }
            },
            mobile: {
                required: true,
                isMobile: true
            },
            email: {
                email: true
            },
            pwd: {
                required: true,
                isPassword: true,
                maxlength: 16,
                minlength: 6

            },
            agPwd: {
                required: true,
                maxlength: 16,
                minlength: 6,
                equalTo: "#pwd"

            }
        },
        messages: {
            userName: {
                remote: '用户名已存在'
            }
        },
        submitHandler : function(form) {
            if($("input[type='checkbox']").is(':checked')){
                loader();
                var url = vars.root + "/ec/user/doSubmitRegister.do";
                var postData = $("#form-register").serialize();
                $.post(url, postData, function(data) {
                    removeloader();
                    if (data.data.success) {
                        location.href = vars.root + "/ec/user/user_center.html";
                    } else {
                        mui.alert("注册失败:"+data.data.errMessage);
                    }
                }, "json");
            }else{
                mui.alert("请认真阅读并同意协议！");
            }
        }
    });
}