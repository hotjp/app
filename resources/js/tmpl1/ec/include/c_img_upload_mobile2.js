
$(function(){
    $("[id^='J_UploaderBtn']").each(function(i,o){
        var id = $(this).attr("id");
        initUploader("#" + id, this);
    });
    mui.init();
});