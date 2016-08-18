(function () {
    var sessionStoragePage = [
        {id: "goodsList", page: [/ec\/goods\/goods_list/, /ec\/goods\/\d/]},
        {id: "shopGoodsList", page: [/ec\/shop\/\d\/list/, /ec\/goods\/\d/]}
    ];
    var urlStr = location.href;
    $.each(sessionStoragePage, function (i, o) {
        var id = o.id;
        var page = o.page;
        var result = false;
        $.each(page, function (pI, reg) {
            var curResult = reg.test(urlStr);
            if (curResult == true) {
                result = true;
            }
        });
        if (!result) {
            removetSessionStorageItem(id);
        }
    });
})();

function removetSessionStorageItem(id) {
    sessionStorage.removeItem(id);
}

function setSessionStorageItem(id, value) {
    sessionStorage.setItem(id, value);
}

function getSessionStorageItem(id) {
    return sessionStorage.getItem(id);
}

