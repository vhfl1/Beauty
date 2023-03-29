/* admin-prodcut-list */
$(document).ready(function(){
	var header = $("meta[name='_csrf_header']").attr('content');
	var token = $("meta[name='_csrf']").attr('content');
	//기본 시작 전체 체크 해제
	$(".allCheck").attr("checked", false);
	
	//전체 체크 클릭했을 때 하위카테고리 체크
    $('.allCheck').click(function(){
		if($(this).prop("checked")){
			$(".allCheck:checked").closest("ul").children().children().children("input[name=category2]").prop("checked", true);
		}else{
			$(this).closest("ul").children().children().children("input[name=category2]").prop("checked", false);	
		}
	
	});
	
    //체크박스 개별선택
    $("input[name=category2]").on("click",function(){
    	if($(this).prop("checked") == false){
    		$(this).closest("ul").children().children().children(".allCheck").prop("checked", false);
    	}else if($(this).closest("ul").children().children().children(":checked").length == $(this).closest("ul").children().children().children("input[name=category2]").length){
    		$(this).closest("ul").children().children().children(".allCheck").prop("checked", true);
    	}
    });
    
    //페이지가 로드되면 처음 실행
  	CheckBoxList();//상품목록
  	page();//페이지 번호
  	
  	var start=0;
  	var pg=1;
  	var totalPage=1;
  	//체크된 메뉴 상품목록 불러오기
	function CheckBoxList(){
		//체크박스 값 배열에 담기
		var collection = new Array();
	  	if($('input:checkbox[name=category2]:checked').length == 0){
	  		//전체 값
			$('input[name=category2]').each(function(){
				collection.push($(this).val());
			});	
	  	}else{
	  		//선택된 값
			$('input[name=category2]:checked').each(function(){
				collection.push($(this).val());
			});	
	  	}
	  	//console.log(collection);
		
		//AJAX 요청 보내기
	  	$.ajax({
			type:"post",
			url:"/Beauty/admin/product/list",
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			data: {'collection':collection},
			dataType: 'json',
			success:function(data){
				//console.log(data.result);
				$('.productRow').remove();
				//최신순 정렬
				const sortedResult = data.result.sort((a,b)=>b.prodNo-a.prodNo);
				//console.log("sortedResult",sortedResult);
				//상품목록 불러오기
				let tag = "";
				//상품목록에 상품 개수 10개까지만 보이게 함
				const sliceArr = sortedResult.slice(start,start+10);
				//console.log("start",start);
				//console.log("sliceArr",sliceArr);
				for(let i=0; i<sliceArr.length; i++){
						tag += "<tr class='productRow'>";
						tag += "<td><input type='checkbox' name='선택체크' class='rowCheck' value='"+sliceArr[i].prodNo+"'></td>";
						tag += "<td><img src='/Beauty/image/"+sliceArr[i].thumb1+"'></td>";
						tag += "<td>"+sliceArr[i].prodNo+"</td>";
						tag += "<td>"+sliceArr[i].c1Name+"</td>";
						tag += "<td>"+sliceArr[i].c2Name+"</td>";
						tag += "<td><a href='#'>"+sliceArr[i].prodName+"</a></td>";
						tag += "<td>"+sliceArr[i].price.toLocaleString()+"</td>";
						tag += "<td>"+sliceArr[i].discount+"</td>";
						tag += "<td>판매중</td>";
						tag += "<td>"+sliceArr[i].stock+"</td>";
						tag += "<td>"+sliceArr[i].hit+"</td>";
						tag += "<td>";
						tag += "<button class='more'>상세보기</button><br>";
						tag += "<button class='deleteButton' value='"+sliceArr[i].prodNo+"'>삭제</button>";
						tag += "</td>";
						tag += "</tr>"
				}
				$('#tableList').append(tag);
			}
		});
  	}
  	
	//페이징 처리
	function page(){
		if(window.location.pathname !== "/Beauty/admin/product/search"){
		//체크박스 값 배열에 담기
		var collection = new Array();
	  	if($('input:checkbox[name=category2]:checked').length == 0){
	  		//전체 값
			$('input[name=category2]').each(function(){
				collection.push($(this).val());
			});	
	  	}else{
	  		//선택된 값
			$('input[name=category2]:checked').each(function(){
				collection.push($(this).val());
			});	
	  	}
	  	
		//ajax 요청 보내기
	  	$.ajax({
			type:"post",
			url:"/Beauty/admin/product/listCount",
			beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
			data: {'collection':collection},
			dataType: 'json',
			success:function(data){
				//console.log("상품개수",data.result);
				//전체 페이지 수 정의
				if(data.result % 10 == 0){
					totalPage=data.result/10;
				}else{
					totalPage=Math.ceil(data.result/10);
				}
				//console.log("page??",totalPage);
				//페이지 개수 정하기
				UpdatePg(totalPage);
			}
	  	});
	  }
	}
	
	//현재 페이지 번호 기준으로 앞뒤 5개씩의 페이지 번호만 보여줌
  	function UpdatePg(totalPage){
  		console.log(pg);
  		var startPg = Math.max(pg-5,1);
  		
  		if(pg<6 && totalPage>=10){
  			var endPg = 10;
  		}else if(pg>=6 && totalPage>=10){
  			var endPg = Math.min(pg+4,totalPage);
  		}else if(pg<6 && totalPage<10){
			var endPg = totalPage;
		  }
  		console.log("startPg",startPg);
  		console.log("endPg",endPg);
  		console.log("totalPage",totalPage);
  		$(".page").empty();
		//페이지 만들기
  		let tag = "<span><a class='prev' href='#'>이전</a></span>";
		
  		for(i=startPg; i<=endPg; i++){
			let num= pg==i?'current':'num';
			tag += "<span><a class='"+num+"' data-value='"+i+"' href='#'>"+i+"</a></span>";
		}
			tag += "<span><a class='next' href='#'>다음</a></span>";
		
		$(".page").append(tag);
  	}
	
	//페이지 번호 클릭했을 때
	$(document).on("click",".num", function(){
		pg = $(this).attr("data-value");
		start=(pg-1)*10;
    	$(".current").attr("class","num");
	    $(this).attr("class","current");
		
	    CheckBoxList();
	    page();
	});
	
	//이전 버튼 클릭했을 때
	$(document).on("click",".prev", function(){
		pg--;
		start=(pg-1)*10;
		//이전 페이지가 없을 경우
		if(pg<1){
			pg=1;
			alert("첫번째 페이지입니다.");
			return false;
		}
		
		$(".current").attr("class","num");
		$(".num").eq(pg-1).attr("class","current");
		
		CheckBoxList();
		page();
	});
	
	//다음 버튼 클릭했을 때
	$(document).on("click",".next", function(){
		pg++;
		start=(pg-1)*10;
		var maxPg = $(".num").length+1;
		//console.log(maxPg);
		//다음 페이지가 없을 경우
		if(pg>totalPage){
			alert("마지막 페이지입니다.");
			pg=totalPage;
			return false;	
		}
		
		$(".current").attr("class","num");
		$(".num").eq(pg-1).attr("class","current");
		CheckBoxList();	
		page();
		
	});
	
  	//메뉴 체크박스가 변화할 때마다 상품목록 불러오기
  	$("ul").find("input[type=checkbox]").on("change",function(){
		pg=1;
		start=0;
		CheckBoxList();
		page();
    	
	});
	
    

	/* 상품목록 체크박스 제어 */
	//상품목록 전체체크박스 클릭
	$("#checkAll").on("click", function(){    
		if($(this).prop("checked")){
			$(".rowCheck").prop("checked", true);	
		}else{
			$(".rowCheck").prop("checked", false);	
		}
	});
	
    //상품목록 체크박스 개별선택
    $(document).on('click', '.rowCheck', function(){
    	if($(this).prop("checked") == false){
    		$("#checkAll").prop("checked", false);
    	}else if($(".rowCheck:checked").length == $(".rowCheck").length){
    		$("#checkAll").prop("checked", true);
    	}
    });
    
    //체크박스를 이용한 상품삭제
	$(".delete").on("click",function(){
		
			var checkBoxArr = new Array();
			
			$(".rowCheck:checked").each(function(){
				checkBoxArr.push($(this).val());
				
			});
			
			if(checkBoxArr.length == 0){
				alert("선택된 글이 없습니다.");
			}else{
				$.ajax({
					url:'/Beauty/admin/product/list/delete',
					beforeSend: function(xhr){
				        xhr.setRequestHeader(header, token);
				    },
					type:'post',
					data:{'checkBoxArr':checkBoxArr},
					success:function(data){
						//console.log("data : ", data);
						// 삭제된 행을 제거
		                $(".rowCheck:checked").each(function(){
		                    $(this).closest("tr").remove();
		                });
		                CheckBoxList();
    					page();
					}	
				});
			}
	});
	
    //삭제버튼을 이용한 상품삭제
	$(document).on('click', '.deleteButton', function(){
		var prodNo = $(this).val();
		//console.log(prodNo,"prodNo");
		
		$.ajax({
	        url: '/Beauty/admin/product/list/delete',
	        beforeSend: function(xhr){
		        xhr.setRequestHeader(header, token);
		    },
	        type: 'get',
	        data: {prodNo: prodNo},
	        success: function(data) {
	            //console.log("data : ", data);
	            //삭제된 행을 제거
	            $(this).closest("tr").remove();
	            CheckBoxList();
    			page();
	        }.bind(this)   
        });
		
		
	});
	
	//상품검색할 때 소분류 카테고리 값 form에 담기
	$("input[name='category2']").on("change", function() {
	    var cate2 = $.map($("input[name='category2']:checked"), function(element){
	      return $(element).val();
	    });
	    
	    $("#cate2").val(cate2);
	    console.log(cate2);
	  });

});	

