require.config({
	baseUrl:"/resources/js/module",
	paths:{
		"jquery"			:["jquery/jquery"],
		"mui"				:["mui/mui"],
		"jquery.vaidate"	:["jquery/jquery.validate.min"],
		"jquery.autoresize"	:["jquery/autoresize.min"],
		"mui.lazyload"		:["mui/mui.lazyload"],
		"mui.dtpicker"		:["mui/mui.dtpicker"],
		"mui.imageViewer"	:["mui/mui.imageViewer"],
		"mui.listpicker"	:["mui/mui.listpicker"],
		"mui.picker.all"	:["mui/mui.picker.all"],
		"mui.poppicker"		:["mui/mui.poppicker"],
		"mui.previewimage"	:["mui/mui.previewimage"],
		"mui.pullToRefresh"	:["mui/mui.pullToRefresh"],
		"mui.view"			:["mui/mui.view"],
		"mui.zoom"			:["mui/mui.zoom"]
	},
	shim:{
		"jquery.vaidate"	:["jquery"],
		"jquery.autoresize"	:["jquery"],
		"mui.lazyload"		:["mui"],
		"mui.dtpicker"		:["mui"],
		"mui.imageViewer"	:["mui"],
		"mui.listpicker"	:["mui"],
		"mui.picker.all"	:["mui"],
		"mui.poppicker"		:["mui"],
		"mui.previewimage"	:["mui"],
		"mui.pullToRefresh"	:["mui"],
		"mui.view"			:["mui"],
		"mui.zoom"			:["mui"]
	}
});
console.log("config is done")