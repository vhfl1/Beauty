


$(function() {
	
	let regPhone = /^\d{3}-\d{3,4}-\d{4}$/;
	
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	
	$('.member').click(function() {
		$('.m1').css('display', 'block');
		$('.m2').css('display', 'none');
		$('.member').addClass('current');
		$('.nomember').removeClass('current');
	});
	$('.nomember').click(function() {
		$('.m2').css('display', 'block');
		$('.m1').css('display', 'none');
		$('.nomember').addClass('current');
		$('.member').removeClass('current');
	});
	$('.findId').click(function() {
		$('.m1').css('display', 'block');
		$('.m2').css('display', 'none');
		$('.findId').addClass('current');
		$('.findPw').removeClass('current');
	});
	$('.findPw').click(function() {
		$('.m2').css('display', 'block');
		$('.m1').css('display', 'none');
		$('.findPw').addClass('current');
		$('.findId').removeClass('current');
	});
	$('input[name=uid]').keydown(function() {
		if ($(this).val().trim() != "") {
			$(this).next().css('display', 'block');
		} else {
			$(this).next().css('display', 'none');
		}
	});
	$('input[name=name]').keydown(function() {
		if ($(this).val().trim() != "") {
			$(this).next().css('display', 'block');
		} else {
			$(this).next().css('display', 'none');
		}
	});
	
	// 내용 삭제
	$('.close').click(function() {
		$(this).prev().val("");
		$(this).css('display', 'none');
	});
	
	// 숨긴 비밀번호 보기
	$('.eye').click(function() {
		let t = $(this).text();
		if (t == "visibility_off") {
			$(this).text("visibility");
			$('input[name=password]').attr('type', 'text');
		} else {
			$(this).text("visibility_off");
			$('input[name=password]').attr('type', 'password');
		}
	});


	// 로그인
	$('button[name=login]').click(function() {
		//console.log('here1');
		let login = $(this).val();
		let uid = $('input[name=uid]').val().trim();
		let pass = $('input[name=password]').val().trim();
		if (uid == '') {
			alert('아이디를 입력해주세요');
			return false;
		}
		if (pass == '') {
			alert('비밀번호를 입력해주세요');
			return false;
		}
	});
	
	//로그인 성공
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	var patId = getParameterByName('success');
	console.log(patId);
	if (patId == '101') {
		let tag = "<span class='error'>아이디와 비밀번호가 틀렸습니다. 다시 한번 확인해주세요.</span>";
		$('#l1').after(tag);
	}
	
	
	// 비회원 주문조회
	$('.joinNonOrder').click(function(){
		
		let name = $('input[name=name]').val();
		let phone = $('input[name=phone]').val();
		let orderNumber = $('input[name=orderNumber]').val();
		
		let jsonData = {
			"name": name,
			"phone": phone,
			"orderNumber": orderNumber
		};
		/*
		console.log("hr1 : " + name);
		console.log("hr2 : " + phone);
		console.log("hr3 : " + orderNumber);
		*/
		// 공백시  팝업
		if (name == '') {
			alert('이름을 입력해주세요.');
			return false;
		}
		if (phone == '') {
			alert('휴대폰 번호를 입력해주세요.');
			return false;
		}
		if (orderNumber == '') {
			alert('주문번호를 입력해주세요.');
			return false;
		}
		//alert('here2');
		$.ajax({
			url: '/Beauty/member/nonOrder',
			method: 'post',
			data: jsonData,
			dataType: 'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
		    success: function(data){
				if(data.result){
					//alert('here4');
					location.href="/Beauty/member/joinNonOrder";
				}else{
					alert('일치하는 주문정보가 없습니다\n 확인 후 다시 입력해 주세요.');
				}
			}
		});
		
		
	});

});