/* product-register 카테고리 분류 */
function cateChange(){
    		let outer = ["가디건","자켓/코트","패딩/점퍼","집업/조끼"];
    		let top = ["티셔츠","니트/스웨터","맨투맨/후드","조끼/나시"];
    		let bottom = ["스커트","데님","팬츠","슬랙스","레깅스"];
    		let dress = ["원피스","투피스","점프수트"];
    		let etc = ["신발","가방","모자","쥬얼리"];
    		
    		let outerV=[101,102,103,104];
    		let topV=[201,202,203,204,205];
    		let bottomV=[301,302,303,304,305];
    		let dressV=[401,402,403];
    		let etcV=[501,502,503,504];
    		
    		let target = $("#cate1").val();
    		let opt;
    		let optV;
    		//console.log(target);
    		if(target == '100'){
    			opt = outer;
    			optV= outerV;
    		}else if(target == '200'){
    			opt = top;
    			optV= topV;
    		}else if(target == '300'){
    			opt = bottom;
    			optV= bottomV;
    		}else if(target == '400'){
    			opt = dress;
    			optV= dressV;
    		}else if(target == '500'){
    			opt = etc;
    			optV= etcV;
    		}
    		
    		$("#cate2").empty();
    		$("#cate2").append('<option value="0">소분류 선택</option>');
    		
    		for(var i = 0; i < opt.length; i++){
    			$("#cate2").append('<option value="'+optV[i]+'">'+opt[i]+'</option>');
    		}
    		
    	}
    	
