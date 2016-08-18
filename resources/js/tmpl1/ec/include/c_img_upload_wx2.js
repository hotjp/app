$(function(){
    $("[data-id='uploadBtn']").bind("click", function () {
        var _uploadModule = $(this).parents("[data-id='uploadModule']");
        var key = _uploadModule.data("key");
        var max = _uploadModule.data("max");
        var remainCount = _uploadModule.find("[data-id='remainCount']").text();
        remainCount = parseInt(remainCount);
        if (remainCount == 0) {
            return false;
        }
        uploadImgs(function (imgs) {
            $(imgs).each(function () {
                if (remainCount <= 0) {
                    return false;
                }
                remainCount--;
                var sHtml = "";
                sHtml += "<li class='g-u success fl' data-imgli='imgli' data-serverid='" + this.serverId + "'>";
                sHtml += "<div class='pic'>";
                sHtml += "<a href='javascript:void(0);'>";
                sHtml += "<img src='" + this.src + "' style='display: inline;'>";
                sHtml += "</a>";
                sHtml += "</div>";
                sHtml += "<a class='del-pic' href='javascript:void(0);'>删除</a></li>";
                _uploadModule.find("[data-id='uploaderQueue']").append(sHtml);
            });

            _uploadModule.find("[data-id='remainCount']").html(remainCount);

            var imageUrls = _uploadModule.find("[data-imgli='imgli']").map(function () {
                var serverId = $(this).data("serverid");
                return serverId;
            }).get().join(",");
            $("#imageUrls" + key).val(imageUrls);

        });
    });

    $("[data-id='uploaderQueue']").on("click", "li a.del-pic", function () {
        var _uploadModule = $(this).parents("[data-id='uploadModule']");
        var key = _uploadModule.data("key");
        var max = _uploadModule.data("max");
        var remainCount = _uploadModule.find("[data-id='remainCount']").text();
        var imageUrls = $("#imageUrls" + key).val();

        var _imgli = $(this).parents("li[data-imgli='imgli']");
        _imgli.remove();

        if (!remainCount) {
            remainCount = max;
        }
        remainCount++;
        if (remainCount > max) {
            remainCount = max;
        }
        _uploadModule.find("[data-id='remainCount']").html(remainCount);


        var imageUrls = _uploadModule.find("[data-imgli='imgli']").map(function () {
            var serverId = $(this).data("serverid");
            return serverId;
        }).get().join(",");
        $("#imageUrls" + key).val(imageUrls);

    });
});
