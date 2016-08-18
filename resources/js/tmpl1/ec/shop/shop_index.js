$(function () {
    mui('body').on('tap', '#btn_index', function (e) {
        toIndexPage();
    });
    mui('body').on('tap', '#bigGoodsPic', function (e) {
     var href = $(this).attr("href");
     toNewPage(href);
     });
    mui('body').on('tap','#shopCat',function(e){
        var href=$(this).attr("href");
        toNewPage(href);
    });
    var shopId = $("#shopId").val();

    $(".shop-index-collect").click(function () {//加入收藏动画
        function removeclass() {
            $(".animated").removeClass("pulse");
        }

        if ($(this).hasClass("on")) {
            $(this).removeClass("on").css({"color": "#999"}).find("i").addClass("animated pulse").css({"color": "#d0d0d0"})
            setTimeout(removeclass, 1000);
        } else {
            //       $(this).addClass("on").css({"color":"#fbd034"}).find("i").addClass("animated pulse").css({"color":"#fbd034"})
            setTimeout(removeclass, 1000);
        }
    });
    mt = $(".shop-nav ul").offset().top
    $(document).scroll(function () {//距离顶部mt浮动按钮
        totop = $(window).scrollTop();
        if (totop > mt) {
            $(".shop-nav ul").css({"position": "fixed", "top": "44px"});
            $(".return-home").css({"top": "90px"});
        } else {
            $(".shop-nav ul").css({"position": "absolute", "top": "5px"});
            $(".return-home").css({"top": "50px"});
        }
    });
    //$(".shop-nav ul li").click(function () {//店铺首页tab切换
    //    index=$(this).index();
    //    $(this).addClass("on").siblings("li").removeClass("on");
    //    $(".shop-index-tab").eq(index).addClass("mui-block").siblings(".shop-index-tab").removeClass("mui-block");
    //});

    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });

    $(".shop-nav ul li[data-tab='all']").click(function () {
        var sHref = vars.root + "/ec/shop/" + shopId + "/list.html";
        toNewPage(sHref);
    });

    $(".shop-index-collect").click(function () {//加入收藏动画
        checkLogin(function(result){
            if (result.success == false) {
                location.href = result.url;
                return false;
            }

            $.ajax({
                type: "POST",
                url: vars.root + "/ec/mbr/doAddShopToFav.do",
                data: {
                    id: shopId
                },
                dataType: "json",
                success: function (data) {
                    if (data.data == true) {
                        mui.alert("收藏成功");
                    } else {
                        mui.alert("您已收藏该店铺");
                    }
                }
            })
        });
    });
    if($(".coupon .discount .price").length > 0){
        $(".coupon .discount .price").each(function(){
            var pnum = parseInt($(this).html()).toString().length
            var classname = "font-large"
            if(pnum = 3){
                classname = "font-middle"
            }else if(pnum = 4){
                classname = "font-smalll"
            };
            $(this).addClass(classname)
        })
    }

})
