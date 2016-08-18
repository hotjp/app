var provinceId, cityId, districtId;
(function ($, doc) {//mui三级联动
    $.ready(function () {
        var showCityPickerButton = doc.getElementById('showCityPicker3Appointments');
        var cityResult3 = doc.getElementById('cityResult3Appointments');
        if (showCityPickerButton && cityResult3) {
            listArea(function(result){
                var cityPicker3 = new $.PopPicker({
                    layer: 3
                });
                cityPicker3.setData(result);
                showCityPickerButton.addEventListener('tap', function (event) {
                    cityPicker3.show(function (items) {
                        cityResult3.value = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        provinceId = (items[0] || {}).value;
                        cityId = (items[1] || {}).value;
                        districtId = (items[2] || {}).value;

                    });
                }, false);
            });


        }

    });
})(mui, document);


$(function () {
    initCheck();

    mui('body').on('tap', '#appointNow', function (e) {
        checkLogin(function(result){
            if (result.success == false) {
                location.href = result.url;
                return false;
            }
            $("#form-appointment").submit()
        });

    });

});

function initCheck() {
    $("#form-appointment").validate({
        rules: {
            contact: {
                required: true,
                maxlength: 20,
                minlength: 1
            },
            contactTel: {
                required: true,
                isMobile: true
            },
            address: {
                required: true,
                maxlength: 200,
                minlength: 1

            },
            remark: {
                required: true,
                maxlength: 300,
                minlength: 1

            }
        },

        submitHandler: function (form) {

            if(!skuId){
                mui.alert("请选择商品属性");
                return;
            }
            loader();
            var contact = $("[name='contact']").val();
            var contactTel = $("[name='contactTel']").val();
            var addressResult = $("[name='addressResult']").val();
            var address = $("[name='address']").val();
            var remark = $("[name='remark']").val();

            var url = vars.root + "/ec/mbr/doMakeAppt.do";
            var postData = {
                id:skuId,
                contact: contact,
                contactTel: contactTel,
                address: address,
                remark: remark,
                provinceId:provinceId,
                cityId:cityId,
                districtId:districtId
            };
            $.post(url, postData, function (data) {
                removeloader();
                if (data.success) {
                    mui.alert("预约已成功提交！");
                } else {
                    mui.alert("预约失败");
                }
            }, "json");
        }
    });
}