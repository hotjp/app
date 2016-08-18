//所在地区修改
var provinceId, cityId, districtId;
(function ($, doc) {//mui三级联动
    $.ready(function () {
        var showCityPickerButton = doc.getElementById('showCityPicker');
        var cityResult3 = doc.getElementById('cityResult');
        if (showCityPickerButton && cityResult3) {
            var cityData3 = listArea();
            var cityPicker3 = new $.PopPicker({
                layer: 3
            });
            cityPicker3.setData(cityData3);
            showCityPickerButton.addEventListener('tap', function (event) {
                cityPicker3.show(function (items) {
                    cityResult3.innerHTML = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                    provinceId = (items[0] || {}).value;
                    cityId = (items[1] || {}).value;
                    districtId = (items[2] || {}).value;
                    dataSubmit();
                });
            }, false);
        }

    });

})(mui, document);
mui.init();

$(function () {

    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    mui('body').on('tap', ".mui-pull-right", function () {//返回用户中心
        toUserPage();
    });
    mui('.user-info-list').on('tap', 'a:not(#showCityPicker)', function (e) {//mui冲突链接
        href = $(this).attr("href");
        toNewPage(href);
    });

    $(".user-sub").click(function () {
        toLoginPage();
    });

    var oldDistrictId = $("#oldDistrictId").val();
    var areaView = "";
    if (oldDistrictId) {
        var areaName = getAreaNameById(oldDistrictId);
        areaView = areaName.provinceName + " " + areaName.cityName + " " + areaName.districtName;
    }
    if ($.trim(areaView) == "") {
        areaView = "省、市、区县";
    }

    $("#cityResult").html(areaView);

});


function dataSubmit() {
    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doUpdateInfo.do",
        data: {
            type: "area",
            provinceId: provinceId,
            cityId: cityId,
            districtId: districtId
        },
        dataType: "json",
        success: function (data) {
            if (data.success) {
                mui.alert("修改成功");
            } else {
                mui.alert(data.errorMessage);
            }
        }
    });
}
