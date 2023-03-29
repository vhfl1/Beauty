$(function(){
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	/* 진입전 비밀번호 확인 */
	$('#btnCheckPW').click(function(e){
		e.preventDefault();
		let pass = $('#pass').val();
		$.ajax({
			url		:'/Beauty/myshop/checkPW',
			type	:'POST',
			data	:{'pass': pass},
			dataType:'json',
			beforeSend: function(xhr){
        		xhr.setRequestHeader(header, token);
		    },
			success	:function(data){
				if(data == 1){
					$('div.checkPassword').hide();
					$('div.profileInfo').show();
				}else{
					alert('비밀번호가 일치하지 않습니다.');
					$('#pass').val('').focus();
				}
			}
		});
		
	});
	
	/* 비밀번호 수정 */
	$('#savePassword').click(function(){
		let pass = $('#pw2').val();
		$.ajax({
			url		:'/Beauty/myshop/savePassword',
			type	:'POST',
			data	:{'pass': pass},
			dataType:'json',
			beforeSend: function(xhr){
        		xhr.setRequestHeader(header, token);
		    },
			success	:function(data){
				if(data == 1){
					alert('변경되었습니다.');
					location.href="/Beauty/myshop/profile";
				}else{
					alert('변경에 실패했습니다.');
				}
			}
		});
	});
	
	
	/* 정보수정 */
	$('div.profileBtns > .apply').click(function(e){
		e.preventDefault();
		
		let phone 	= $('#phone1').val() + '-' + $('#phone2').val() + '-' + $('#phone2').val();
		let zip 	= $('#zip').val();
		let addr1 	= $('#addr1').val();
		let addr2 	= $('#addr2').val();
		let height 	= $('#height').val();
		let weight 	= $('#weight').val();
		let vo = {
			'phone':phone,
			'zip':zip,
			'addr1':addr1,
			'addr2':addr2,
			'height':height,
			'weight':weight
		}
		
		$.ajax({
			url		:'/Beauty/myshop/updateMember',
			type	:'POST',
			data	: JSON.stringify(vo),
			dataType:'json',
			contentType: 'application/json',
			beforeSend: function(xhr){
        		xhr.setRequestHeader(header, token);
		    },
			success	:function(data){
				if(data == 1){
					alert('변경완료');
					location.href="/Beauty/myshop/profile"
				}else{
					alert('비밀번호가 일치하지 않습니다.');
				}
			}
		});
		
	});
	
	
	/* 회원탈퇴 */
	$('div.profileBtns > .deleteAcc').click(function(e){
		e.preventDefault();
		if(confirm('정말 삭제하시겠습니까?')) {
			$.ajax({
				url		:'/Beauty/myshop/deleteMember',
				type	:'POST',
				data	:{},
				dataType:'json',
				beforeSend: function(xhr){
	        		xhr.setRequestHeader(header, token);
			    },
				success	:function(data){
					if(data == 1){
						alert('삭제 되었습니다.');
						location.href="/Beauty";
					}else{
						alert('오류가 발생했습니다.');
					}
				}
			});
		}
	});
	
	

});