function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}
(function () {
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            responseCallback();
        });

        bridge.registerHandler("returnPhoto", function(data, responseCallback) {
            var _uploadModule = $("[data-id='uploadBtn']").parents("[data-id='uploadModule']");
            var key = _uploadModule.data("key");
            var max = _uploadModule.data("max");
            var _remainCount = _uploadModule.find("[data-id='remainCount']");
           // var data="upload/20160329/db010e84-aec4-4378-93bb-ff351929d2c6.jpg,upload/20160329/de65e6f3-b659-49dd-bef3-0403fedd4e6a.jpg,upload/20160329/37699a5d-cdd8-41b6-9e54-2161a82cdefe.jpg";
            var imgList=[];
            if(!!data){
                imgList=data.split(",");
            }
            var remainCount=_remainCount.text();
            $(imgList).each(function () {
                if (remainCount <= 0) {
                    return false;
                }
                remainCount--;
                var sHtml = "";
                sHtml += "<li class='g-u success fl' data-imgli='imgli' data-imgurls='" + buildUrl(this) + "'>";
                sHtml += "<div class='pic'>";
                sHtml += "<a href='javascript:void(0);'>";
                sHtml += "<img src='" + buildUrl(this) + "' style='display: inline;'>";
                sHtml += "</a>";
                sHtml += "</div>";
                sHtml += "<a class='del-pic' href='javascript:void(0);'>删除</a></li>";
                _uploadModule.find("[data-id='uploaderQueue']").append(sHtml);
            });
            _remainCount.html(remainCount);

            var imageUrls = _uploadModule.find("[data-imgli='imgli']").map(function () {
                var imgurls = $(this).data("imgurls");
                return imgurls;
            }).get().join(",");
            $("#imageUrls" + key).val(imageUrls);
        });
    })
    $("[data-id='uploadBtn']").bind("click", function () {
        var _uploadModule = $(this).parents("[data-id='uploadModule']");
        var key = _uploadModule.data("key");
        var max = _uploadModule.data("max");
        var _remainCount = _uploadModule.find("[data-id='remainCount']");
        var remainCount = _remainCount.text();
        if (!remainCount) {
            remainCount = max;
        }
        if (remainCount == 0) {
            return;
        }
        window.WebViewJavascriptBridge.send("takePhoto");

    });

    $("[data-id='uploaderQueue']").on("click", "li a.del-pic", function () {
        var _uploadModule = $(this).parents("[data-id='uploadModule']");
        var key = _uploadModule.data("key");
        var max = _uploadModule.data("max");
        var _remainCount = _uploadModule.find("[data-id='remainCount']");
        var imageUrls = $("#imageUrls" + key).val();

        var _imgli = $(this).parents("li[data-imgli='imgli']");
        _imgli.remove();

        var remainCount = _remainCount.text();
        if (!remainCount) {
            remainCount = max;
        }
        remainCount++;
        if (remainCount > max) {
            remainCount = max;
        }
        _remainCount.html(remainCount);

        var imageUrls = _uploadModule.find("[data-imgli='imgli']").map(function () {
            var imgurls = $(this).data("imgurls");
            return imgurls;
        }).get().join(",");
        $("#imageUrls" + key).val(imageUrls);

    });
})();
