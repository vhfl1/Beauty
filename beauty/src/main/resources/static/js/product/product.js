/**
 * 
 */
$(function(){
	//제품 번호
	var prodNo = $('input[name=prodNo]').val();
	
	//csrf 토큰
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
		
	$('#itemInfo').click(function(e) {
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
			$(this).children().children('p').css({'height':'auto',"padding":"5px 0 15px 0"});
			$(this).children().children('.more').text('리뷰 접기');
		} else {
			$(this).children().children('p').css({'height':'54px',"padding":"0"});
			$(this).children().children('.more').text('... 더보기');
		}
	});
	
	//댓글 페이지 변수
	var pg = 1;
	
	//댓글 개수
	var totReview;
	$.ajax({
		url : '/Beauty/product/reviewCount/'+prodNo,
		method : "POST",
		async : false,
		dataType : "JSON",
		beforeSend: function(xhr){
	        xhr.setRequestHeader(header, token);
	    },
		success : function(data){
			totReview = data.result;
		}
	});
	
	//페이지 개수
	var lastPageNum = 1;
	if(totReview % 10 == 0)
		lastPageNum = Math.floor(totReview / 10);
	else
		lastPageNum = Math.floor(totReview / 10 + 1);
		
	paging();
	function paging(){
		for(let i=1; i<=lastPageNum; i++){
			let num = pg == i ? 'clickReplyPage now' : 'clickReplyPage';
			let tag = "<a href='#d3' class='"+num+"'>"+i+"</a>"
			$('.replyPage').append(tag);
		}
	}
	
	$(document).on('click','.clickReplyPage',function(){
		pg = $(this).text();
		$('.clickReplyPage ').removeClass("now");
		$(this).addClass("now");
		getReview();
	});
	
	
	//댓글 정렬
	$('.orderby').click(function() {
		$('.orderby').removeClass('sold');
		$(this).addClass('sold');
		pg = 1;
		getReview();
		$('.clickReplyPage').removeClass("now");
		$('.clickReplyPage').filter(':first-child').addClass("now");
	});
	
	//해당 제품의 댓글
	$('#itemReview').click(function(){
		getReview();
	});
	
	//리뷰가져오기
	function getReview(){
		let orderBy = $('.sold').text();
		if(orderBy == "최신순"){
			orderBy = "ORDER BY `rdate` DESC"
		}else if(orderBy == "평점순"){
			orderBy = "ORDER BY `rating` DESC"
		}else if(orderBy == "추천순"){
			orderBy = "ORDER BY `no` DESC"
		}
		let jsonData = {
			'prodNo' : prodNo,
			'orderBy' : orderBy,
			'pg' : pg
		}
		$.ajax({
			url : '/Beauty/product/review',
			method : "POST",
			data : jsonData,
			dataType : "JSON",
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success : function(data){
				$('.review').remove();
				if(data.result.length){
					for(let i of data.result){
						let tag = "<article class='review'>";
							tag += "<span class='heart"+i.rating+"'></span><p class='writer'>작성자<br/><span>"+i.maskName+"</span></p>";
							tag += "<section>";
							tag += "<p>"+i.content+"</p>";
							tag += "<span class='more'>... 더보기</span>";
							tag += "</section></article>";
						$('.reply').append(tag);
					}
				}else{
					let tag = "<article class='review emptyReview'>등록된 댓글이 없습니다.</article>";
					$('.reply').append(tag);
				}
			}
		});
	}
	
	
	
});