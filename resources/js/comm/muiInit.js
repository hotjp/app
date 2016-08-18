    //mui图片lazyload
    mui(document.body).imageLazyload({
        placeholder: vars.theme.ecImg + "/error_img.gif"
    });
    

    //mui弹出层禁止滑动页面
    mui("body").on("touchmove",".mui-popup-backdrop",function(){
        event.preventDefault();
        //return false;
    });
