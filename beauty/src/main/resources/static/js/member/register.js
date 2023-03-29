/**
 * 날짜 : 2023/03/07
 * 이름 : 강중현 
 * 내용 : Beauty member register js
 */


$(function() {
	
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	
	//정규식
	//let regUid   = /^[a-z]+[a-z0-9]{3,12}$/g;
	let regName = /^[가-힣]{2,4}$/;
	let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	let regPhone = /^\d{3}-\d{3,4}-\d{4}$/;
	let regPass = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
	// 폼 데이터 검증 결과 상태변수
	//let checkUid    = false;
	let checkPass = false;
	let checkName = false;
	let checkPhone = false;
	let checkEmail = false;

	// 이메일 유효성 검사
	$('input[name=uid]').focusout(function() {
		let email = $(this).val();
		if (!email.match(regEmail)) {
			checkEmail = false;
			$('.resultUid').css('color', 'red').text('이메일이 유효하지 않습니다.');
		} else {
			checkEmail = true;
			$('.resultUid').css('color', 'green').text('유효한 이메일 입니다.');
		}
	});

	// 비밀번호 유효성 검사
	$('input[name=pass2]').focusout(function() {
		checkPass = false;
		let pass1 = $('input[name=pass1]').val();
		let pass2 = $(this).val();

		if (pass1 == pass2) {
			if (pass1.match(regPass)) {
				$('.resultPass').css('color', 'green').text('비밀번호가 일치합니다.');
				checkPass = true;
			} else {
				$('.resultPass').css('color', 'red').text('영문, 숫자, 특수문자를 조합하여 8~12자까지 설정해주세요.');
			}
		} else {
			$('.resultPass').css('color', 'red').text('비밀번호가 일치하지 않습니다.');
		}
	});

	// 이름 유효성 검증
	$('input[name=name]').focusout(function() {
		let name = $(this).val();

		if (!name.match(regName)) {
			checkName = false;
			$('.resultName').css('color', 'red').text('이름은 한글 2자 이상 이어야 합니다.');
		} else {
			checkName = true;
			$('.resultName').css('color', 'green').text('이름은 한글 2자 이상 이어야 합니다.');
		}
	});

	// 휴대폰 유효성 검사
	$('input[name=phone]').focusout(function() {
		let phone = $(this).val();

		if (!phone.match(regPhone)) {
			checkPhone = false;
			$('.resultPhone').css('color', 'red').text('휴대폰이 유효하지 않습니다.');
		} else {
			checkPhone = true;
			$('.resultPhone').css('color', 'green').text('유효한 휴대폰 입니다.');
		}
	});
	$('.mb > form').submit(function() {
		////////////////////////////////////
		// 폼 데이터 유효성 검증(Validation)
		////////////////////////////////////
		//비밀번호 검증
		if (!checkPass) {
			alert('비밀번호를 확인 하십시오.');
			return false;
		}
		//이름 검증
		if (!checkName) {
			alert('이름을 확인 하십시오.');
			return false;
		}
		//이메일 검증
		if (!checkEmail) {
			alert('이메일을 확인 하십시오.');
			return false;
		}
		//휴대폰 검증
		if (!checkPhone) {
			alert('휴대폰을 확인 하십시오.');
			return false;
		}
		//최종 전송
		return true;
	});


	// 체크박스 전체 선택, 해제
	$('#checkAll').click(function() {
		let checked = $(this).is(':checked');
		if (checked) {
			$('input:checkbox[name=agree]').prop('checked', true);
		} else {
			$('input:checkbox[name=agree]').prop('checked', false);
		}
	});

	// 개별체크 선택 및 해제시 전체 체크 활성 및 비활성
	$('input:checkbox[name=agree]').click(function() {
		let checked = $('input:checkbox[name=agree]:checked').length;
		// console.log(checked);
		let size = $('input[name=agree]').length;
		if (checked == size) {
			$('#checkAll').prop('checked', true);
		} else {
			$('#checkAll').prop('checked', false);
		}
	});


	///////////////////
	////// 이메일 인증 /////
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
	$('.btn-terms').click(function() {
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
			alert('가입이 완료되었습니다.');
			location.href = "/Beauty/login/";
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