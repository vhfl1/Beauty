/**
 * 
 */
$(function(){
	// 쇼핑계속하기
	$('.continue').click(function(){
		location.href="/Beauty/index";
	});
	
	// 주문상세보기
	$('.detail').click(function(){
		location.href="/Beauty/myshop/myorder";
	});
	
	// 더보기, 간단히보기
	$('.order').children('article.orderItem').slice(0,1).show();
	$('#more').click(function(){
		$(this).hide();
		$('#less').show();
		$('.order').children('article.orderItem').slideDown(200);
	});
	$('#less').click(function(){
		$(this).hide();
		$('#more').show();
		$('.order').children('article.orderItem').slice(1).slideUp(200);
	});
});