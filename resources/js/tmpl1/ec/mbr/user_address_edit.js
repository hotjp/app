$(function () {

    mui('body').on('tap', '.user-address-add-btn', function (e) {//mui冲突链接
        var sHref = $(this).attr("href");
        toNewPage(sHref);
    });

    mui("body").on("tap", ".address-del1", function () {
        del = confirm("确认删除此收货地址？")
        if (del == true) {
            delAddress($(this).parents("li").attr("id"));
        }

    });

    mui("body").on("tap", "#addr-edit-finish", function () {
        var url = $("#url").val();
        if (url) {
            location.href = vars.root + "/ec/mbr/user_address.html?url=" + url;
        } else {
            location.href = vars.root + "/ec/mbr/user_manage.html";
        }
    });

    function delAddress(id) {
        $.ajax({
            type: "POST",
            url: vars.root + "/ec/mbr/doDelAddress.do",
            data: {
                addrId: id
            },
            dataType: "json",
            success: function (data) {
                if (data.success == false) {
                    mui.alert(data.errorMessage);
                } else {
                    mui.alert("删除收货地址成功！");
                    $(".user-address-content li#" + id).remove();
                }
            }
        });
    }

    mui("body").on("tap", ".address-edit", function () {
        var id = $(this).parents("li").attr("id");
        var sHref = vars.root + "/ec/mbr/editAddress.html";
        sHref += "?id=" + id;
        var url = $("#url").val();
        if(url){
            sHref += "&url=" + url;
        }
        toNewPage(sHref);
    });
});
