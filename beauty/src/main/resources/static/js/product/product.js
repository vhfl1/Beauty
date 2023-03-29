/**
 * 
 */
$(function(){
	$('#itemInfo').click(function() {
		$('.detail').children().children().children().attr('class', 'off');
		$(this).addClass('current');
		$('#d1').css('display', 'block');
		$('#d2').css('display', 'none');
		$('#d3').css('display', 'none');
		$('#d4').css('display', 'none');
	});
	$('#shopGuide').click(function() {
		$('.detail').children().children().children().attr('class', 'off');
		$(this).addClass('current');
		$('#d1').css('display', 'none');
		$('#d2').css('display', 'block');
		$('#d3').css('display', 'none');
		$('#d4').css('display', 'none');
	});
	$('#itemReview').click(function() {
		$('.detail').children().children().children().attr('class', 'off');
		$(this).addClass('current');
		$('#d1').css('display', 'none');
		$('#d2').css('display', 'none');
		$('#d3').css('display', 'block');
		$('#d4').css('display', 'none');
	});
	$('#itemQna').click(function() {
		$('.detail').children().children().children().attr('class', 'off');
		$(this).addClass('current');
		$('#d1').css('display', 'none');
		$('#d2').css('display', 'none');
		$('#d3').css('display', 'none');
		$('#d4').css('display', 'block');
	});
	$(document).on('click', 'article.review', function() {
		let txt = $(this).children().children('.more').text();
		if (txt == "... 더보기") {
			$(this).children().children('p').css('height', 'auto');
			$(this).children().children('.more').text('리뷰 접기');
		} else {
			$(this).children().children('p').css('height', '55px');
			$(this).children().children('.more').text('... 더보기');
		}
	});
	$('.orderby').click(function() {
		$('.orderby').removeClass('sold');
		$(this).addClass('sold');
	});
});