$(document).ready(function(){
    	/*$("input[name=color]").on("change",function(){
    		if($(this).prop("checked")){
    		var	color=$(this).val();
    		var label =$(this).parent();
    		
    		var text = label.contents().filter(function(){
    			return this.nodeType === Node.TEXT_NODE;
    		}).text().trim();
    		console.log(text);
    		console.log(color);
    		}
    	});*/
    	
    	//상품등록
    	$(document).on("click",".register",function(e){
    		e.preventDefault();
    	
			//색상,사이즈 선택된 값을 담을 배열
			var colorArr = [];
			var colorNameArr = [];
			var sizeArr = [];
			//색상 체크박스를 선택했을 때
			$("input[name=color]:checked").each(function(){
				colorArr.push($(this).val());
			});
			
			$("input[name=color]:checked").each(function(){
				var label =$(this).parent();
	    		
	    		var text = label.contents().filter(function(){
	    			return this.nodeType === Node.TEXT_NODE;
	    		}).text().trim();
				colorNameArr.push(text);
			});
			
			//사이즈 체크박스를 선택했을 때
			$("input[name=size]:checked").each(function(){
				sizeArr.push($(this).val());
			});
			
			//폼에 선택된 색상,사이즈 배열 추가하기
			var form=$("#productForm")[0];
			var formData = new FormData(form);
			for (var i = 0; i < colorArr.length; i++) {
			    formData.append("colorArr[]", colorArr[i]);
			    formData.append("colorNameArr[]", colorNameArr[i]);
			}
			for (var i = 0; i < sizeArr.length; i++) {
			    formData.append("sizeArr[]", sizeArr[i]);
			}
			
			var header = $("meta[name='_csrf_header']").attr('content');
			var token = $("meta[name='_csrf']").attr('content');
			
			//카테고리를 선택하지 않았을 경우
			if($("#cate2").val()=='0'){
				alert("카테고리를 선택해주세요.");
			//색상을 선택하지 않았을 경우
			}else if(colorArr.length == 0){
				alert("선택된 색상이 없습니다.");
			}else{
				fileUpload(function(){
					//ajax 요청 보내기
					$.ajax({
						url:'/Beauty/admin/product/register',
						beforeSend: function(xhr){
					        xhr.setRequestHeader(header, token);
					    },
						type:'post',
						data:formData,
						cache: false,
				        contentType: false,
				        processData: false,
						success:function(data){
							location.href="/Beauty/admin/product/list";
						}	
					});
				});
				
			}
    	});
    	
    	//포인트 계산(할인가의 1%)
    	$(document).on("input","#discount",function(){
    		let price=$("#price").val();
        	let discount=$("#discount").val();
        	let disPrice =price*(discount/100);
        	console.log(disPrice);
			$("#point").val(Math.ceil((price-disPrice)*1/100));
    	});
    	
    	//이미지파일 유효성 검사
    	function fileUpload(callback){
			var imgFile = $('#isFile1').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile1').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile1").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile1").files[0].size;
			    console.log(fileSize);
			    console.log(maxSize);
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile2').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile2').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile2").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile2").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile3').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile3').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile3").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile3").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile4').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile4').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile4").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile4").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile5').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile5').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile5").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile5").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile6').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile6').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile6").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile6").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile7').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile7').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile7").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile7").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile8').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile8').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile8").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile8").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			var imgFile = $('#isFile9').val();
			var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
			var maxSize = 5 * 1024 * 1024;
			var fileSize;
			
			if($('#isFile9').val() == "") {
				alert("첨부파일은 필수!");
			    $("#isFile9").focus();
			    return;
			}
			
			if(imgFile != "" && imgFile != null) {
				fileSize = document.getElementById("isFile9").files[0].size;
			    
			    if(!imgFile.match(fileForm)) {
			    	alert("이미지 파일만 업로드 가능");
			        return;
			    } else if(fileSize > maxSize) {
			    	alert("파일 사이즈는 5MB까지 가능");
			        return;
			    }
			}
			//유효성 검사 끝나면 ajax 요청 보내기
			callback();
		}	
	});