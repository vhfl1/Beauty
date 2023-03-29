$(function(){
    var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	
    let selectedRow;
    
    /* 옵션변경모달버튼 */
    $('button.openOption').click(function(){
		//선택된 행 저장
		selectedRow = $(this).parent().parent().parent();
		//선택한 카트번호로 상품 색상값 조회
		let cartNo = Number($(this).parent().parent().prev().prev().children('input').val());
		let prodNo = $(this).parent().parent().parent().children('td:last-child').children('input').val();
		$('#modalCartNo').val(cartNo);
		$('#modalProdNo').val(prodNo);
		$.ajax({
			url:'/Beauty/order/openOption',
			type:'POST',
			data: {'cartNo':cartNo},
			dataType:'text',
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			success:function(data){
				//값 구분 후 추가
				$('#optionTable div.color').empty();
				let colors = data.split(',');
				colors.forEach((color, index) => {
					$('#optionTable div.color').append('<input type="radio" name="chkColor" id="color'+ index +'" value="'+color+'">');
					$('#optionTable div.color').append('<label for="color'+ index +'">'+color+'</label> ');
				});
			}
		});
		//다른 곳 클릭 다시 열었을 때 선택방지용 초기화
		$('#optionTable td > div.size > input[name=chkSize]').prop('disabled', 'disabled');
        $('#optionTable td > div.size > input[name=chkSize]').prop('checked', false);
	});
    
    
    /* 색상 선택시 */
   	//체크용 변수들
    let prevChkColor = -1;
    let prevChkSize = -1;
    let index;
    $(document).on('click', '#optionTable td > div.color > input[name=chkColor]', function() {
		//색상선택기능 (선택, 선택해제)
        index = $(this).index('input[name=chkColor]');
        if(prevChkColor == index){
            $(this).prop('checked', false);
            prevChkColor = -1;
        }else{
            prevChkColor = index;
        }
        
        //색상 선택, 선택 해제시 기능
        let isChecked = $('#optionTable td > div.color > input[name=chkColor]').is(':checked');
        if(isChecked){
			//선택시 색상값으로 선택 가능 사이즈 조회, 정렬문제때문에 버튼은 미리 생성해둠, 품절은 SQL문에서 미리 제외함.
            let cartNo	= Number($('#modalProdNo').val());
            let color 	= $(this).val();
            $.ajax({
				url:'/Beauty/order/selectOption',
				type:'POST',
				data: {
					'cartNo':cartNo,
					'color'	:color
				},
				dataType:'text',
				beforeSend: function(xhr){
			        xhr.setRequestHeader(header, token);
			    },
				success:function(data){
					//버튼 초기화
					$('#optionTable td > div.size > input[name=chkSize]').prop('disabled', 'disabled');
					//값 구분 후 활성화
					let sizes = data.split(',');
					for (size of sizes){
						$('#optionTable td > div.size > input[name=chkSize][value='+size+']').prop('disabled', false);
					}
				}
			});
        }else{
			//선택해제시
            $('#optionTable td > div.size > input[name=chkSize]').prop('disabled', 'disabled');
            $('#optionTable td > div.size > input[name=chkSize]').prop('checked', false);
            prevChkColor = -1;
            prevChkSize = -1;
        }
	});
    

    $('#optionTable td > div.size > input[name=chkSize]').click(function(){
        //사이즈선택기능 (선택, 선택해제)
        index = $(this).index('input[name=chkSize]');
        if(prevChkSize == index){
            $(this).prop('checked', false);
            prevChkSize = -1;
        }else{
            prevChkSize = index;
        }
    });
    
    
    /* 옵션변경확인버튼 */
	$('#saveOption').click(function(){
		if($('#optionTable td > div.size > input[name=chkSize]').is(':checked')){
            let color = $('#optionTable td > div.color > input[name=chkColor]:checked').val();
            let size = $('#optionTable td > div.size > input[name=chkSize]:checked').val();
			let cartNo = $('#modalCartNo').val();
			let vo = {
				'cartNo':cartNo,
				'color'	:color,
				'size'	:size
			}
			
            $.ajax({
				url:'/Beauty/order/saveOption',
				type:'POST',
				data: JSON.stringify(vo),
				dataType:'json',
				contentType: 'application/json',
				beforeSend: function(xhr){
			        xhr.setRequestHeader(header, token);
			    },
				success:function(data){
					//테이블 옵션 값 동적변경
					selectedRow.children('td:nth-child(3)').children('span:nth-child(2)').children('span.color').text(color);
					selectedRow.children('td:nth-child(3)').children('span:nth-child(2)').children('span.size').text(size);
				}
			});
		//사이즈까지 선택 하지 않은 경우
        }else{
            alert('옵션을 선택해주세요');
            return;
        }
	});
    
    
});