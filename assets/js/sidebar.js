function showCatelog(){
	$('#markdown-toc').hide();
	if(typeof $('#markdown-toc').html() === 'undefined') {
		$('.sidebar').removeClass('active');
	}
	else{
		$('.sidebar_catelog').html('<ul class="list_catelog">' + $('#markdown-toc').html() + '</ul>');
		$('div.sidebar').show();
	}
}

function locateCatelogList(){
	/*获取文章目录集合,可通过：header过滤器*/
	var alis = $('.article :header');
	/*获取侧边栏目录列表集合**/
	var sidebar_alis = $('.sidebar_catelog').find('a');
	/*获取滚动条到顶部的距离*/
	var scroll_height = $(window).scrollTop();
	for(var i =0;i<alis.length;i++){
		/*获取锚点集合中的元素分别到顶点的距离*/
		var a_height = $(alis[i]).offset().top-100;
		if (a_height<scroll_height){
			/*高亮显示*/
			sidebar_alis.removeClass('list_click');
			$(sidebar_alis[i]).addClass('list_click');
		}
	}
}

$(function() {
	showCatelog();

	/*给点击后的目录列表项添加list_click*/
	var alis = $('.sidebar_catelog').find('a');
	alis.click(function(){
		alis.removeClass('list_click');
		$(this).addClass('list_click');
	});

	/*绑定滚动事件 */ 
	$(window).bind('scroll',locateCatelogList);
});