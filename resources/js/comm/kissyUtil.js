function initUploader(uploaderSelector, holder) {
    var S = KISSY,
        path = vars.root + "/resources/js/module/kissy/kissy-form-1.3/";
    S.config({
        packages: [{
            name: "gallery",
            path: path,
            charset: "utf-8"
        }]
    });

    //加载上传组件入口文件
    KISSY.use('gallery/form/1.3/uploader/imageUploader', function (S, ImageUploader) {
        var uploader = new ImageUploader(uploaderSelector);
        holder.uploader = uploader;
        uploader.on('cancel', function (ev) {
            holder.uploading = (holder.uploading || 0) - 1;
        });
        uploader.on('start', function (ev) {
            holder.uploading = (holder.uploading || 0) + 1;
        });
        uploader.on('complete', function (ev) {
            holder.uploading = (holder.uploading || 0) - 1;
        });
        uploader.render();
    });
}

