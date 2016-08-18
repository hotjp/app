
$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    mui('.cart-list-shop').on('tap', "[data-type='shopTitle'],[data-type='goodsPic'],.cart-goods-info a", function () {
        var sHref = $(this).attr("href");
        toNewPage(sHref);
    });

    $("#checkall,#deletall").click(function () {//全选和取消
        if ($(this).hasClass("on")) {
            $(this).removeClass("on");
            $(".goods-cart-list input[type=checkbox]:enabled").prop("checked",false);
            $(".checkall-shop").removeClass("on").parents(".cart-list-shop").find("input[type=checkbox]:enabled").prop("checked",false)
        } else{
            $(this).addClass("on");
            $(".goods-cart-list input[type=checkbox]:enabled").prop("checked",true);
            $(".cart-tools-bar input[type=checkbox]:enabled").prop("checked",true);
            //店铺未选中状态--->选中状态
            $(".checkall-shop").addClass("on").parents(".cart-list-shop").find("input[type=checkbox]:enabled").prop("checked",true)
        }
    });
    $(".checkall-shop").click(function () {//选中店铺所有商品
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").parents(".cart-list-shop").find("input[type=checkbox]:enabled").prop("checked",false);
        } else{
            $(this).addClass("on").parents(".cart-list-shop").find("input[type=checkbox]:enabled").prop("checked",true);
        }

        //全部选中后，取消某一店铺的选中，全选按钮置空
        var checkShopLen = $(".cart-list-shop-tit input[type=checkbox]:not(:checked):enabled").length;
        var allFlag = false;
        if(checkShopLen == 0){
            allFlag = true;
            $("#checkall").addClass("on");
        }else{
            $("#checkall").removeClass("on");
        }
        $(".cart-tools-bar input[type=checkbox]:enabled").prop("checked",allFlag);

        //console.info("未被选中的店铺数量："+checkShopLen);
    });
    $(".edit").click(function () {
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").find("i").html("编辑");
            $(this).parents(".cart-list-shop").find("ul.goods-shop li").removeClass("mui-selected");
            $(this).parents(".cart-list-shop").find("ul.goods-shop li .mui-slider-right").removeClass("mui-selected");

            $(this).parents(".cart-list-shop").find("ul.goods-shop li .mui-slider-handle,.mui-slider-right .mui-btn").css({"left":"0px"});
            $(this).parents(".cart-list-shop").find(".change-num").hide();
            $(this).parents(".cart-list-shop").find(".sale-num").show();
        } else{
            $(this).addClass("on").find("i").html("完成");
            $(this).parents(".cart-list-shop").find("ul.goods-shop li").addClass("mui-selected mui-transitioning");
            $(this).parents(".cart-list-shop").find("ul.goods-shop li .mui-slider-right").addClass("mui-selected");
            $(this).parents(".cart-list-shop").find("ul.goods-shop li .mui-slider-handle,.mui-slider-right .mui-btn").css({"left":"-88px"});
            $(this).parents(".cart-list-shop").find(".sale-num").hide();
            $(this).parents(".cart-list-shop").find(".change-num").show();
        }
    });
    $(".cart-list-shop-content input[type=checkbox]:enabled").click(function () {//选中子类判断是否应选中店铺
        if($(this).prop("checked")==true){
            if($(this).parents("ul").find("li").length<2){
                $(this).parents(".cart-list-shop").find(".checkall-shop").addClass("on")
                $(this).parents(".cart-list-shop").find(".cart-list-shop-tit input[type=checkbox]:enabled").prop("checked",true);
            }
            if($(this).parents(".cart-list-shop-content").find("input[type=checkbox]:checked:enabled").length==$(this).parents(".cart-list-shop-content").find("li").length){
                $(this).parents(".cart-list-shop").find(".checkall-shop").addClass("on")
                $(this).parents(".cart-list-shop").find(".cart-list-shop-tit input[type=checkbox]:enabled").prop("checked",true);

            }
        }else{
            if($(this).parents(".cart-list-shop-content").find("input[type=checkbox]:checked:enabled").length!=$(this).parents(".cart-list-shop-content").find("li").length){
                $(this).parents(".cart-list-shop").find(".checkall-shop").removeClass("on")
                $(this).parents(".cart-list-shop").find(".cart-list-shop-tit input[type=checkbox]:enabled").prop("checked",false);
            }
        }
        //全部选中后，取消某一商品的选中，全选按钮置空
        var checkGoodsLen = $(".cart-list-shop-content input[type=checkbox]:not(:checked):enabled").length;
        var allFlag = false;
        if(checkGoodsLen == 0){
            allFlag = true;
            $("#checkall").addClass("on");
        }else{
            $("#checkall").removeClass("on");
        }
        $(".cart-tools-bar input[type=checkbox]:enabled").prop("checked",allFlag);

        //console.info("未被选中的商品数量："+checkGoodsLen);

    })
    $(".cart-delet").click(function () {//购物车删除逻辑-全部-店铺-单品    //最后一个单品删除时删掉店铺(已注释)
        if ($("#deletall input[type=checkbox]:enabled").prop("checked")==true) {
            $(".goods-cart-list").html("");
        }else{
            $(".checkall-shop input[type=checkbox]:enabled").each(function () {
                if ($(this).prop("checked")==true) {
                    $(this).parents(".cart-list-shop").remove();
                } else{
                    $(".cart-list-shop-content input[type=checkbox]:enabled").each(function () {
                        if($(this).prop("checked")==true){
//							if($(this).parents("ul").find("li").length<2){
//								$(this).parents(".cart-list-shop").remove();
//							}else{
                            $(this).parents("li").remove();
//							}

                        }
                    })
                }
            })
        }
    });

    $(".mui-slider-right .mui-btn").click(function () {
        var btnArray=["否","是"];
        index=$(this).parents("li.table-view-cell").index();
        num=$(this).parents("ul").find("li.table-view-cell").length;
        var itemId=$(this).parents("li").attr("data-cart-item");
        var listShop=$(this).parents(".cart-list-shop");
        var tableView=$(this).parents("ul").find("li.table-view-cell").eq(index);
        mui.confirm("确认删除此商品？","",btnArray,function(e){
            if(e.index==1){
                delCartItems(itemId);//后台删除数据方法
                if(num==1){
                    listShop.remove();
                }else{
                    tableView.remove();
                }
            }else{

            }
        });


    })
    /*
     * zh begin
     * */

    $("#checkall,#deletall").click(function () {//全选和取消
        sumGoods();
    });
    $(".checkall-shop").click(function () {//选中店铺所有商品
        sumGoods();
    });
    $(".cart-list-shop-content input[type=checkbox]:enabled").click(function () {//选中子类判断是否应选中店铺
        sumGoods();
    });

    $(".balance").click(function () {//点击结算
        if(listCheckGoods()!=""){
            location.href = vars.root + "/ec/mbr/goods_order.html?items="+listCheckGoods();
        }else{
            mui.alert("请选择商品后再进行结算！");
        }
    });

    $(".edit").click(function () {//编辑店铺内商品数量后保存到后台
        if ($(this).hasClass("on")) {
        } else{
            var itemQty = "";
            $(this).parents(".cart-list-shop").find(".mui-input-numbox").each(function(){
                $(this).parents(".cart-price").find(".sale-num i").text($(this).val());
                itemQty = itemQty+ $(this).parents("li").attr("data-cart-item")+","+$(this).val()+";";
            });
            $.ajax({type : "POST",
                url : vars.root+"/ec/mbr/doUpdateCartItemQty.do",
                data : {
                    itemQty : itemQty
                },
                dataType: "json",
                success : function (data){
                }
            });
            sumGoods();
        }
    });

    sumGoods();

    function updateCartItems(){
        var itemQty = "";
        $(".cart-list-shop-content input[type=checkbox]").each(function () {
              itemQty = itemQty+ $(this).parents("li").attr("data-cart-item")+","+$(this).parents("li").find("input[type=number]").val()+";";
        });
        $.ajax({type : "POST",
            url : vars.root+"/ec/mbr/doUpdateCartItemQty.do",
            data : {
                itemQty : itemQty
            },
            dataType: "json",
            success : function (data){

            }
        });

    }

    function delCartItems(itemId){
        /*var itemIds = "";
        $(".cart-list-shop-content input[type=checkbox]").each(function () {
            if($(this).prop("checked")==true){
                itemIds = itemIds+ $(this).parents("li").attr("data-cart-item")+",";
            }
        });*/

        $.ajax({type : "POST",
            url : vars.root+"/ec/mbr/doDeleteCartItem.do",
            data : {
                itemIds : itemId
            },
            dataType: "json",
            success : function (data){
                sumGoods();
            }
        });
    }

    function sumGoods(){
        var sum = 0;
        var goodsNum=0;
        $(".cart-list-shop-content ul li").each(function(){
            if($(this).find(".mui-checkbox input[type=checkbox]:enabled").prop("checked")==true){
                var price = $(this).find(".sale-price").html().replace("¥","");
                price = parseFloat(price);
                var sl = $(this).find(".mui-input-numbox").val();
                sum = sum + price*sl;
            }else{
            }
            goodsNum++;
        });
        $("#sum-goods-cart").html("￥"+formatCurrency(sum));
        $("#goods-cart-num").html(goodsNum);
    }

    function listCheckGoods(){
        var items = "";
        $(".cart-list-shop-content ul li").each(function(){
            if($(this).find(".mui-checkbox input[type=checkbox]:enabled").prop("checked")==true){
                var id = $(this).attr("data-cart-item");
                var qty = $(this).find(".mui-input-numbox").val();
                items = items + id+":"+qty+";";
            }else{
            }
        })
        return items;
    }

    /*
     * zh end
     * */

});