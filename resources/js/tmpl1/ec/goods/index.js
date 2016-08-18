mui.init();
var slider = mui("#slider");
mui.plusReady(function () {
    plus.navigator.closeSplashscreen();
});

$(function () {

    mt = 150
    $(document).scroll(function () {//距离顶部mt显示按钮
        $top = $(window).scrollTop()
        if ($top > mt) {
            $("#header").css({
                'background-color': 'rgba(0,0,0,0.8)'
            });
            $("#header input[type=search]").css({
                'background-color': 'rgba(255,255,255,1)'
            });
        } else {
            $("#header").css({
                'background-color': 'rgba(0,0,0,0)'
            });
            $("#header input[type=search]").css({
                'background-color': 'rgba(255,255,255,0.8)'

            });
        }
    });



})
