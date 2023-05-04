$(function(){
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	let type = '적립';
	let lastPage= 1;
	let pg 		= 1;
	let today 	= new Date();
	let end 	= formatDate(today);
	today.setMonth(today.getMonth() - 1);
	let start 	= formatDate(today);
	
	paging		(formatDate(new Date().setMonth(new Date().getMonth() - 1)), formatDate(new Date()));
	getOrderList(formatDate(new Date().setMonth(new Date().getMonth() - 1)), formatDate(new Date()));
	/* 기간별 조회 */
	$('div.dateBtns > input:radio[name="chkDate"]').click(function(){
		let chkDate = $('div.dateBtns > input:radio:checked[name="chkDate"]').val();
		pg 		= 1;
		today 	= new Date();
		end 	= formatDate(today);
		if(chkDate == '1month'){
			today.setMonth(today.getMonth() - 1); }else 
		if(chkDate == '6month'){
			today.setMonth(today.getMonth() - 6); }else
		if(chkDate == '1year'){
			today.setMonth(today.getMonth() - 12);}
			
		start 	= formatDate(today);
		
		paging		(start, end);
		getOrderList(start, end);
	});
	/* 기간 지정 조회 */
	$('#btnSearchDate').click(function(){
		$('div.dateBtns > input:radio[name="chkDate"]').prop('checked', false);
		pg 		= 1;
		start 	= $('#startDate').val();
		end 	= $('#endDate').val();
		if(start == "" || end == ""){
			alert('날짜를 선택해주세요.');
			return;
		}
		paging		(start, end);
		getOrderList(start, end);
	});
	/* 검색 타입 */
	$('div.typeBtns > input:radio[name="chkType"]').click(function(){
		type = $('div.typeBtns > input:radio:checked[name="chkType"]').val();
		paging		(start, end);
		getOrderList(start, end);
	});	
	
	
	/* 페이지 처리 */
	//페이지 숫자 클릭시
	 $(document).on('click', 'div.pagination > a.pageNum', function(e){
		e.preventDefault(); 
		pg = Number($(this).text());
		paging		(start, end);
		getOrderList(start, end);
	 });
	//좌우 버튼 클릭시
	$(document).on('click', 'div.pagination > a.prevPage', function(e){
		e.preventDefault();
		if(pg == 1){
			alert('첫 번째 페이지 입니다.');
			return;
		}else{
			--pg;
			paging		(start, end);
			getOrderList(start, end);
		}
	 });
	 $(document).on('click', 'div.pagination > a.nextPage', function(e){
		e.preventDefault();
		if(pg == lastPage){
			alert('마지막 페이지 입니다.');
			return;
		}else{
			++pg;
			paging		(start, end);
			getOrderList(start, end);
		}
	 });
	
	//페이지 버튼 생성
	function paging(start, end){
		$.ajax({
			url:'/Beauty/myshop/countPointList',
			type:'POST',
			data:{
				'type'	: type,
				'start'	: start,
				'end'	: end
			},
			dataType:'json',
			beforeSend: function(xhr){
        		xhr.setRequestHeader(header, token);
		    },
			success:function(data){
				//마지막 페이지 설정
				lastPage = Math.ceil(data/10.0);
				//그룹(ex.1~10페이지) 시작, 마지막 번호 설정
				let groupStart = (parseInt(Math.ceil(pg / 10.0) -1)) * 10 + 1;
				let groupEnd = Math.min(groupStart + 9, lastPage);
				
				$('div.pagination').empty();
				$('div.pagination').append('<a class="prevPage" href="#">&lsaquo;</a>');
				for(let i = groupStart ; i <= groupEnd ; i++){
					if(i == pg ){
						$('div.pagination').append('<a href="#" class="pageNum active">'+ i +'</a>');
					}else {
						$('div.pagination').append('<a href="#" class="pageNum">'+ i +'</a>');
					}
				}
				$('div.pagination').append('<a class="nextPage" href="#">&rsaquo;</a>');
			}
		});
	}
	
	
	//리스트 가져오기
	function getOrderList(start, end){
		$.ajax({
			url:'/Beauty/myshop/pointSearchDate',
			type:'POST',
			data:{
				'type'	: type,
				'start'	: start,
				'end'	: end,
				'pg'	: pg
			},
			dataType:'json',
			beforeSend: function(xhr){
        		xhr.setRequestHeader(header, token);
		    },
			success:function(data){
				$('#pointListTable > tbody').empty();
				inputOrderList(data);
				//테이블이 비었으면
				if($('#pointListTable > tbody').children().length == 0){
					emptyTable();
				}
			}
		});
	}
	
	//데이터 입력
	function inputOrderList(data){
		for (order of data) {
			let tag = "";
			tag += '<tr>';
			tag += '<td id="ordDate">'+ order.ordDate +'</td>';
			tag += '<td>'+ type +'</td>';
			tag += '<td><a href="#" id="ordNo">'+ order.ordNo +'</a></td>';
			if(type == '적립'){
				tag += '<td><span id="point">'+ order.savePoint +'</span></td>';
			}else{
				tag += '<td><span id="point">'+ order.usedPoint +'</span></td>';
			}
			tag += '<td id="descript">상품 구매확정</td>';
			tag += '<td>'+ formatExpire('20'+order.ordDate) +'</td>'
			tag += '</tr>';
			
			$('#pointListTable > tbody').append(tag);
		}
	}
	
	//빈 테이블
	function emptyTable(){
		//카트 비었으면
		//테이블, 토탈테이블 삭제, div.emptyCart 삽입
		let tag = "<tr><td colspan='5'>포인트 "+ type +"내역이 없습니다.</td></tr>";
		$('#pointListTable > tbody').append(tag);
	}
	
	//날짜 포매팅 'yyyy-MM-dd'
	function formatDate(date) {
	    var d 		= new Date(date),
	        month 	= '' + (d.getMonth() + 1),
	        day 	= '' + d.getDate(),
	        year 	= d.getFullYear();
	
	    if (month.length < 2) 
	        month = '0' + month;
	    if (day.length < 2) 
	        day = '0' + day;
		//윤년처리 해줄것
	    return [year, month, day].join('-');
	}
	
	//유효 기간 포매팅
	function formatExpire(ordDate){
		console.log(ordDate);
		var date = new Date(ordDate);
		date.setFullYear(date.getFullYear()+1);
		return formatDate(date);
	} 

});