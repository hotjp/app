fis.set('project.fileType.text', 'jt, jh');

var root = "";



//通用
//引入依赖
fis.match('::packager', {
  spriter: fis.plugin('csssprites'),
  postpackager: fis.plugin('loader')
});

//less编译
fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
});

// fis.media('rext').match('*.ftl', {

//   rExt: '.jh'
// });
// fis.media('rext').match('{temp/*.ftl,include/*.ftl}', {

//   rExt: '.jt'
// });

fis.match('*.jh', {
  rExt: '.html'
});


fis.match('*', {
	useHash: false
});

fis.match('README.md', {
    release: false
});



// 打包配置
// fis3 release dist -d URL   即可打包

fis.media('dist').match('*', {
  release: root + '$0'
});

// fis.media('dist').match('::packgager', {
//   postpackager: fis.plugin('loader', {
//     allInOne: true
//   })
// });
// hash更新缓存
fis.media('dist').match('*.{js,css,less,png,jh,jt}', {
  useHash: true
});
fis.media('dist').match('{module/**,/index.html,goods/index.jh}', {
  useHash: false
});
fis.media('dist').match('README.md', {
    release: false
});
// js压缩
fis.media('dist').match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩
  optimizer: fis.plugin('uglify-js')
});
// css压缩
fis.media('dist').match('*.css', {
	//雪碧图
	useSprite: true,
  // fis-optimizer-clean-css 插件进行压缩
  optimizer: fis.plugin('clean-css')
});
//png压缩
fis.media('dist').match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩
  optimizer: fis.plugin('png-compressor')
});
