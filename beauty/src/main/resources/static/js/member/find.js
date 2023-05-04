

$(function() {
	
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	
	
	let regPhone = /^\d{3}-\d{3,4}-\d{4}$/;
	let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	let regPass = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
	
	let checkEmail = false;
	let checkPhone = false;
	
	
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
	$('.close').click(function() {
		$(this).prev().val("");
		$(this).css('display', 'none');
	});
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

	///////////////////
	///// 아이디 찾기 ////
	///////////////////
	//휴대폰 유효성 검사
	$('input[name=phone]').focusout(function() {
		let phone = $(this).val();

		if (!phone.match(regPhone)) {
			checkPhone = false;
			$('.resultPhone').css('color', 'red').text('휴대폰 번호 형식이 맞지 않습니다.');
		} else {
			checkPhone = true;
			$('.resultPhone').css('color', 'green').text('유효한 휴대폰 입니다.');
		}
	});

	// 아이디 찾기
	$('.btnId').click(function() {

//		console.log('here1');

		let name = $('input[name=name]').val();
		let phone = $('input[name=phone]').val();

		let jsonData = {
			"name": name,
			"phone": phone
		};
		console.log(jsonData);
//		console.log('here2');
		$.ajax({
			url: '/Beauty/member/find1',
			type: 'post',
			data: jsonData,
			dataType: 'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success: function(data) {
				//				console.log('here3');
				if (data.result != null) {
					let uid = data.result;
					location.href = "/Beauty/member/findIdResult";
				} else {
					//					console.log('here4');
					alert('해당하는 사용자가 존재하지 않습니다.\n이름과 휴대폰 번호를 다시 확인하십시오.');
				}
			}
		});

		return false;
	});

	///////////////////
	////// 비번 찾기 /////
	///////////////////

	//email
	var code = null;
	$('.sendCode').click(function(e) {
		e.preventDefault();
		let email = $('input[name=uid]').val();
		if (email == '') {
			alert('이메일을 입력해주세요');
			return;
		}
		// 인증번호 타이머
		timer();
		$.ajax({
			url: '/Beauty/member/emailAuth',
			method: 'post',
			data: { "email": email },
			dataType: 'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success: function(data) {
				if (data.status > 0) {
					alert('인증번호가 발송되었습니다.');
					//메일전송 성공
					$('.auth').show();
					code = data.code;
				} else {
					//메일전송 실패
					alert('메일 전송에 실패했습니다. 다시 시도해주세요');
				}
			}
		});
	});

	//email code check
	$('.btnPw').click(function(e) {
		e.preventDefault();
		let insertCode = $('input[name=insertCode]').val();
		let receivedCode = $('input[name=insertCode]').val();
		//그냥 확인
		if (insertCode == '') {
			alert('인증번호를 입력해주세요.');
			return false;
		}
		//인증번호만 적고 확인
		if (code == null) {
			alert('인증번호를 발송해주세요');
			return false;
		}
		//인증번호 대조
		if (code == receivedCode) {
			//인증ㅇ
			alert('인증완료 되었습니다.');
			let uid = $('input[name=uid]').val();
			let jsonData = {
				"uid": uid
			};
			$.ajax({
				url: '/Beauty/member/find2',
				type: 'post',
				data: jsonData,
				dataType: 'json',
				beforeSend: function(xhr) {
					xhr.setRequestHeader(header, token);
				},
				success: function(data) {
					if (data == 1) {
						location.href = "/Beauty/member/findPwResult";
					} else {
						alert('해당하는 사용자가 존재하지 않습니다.\n아이디와 이메일을 다시 확인하십시오.');
					}
				}
			});
			return false;
		} else {
			//인증x
			alert('잘못된 인증번호입니다.');
			return false;
		}
	});


	
	

	// 인증번호 타이머
	function timer() {

		function $ComTimer() {
			//prototype extend
		}

		$ComTimer.prototype = {
			comSecond: ""
			, fnCallback: function() { }
			, timer: ""
			, domId: ""
			, fnTimer: function() {
				var m = Math.floor(this.comSecond / 60) + "분 " + (this.comSecond % 60) + "초";	// 남은 시간 계산
				this.comSecond--;					// 1초씩 감소
				console.log(m);
				this.domId.innerText = m;
				if (this.comSecond < 0) {			// 시간이 종료 되었으면..
					clearInterval(this.timer);		// 타이머 해제
					alert("인증시간이 초과하였습니다. 다시 인증해주시기 바랍니다.");
					window.close();
					window.opener.location = "/index.do"
				}
			}
			, fnStop: function() {
				clearInterval(this.timer);
			}
		}

		var AuthTimer = new $ComTimer()

		AuthTimer.comSecond = 180; // 제한 시간

		AuthTimer.fnCallback = function() { alert("다시인증을 시도해주세요.") }; // 제한 시간 만료 메세지

		AuthTimer.timer = setInterval(function() { AuthTimer.fnTimer() }, 1000);

		AuthTimer.domId = document.getElementById("timer");

	}
});