

$(function() {
	
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	
	
	let regPhone = /^\d{3}-\d{3,4}-\d{4}$/;
	let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	let regPass = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
	
	let checkEmail = false;
	let checkPhone = false;
	
	
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


	// 비밀번호 변경
	$('.changePw').click(function(e) {
		e.preventDefault();

		let uid = $('.uid').text();
		let pass1 = $('input[name=pass1]').val();
		let pass2 = $('input[name=pass2]').val();

		console.log("hr1 : " + pass1);
		console.log("hr2 : " + pass2);

		if (pass1 != pass2) {
			alert('비밀번호가 일치하지 않습니다.\n다시 입력해주세요.');
			return;
		}
		console.log("hr3");

		if (!pass2.match(regPass)) {
			alert('영문, 숫자, 특수문자 조합하여 8~12자이어야 합니다.');
			return;
		}

		let jsonData = {
			"uid": uid,
			"pass": pass2
		};
		console.log(jsonData);

		$.ajax({
			url: '/Beauty/member/findPwResult',
			type: 'post',
			data: jsonData,
			dataType: 'json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader(header, token);
			},
			success: function(data) {
				console.log("hr4 : " + JSON.stringify(data))

				if (data.result == 1) {
					console.log("hr5")
					alert('비밀번호가 변경되었습니다.\n다시 로그인 하십시오.');
					location.href = "/Beauty/member/login";
				}else{
					alert("변경에 실패했습니다. 잠시후에 다시 시도해주세요.");
					return false;
				}
			}
		});
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