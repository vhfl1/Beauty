$(function(){
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	totalPrice();
	
    /* total Table에 쓰이는 변수 */
    let headCnt	= 0;
    let count 	= 0;
	let price 	= 0;
	let delivery= '2,500';
	let disPrice= 0;
	let total 	= 0;
    
	/* 체크박스 처리*/
	/* 전체선택시 */
	$('input[name=chkAll]').click(function(){
		let checkList = $('input[name=chkCart]');
		if($(this).is(":checked")){
		    checkList.prop("checked", true);
		}else{
		    checkList.prop("checked", false);
		}
		check();
	});
	/* 개별선택 -> 모두 체크한 경우 전체선택 자동체크 */
	$('input[name=chkCart]').click(function(){
		let isAll = true;
		$("input[name=chkCart]").each(function(){
	        isAll = isAll && $(this).is(":checked");
	    });
	    $('input[name=chkAll]').prop("checked", isAll);
	    check();
	});
	/* 전부 체크 해제인 경우*/
	function check() {
		if ($("input:checkbox[name='chkCart']").is(":checked")==false) {
			/* 전부 선택 합계 */
			sumAll();
		}else {
			/* 개별 선택 합계 */
			sumChecked();
		}
	}
	
	/* 수량증가 */
	$('#wrap table a.btnIncrease').click(function(e){
		e.preventDefault();
		let amount = $(this).prev().val();
		if(amount==10){ 
			alert('10개 초과로 주문할 수 없습니다.');
			return;
		}
		
		let icount = makeNum($(this).prev().val())+1;
		let iprice = makeNum($(this).parent().parent().parent().children('td:nth-child(4)').children('span.price').text());
		$(this).prev().val(icount);
		$('#totalCount').val(icount);
		totalPrice();
		$(this).parent().parent().parent().children('td:nth-child(6)').children('span').text((iprice*icount).toLocaleString());
		
		let cartNo = $(this).parent().parent().parent().children('td:nth-child(1)').children('input[type=checkbox]').val();
		$.ajax({
			url:'/Beauty/order/cartIncrease',
			type:'POST',
			data:{'cartNo': cartNo},
			dataType:'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    }
		});
	});
	
	/* 수량감소 */
	$('#wrap table a.btnDecrease').click(function(e){
		e.preventDefault();
		let amount = $(this).prev().prev().val();
		if(amount == 1){ 
			alert('1개 이상 주문해야합니다.');
			return;
		}
		
		let icount = makeNum($(this).prev().prev().val())-1;
		let iprice = makeNum($(this).parent().parent().parent().children('td:nth-child(4)').children('span.price').text());
		$(this).prev().prev().val(icount);
		$('#totalCount').val(icount);
		totalPrice();
		$(this).parent().parent().parent().children('td:nth-child(6)').children('span').text((iprice*icount).toLocaleString());
		
		let cartNo = $(this).parent().parent().parent().children('td:nth-child(1)').children('input[type=checkbox]').val();
		$.ajax({
			url:'/Beauty/order/cartDecrease',
			type:'POST',
			data:{'cartNo': cartNo},
			dataType:'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    }
		});
	});
	
	

	/* tableBtns */
	/* 주문하기 */
	$('div.cartFrame > article.cartList > table > tbody td > a.btnTableOrder').click(function(e){
		e.preventDefault();
		let chkList = [];
		chkList.push(parseInt($(this).parent().parent().children('td:first-child').children('input').val()));
		redirectGet('/Beauty/order/orderform', chkList);
	});

	/* 삭제 */
	$('div.cartFrame > article.cartList > table > tbody td > a.btnTableDelete').click(function(e){
		e.preventDefault();
		let tr = $(this).parent().parent();
		let cartNo = parseInt($(this).parent().parent().children('td:first-child').children('input').val());
		$.ajax({
			url:'/Beauty/order/deleteSelectedCart',
			type:'GET',
			data:{'cartNo': cartNo},
			dataType:'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success:function(data){
				if(data == 1){
					//장바구니 개수 변경, 가격 반영, 행 삭제
					tr.remove();
					$('#headCount').text($('article.cartList > table > tbody').children().length);
					$("input:checkbox[name='chkAll']").prop("checked", false);
					totalPrice();
					//테이블이 비었으면
					if($('article.cartList > table > tbody').children().length == 0){
						emptyTable();
					}
				}else{
				}
			}
		});
	});

	/* cartBtns */
	/* 카트비우기 */
	$('#btnDeleteAllCart').click(function(e){
		e.preventDefault();
		if ($("input[name='chkCart']").length == 0) {
			alert('장바구니에 상품이 없습니다.');
			return;
		}
		if(confirm('장바구니를 비우시겠습니까?')){
			$.ajax({
				url:'/Beauty/order/deleteAllCart',
				type:'POST',
				data:{},
				dataType:'json',
					beforeSend: function(xhr){
			        xhr.setRequestHeader(header, token);
			    },
				success:function(data){
					if(data == 1){
						//장바구니 개수 변경
						$('#headCount').text('0');
						//가격 반영, 체크박스 해제(전체선택만), 자식비우기, 비움 알림
						totalPrice();
						$("input:checkbox[name='chkAll']").prop("checked", false);
						$('.t1 > tbody').empty();
						emptyTable();
					}else{
					}
				}
			});
		}else{
			return;
		}
	});
	/* 카트 선택 삭제 */
	$('#btnDeleteSelectedCart').click(function(e){
		e.preventDefault();
		if ($("input[name='chkCart']").length == 0) {
			alert('장바구니에 상품이 없습니다.');
			return;
		}
		if ($("input:checkbox[name='chkCart']").is(":checked")==false) {
			/* 선택 안 한 경우 */
			alert('삭제하실 상품을 선택해주세요.');
			return;
		}
		let chkList = [];
		$('input[name=chkCart]').each(function(){
			if($(this).is(":checked")){
				chkList.push(parseInt($(this).val()));
			}
		});
		$.ajax({
			url:'/Beauty/order/deleteSelectedCart',
			type:'POST',
			data:{'chkList': chkList},
			dataType:'json',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success:function(data){
				if(data == 1){
					for(let chk of chkList){
						//선택된 테이블 삭제
						$('input[name=chkCart]').each(function(){
							if(parseInt($(this).val()) == chk){
								$(this).parent().parent().remove();
							}
						});
					}
					//장바구니 개수 변경, 가격 반영
					$('#headCount').text($('article.cartList > table > tbody').children().length);
					totalPrice();
					//테이블이 비었으면 전체선택 해제, 비움 알림
					if($('article.cartList > table > tbody').children().length == 0){
						$("input:checkbox[name='chkAll']").prop("checked", false);
						emptyTable();
					}
				}else{
					alert('1개보다 작게 설정할 수 없습니다.');
				}
			}
		});
	});
	
	/* cartBtns Order */
	/* 선택주문하기 */
	$('#btnOrderSelect').click(function(e){
		e.preventDefault();
		if ($("input[name='chkCart']").length == 0) {
			alert('장바구니에 상품이 없습니다.');
			return;
		}
		if ($("input:checkbox[name='chkCart']").is(":checked")==false) {
			/* 선택 안 한 경우 */
			alert('주문하실 상품을 선택해주세요.');
			return;
		}
		let chkList = [];
		$('input[name=chkCart]').each(function(){
			if($(this).is(":checked")){
				chkList.push(parseInt($(this).val()));
			}
		});
		redirectGet('/Beauty/order/orderWait', chkList);
	});
	/* 전체주문하기 */
	$('#btnOrderAll').click(function(e){
		e.preventDefault();
		if ($("input[name='chkCart']").length == 0) {
			alert('장바구니에 상품이 없습니다.');
			return;
		}
		let chkList = [];
		$('input[name=chkCart]').each(function(){
			chkList.push(parseInt($(this).val()));
		});
		redirectGet('/Beauty/order/orderWait', chkList);
	});
	
	
	
	
	
	
	
	
	/* 빈 카트 */
	function emptyTable(){
		//카트 비었으면
		//테이블, 토탈테이블 삭제, div.emptyCart 삽입
		let tag = "<tr><td colspan='8'>장바구니에 담긴 상품이 없습니다.</td></tr>";
		$('.t1 > tbody').append(tag);
		$('.totalTable').remove();
	}

	/* 선택 구분 함수 */	
	function sumChecked(){
		initVal();
		$('input[name=chkCart]').each(function(){
			if($(this).is(":checked")){
				sum($(this));
			}
		});
		checkDelivery();
		inputTotal();
	}
	function sumAll(){
		initVal();
		$('input[name=chkCart]').each(function(){
			sum($(this));
		});
		checkDelivery();
		inputTotal();
	}
	
	/* 실제 기능 구현 함수 */
	function makeNum(nanValue){
		return parseInt(nanValue.split(',').join(""));
	}
	function initVal(){
		headCnt = 0;
		count 	= 0;
		price 	= 0;
		delivery= '2,500';
		disPrice= 0;
		total 	= 0;
	}
	function sum(arg){
		let tds = arg.parent().parent().children();
		headCnt += 1;
		count 	= makeNum(tds[4].children[0].children[0].value);
		price 	+= (makeNum(tds[3].children[0].innerText) * count);
		if(tds[3].children[1] != null){
			disPrice += ( (makeNum(tds[3].children[0].innerText)-makeNum(tds[3].children[2].innerText) ) * count );
		}
		total 	+= makeNum(tds[6].children[0].innerText);
	}
	function checkDelivery(){
		if(total >= 50000){
			delivery = '무료';
		}else{
			delivery = '2,500원';
			total += 2500;
		}
	}
	function inputTotal(){
		$('#totalCount').text(headCnt);
		$('#totalPrice').text(price.toLocaleString()+'원');
		$('#totalDelivery').text(delivery);
		$('#totalDisPrice').text(disPrice.toLocaleString()+'원');
		$('#totalTotalPrice').text(total.toLocaleString()+'원');
	}
	
	/* form 전송 */
	function redirectGet(location, args){
		let form = $('<form></form>');
        form.attr("method", "get");
        form.attr("action", location);
        
        $.each(args, function (index, value) {
            let field = $('<input></input>');
            
            field.attr('type', 'hidden');
            field.attr("name", 'cartNo');
            field.attr("value", value);
            
            form.append(field);
        });
        
        $(form).appendTo('body').submit();
	}
	
	//주문금액 합계 계산기
    function totalPrice(){
    	var totalOriPrice = 0;
    	var deliveryPrice = 2500;
    	var totalDisprice = 0;
    	var totalPrice = 0;
    	
    	$('.tdTotal').each(function(index, item){
    		let num1 = $(item).children('.oriPrice').text().split(',').join("");;
    		let num2 = $(item).children('.price').text().split(',').join("");;
    		let num3 = $(item).children('input[type=hidden]').val();
    		if(num1 == ''){
    			totalOriPrice = Number(totalOriPrice) + Number(num2 * num3);
    		}else{
    			totalOriPrice = Number(totalOriPrice) + Number(num1 * num3);
    			totalDisprice = Number(totalDisprice) + (Number(num1 - num2) * Number(num3));
    		}
    	});
    	
    	totalPrice = Number(totalOriPrice - totalDisprice);
    	if(totalPrice <= 50000){
    		totalPrice += deliveryPrice;
        	$('#totalDelivery').text(Number(deliveryPrice).toLocaleString('ko-KR')+ "원");
        	$('.deliveryInfo').children('span:first-child').text('2,500원');
    	}else{
        	$('#totalDelivery').text(0 + "원");
        	$('.deliveryInfo').children('span:first-child').text('무료');
    	}
    	
    	$('#totalPrice').text(Number(totalOriPrice).toLocaleString('ko-KR') + "원");
    	$('#totalDisPrice').text(Number(totalDisprice).toLocaleString('ko-KR') + "원");
    	$('#totalTotalPrice').text(Number(totalPrice).toLocaleString('ko-KR') + "원");
    }

});