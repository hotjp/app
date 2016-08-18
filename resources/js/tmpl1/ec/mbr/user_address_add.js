$(function () {
    initCheck();
    if( $("#status").val() && $("#status").val()=="Default"){
        $("[name='checkDefault']").attr("checked",'true');
    }

    var districtId = $("#districtId").val();
    var areaView = "";
    /*if (districtId) {
        var areaName = getAreaNameById(districtId);
        areaView = areaName.provinceName + " " + areaName.cityName + " " + areaName.districtName;
    }*/
    areaView = $("#provinceName").val() + " " + $("#cityName").val() + " " + $("#districtName").val();
    $("#cityResult3").val(areaView);

});
function initCheck() {//验证表单信息
    $("#save-address").validate({
        rules: {
            contactName: {
                required: true
            },
            cityResult3: {
                required: true
            },
            address: {
                required: true
            },
            contactTel: {
                required: true,
                isMobile: true
            }
        },
        submitHandler: function (form) {
            var url = vars.root + "/ec/mbr/doSaveAddress.do";
            var postData = $("#save-address").serialize();
            loader();
            $.post(url, postData, function (data) {
                removeloader();
                if (data.success) {
                    if (data.data.url) {
                        location.href = vars.root + "/ec/mbr/user_address.html?url=" + data.data.url;
                    } else {
                        location.href = vars.root + "/ec/mbr/user_address_edit.html";
                    }
                } else {
                    mui.alert("添加地址失败!");
                }
            }, "json");

        }
    });
}