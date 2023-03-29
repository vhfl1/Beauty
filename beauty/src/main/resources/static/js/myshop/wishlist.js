$(function(){
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	/* 위시리스트 전체삭제 */
	$('.wishListFrame > div.wishListHead > a.deleteAllWish').click(function(e){
		e.preventDefault();
		if(confirm('위시리스트를 비우시겠습니까?')){
			$.ajax({
				url		:'/Beauty/myshop/deleteAllWish',
				type	:'POST',
				beforeSend: function(xhr){
	        		xhr.setRequestHeader(header, token);
			    },
				success	:function(data){
					if(data == 1){
						$('.wishListFrame > article.wishList').empty();
						$('#headCount').text("0");
						$('.wishListFrame > article.wishList').append('<div class="emptyWish">찜한 상품이 없습니다.</div>');
					}
				}
			});
		}else{
			return;
		}
	});

});