document.addEventListener('touchstart',function(){
    return false;
},true);
// 禁止选择
document.oncontextmenu=function(){
    return false;
};
// H5 plus事件处理
var as='pop-in';// 默认窗口动画
function plusReady(){
    // 隐藏滚动条
    plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
    // Android处理返回键
    plus.key.addEventListener('backbutton',function(){
        if(confirm('确认退出？')){
            plus.runtime.quit();
        }
    },false);
    compatibleAdjust();
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}
// DOMContentLoaded事件处理
var _domReady=false;
document.addEventListener('DOMContentLoaded',function(){
    _domReady=true;
    compatibleAdjust();
},false);
// 兼容性样式调整
var _adjust=false;
function compatibleAdjust(){
    if(_adjust||!window.plus||!_domReady){
        return;
    }
    _adjust=true;
    // iOS平台使用div的滚动条
    if('iOS'==plus.os.name){
        document.getElementById('content').className='scontent';
    }
    // 预创建二级窗口
    //	preateWebviews();
    // 关闭启动界面
    setTimeout(function(){
        plus.navigator.closeSplashscreen();
    },500);
}
// 处理点击事件
var _openw=null;
function clicked(id,a,s){
    if(_openw){return;}
    a||(a=as);
    _openw=preate[id];
    if(_openw){
        _openw.showded=true;
        _openw.show(a,null,function(){
            _openw=null;//避免快速点击打开多个页面
        });
    }else{
        //		var wa=plus.nativeUI.showWaiting();
        _openw=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'},{preate:true});
        preate[id]=_openw;
        _openw.addEventListener('loaded',function(){//叶面加载完成后才显示
            //		setTimeout(function(){//延后显示可避免低端机上动画时白屏
            //			wa.close();
            _openw.showded=true;
            s||_openw.show(a,null,function(){
                _openw=null;//避免快速点击打开多个页面
            });
            s&&(_openw=null);//避免s模式下变量无法重置
            //		},10);
        },false);
        _openw.addEventListener('close',function(){//页面关闭后可再次打开
            _openw=null;
            preate[id]&&(preate[id]=null);//兼容窗口的关闭
        },false);
    }
}
// 预创建二级页面
var preate={};
function preateWebviews(){
    preateWebivew('plus/webview.html');
    var plist=document.getElementById('plist').children;
    // 由于启动是预创建过多Webview窗口会消耗较长的时间，所以这里限制仅创建5个
    for( var i=0;i<plist.length&&i<2;i++){
        var id=plist[i].id;
        id&&(id.length>0)&&preateWebivew(id);
    }
}
function preateWebivew(id){
    if(!preate[id]){
        var w=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'},{preate:true});
        preate[id]=w;
        w.addEventListener('close',function(){//页面关闭后可再次打开
            _openw=null;
            preate[id]&&(preate[id]=null);//兼容窗口的关闭
        },false);
    }
}
// 清除预创建页面(仅)
function preateClear(){
    for(var p in preate){
        var w=preate[p];
        if(w&&w.showded&&!w.isVisible()){
            w.close();
            preate[p]=null;
        }
    }
}

























$(function () {

    if(window.plus){
        mui.alert("plus不为空" + plus.os.name);
    }else{
        mui.alert("plus为空");
    }



    query();
    //这里看着后续代码没有调用，所以现在还没有修改
    //var json = checkLogin();
    //console.info(json);
    mui('.servers').on('tap', 'a', function (e) {
        if ($(this).attr("href") == "#" || $(this).attr("href") == "" || $(this).attr("href") == undefined) {
        } else {
            location.href = $(this).attr("href");
        }
    });


    $("#uploadSubmit").bind("click", function () {
        var url = vars.root + "/test/doUpload.do";
        var postData = {"imageUrls": $("#imageUrls").val()};

        $.post(url, postData, function (data) {

        }, 'json');

    });
});

function query() {

    var postData = {"param1": "参数1"};

    var url = vars.root + "/test/doTestValue.do";
    $.post(url, postData, function (data) {
        if (data.success == true) {
            setDate(data.data);
        } else {
            mui.alert("错误");
        }
    }, 'json');
}

function setDate(o) {
    if (!o) {
        return;
    }
    var sHtml = "";
    sHtml += "<p>value1:" + o.value1 + "</p>";
    sHtml += "<p>value2:" + o.value2 + "</p>";
    sHtml += "<p>value3:" + o.value3 + "</p>";
    $("#jsonView").html(sHtml);

}


var server = "http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
var files = [];
// 上传文件
function upload() {
    if (files.length <= 0) {
        plus.nativeUI.alert("没有添加上传文件！");
        return;
    }
    outSet("开始上传：")
    var wt = plus.nativeUI.showWaiting();
    var task = plus.uploader.createUpload(server,
        {method: "POST"},
        function (t, status) { //上传完成
            if (status == 200) {
                outLine("上传成功：" + t.responseText);
                plus.storage.setItem("uploader", t.responseText);
                var w = plus.webview.create("uploader_ret.html", "uploader_ret.html", {
                    scrollIndicator: 'none',
                    scalable: false
                });
                w.addEventListener("loaded", function () {
                    wt.close();
                    w.show("slide-in-right", 300);
                }, false);
            } else {
                outLine("上传失败：" + status);
                wt.close();
            }
        }
    );
    task.addData("client", "HelloH5+");
    task.addData("uid", getUid());
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        task.addFile(f.path, {key: f.name});
    }
    task.start();
}
// 拍照添加文件
function appendByCamera() {
    plus.camera.getCamera().captureImage(function (p) {
        appendFile(p);
    });
}
// 从相册添加文件
function appendByGallery() {
    plus.gallery.pick(function (p) {
        appendFile(p);
    });
}
// 添加文件
var index = 1;
function appendFile(p) {
    var fe = document.getElementById("files");
    var li = document.createElement("li");
    var n = p.substr(p.lastIndexOf('/') + 1);
    li.innerText = n;
    fe.appendChild(li);
    files.push({name: "uploadkey" + index, path: p});
    index++;
    empty.style.display = "none";
}
// 产生一个随机数
function getUid() {
    return Math.floor(Math.random() * 100000000 + 10000000).toString();
}