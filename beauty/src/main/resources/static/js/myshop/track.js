$(function(){
    $(document).on('click', '.btnTrack', function(){
		
        // 1.빈창 팝업 생성
        var url 			= "/Beauty/myshop/track";
        var windowTargetName= "targetName";
        var features 		= "scrollbars=no,width=600,height=800,location=no";
        window.open(url, windowTargetName, features);

        // 2.POST로 데이터 전달
        myForm.action=url; // 이동
        myForm.method="get";
        myForm.target=windowTargetName;
        myForm.submit();
        
    });

    $('#company').change(function(){

        let company 		= $(this).val();
        let oriHref 		= $('#btnTrack').prop('href');
        let companyIndex 	= oriHref.indexOf('#/') + 2;
        let companyLastIndex= oriHref.lastIndexOf('/');
        let changeCompany 	= oriHref.substring(companyIndex, companyLastIndex);
        oriHref = oriHref.replace(changeCompany, company);
        $('#btnTrack').prop('href', oriHref);

    });

    $('#trackNumber').focusout(function(){

        let oriHref 	= $('#btnTrack').prop('href');
        let numberIndex = oriHref.lastIndexOf('/') + 1;
        let changeNumber= oriHref.substring(numberIndex);
        oriHref = oriHref.replace(changeNumber, $(this).val());
        $('#btnTrack').prop('href', oriHref);

    });



    $.Modal = {
        _WinModalPopup		: null, // 모달 오픈객체
        _OpenedCheckerTimer	: null, // 창을 닫았는지 체크
        _ChildFocus			: null,
        _IsTofficeTop: "",
        Focus: function () {
            $.Modal._WinModalPopup.focus();
        },

        Open: function (pUrl, pModalName, pFeatures, pCallBack, pMaskLayerId) {
            window.returnValue = null;
            _ParentDocument.$.Modal._WinModalPopup = window.open(pUrl, pModalName, pFeatures);
            if (pMaskLayerId == null || typeof pMaskLayerId == "undefined") {
                pMaskLayerId = "ShowModalMaskLayer";
            }
            if (_ParentDocument.document.getElementById(pMaskLayerId) == null) {
                $("body", _ParentDocument.document).append("<div id='" + pMaskLayerId + "' style='position:absolute;display:;z-index:1001;left:0px;top:0px;width:100%;height:100%;opacity:0.4;background-color:#000;' onclick='$.Modal.Focus()'></div>");
            }
            this._OpenedCheckerTimer = setInterval(function () {
                if (_ParentDocument.$.Modal._WinModalPopup.closed) {
                    clearInterval($.Modal._OpenedCheckerTimer);
                    pCallBack(window.returnValue);
                    if ($("#" + pMaskLayerId, _ParentDocument.document).length > 0) {
                        $("#" + pMaskLayerId, _ParentDocument.document).remove();
                    }

                }
            }, 500);
        }
    }

    var _ParentDocument = "";
    var _parentLocation = "";
    var _ChidFocus = null;
    try {
        _parentLocation = parent.location.href;
    } catch (e) {
        _parentLocation = "undefined";
    }

    if (_parentLocation != "undefined" && self.location.href != _parentLocation) {
        _ParentDocument = parent._ParentDocument;
    } else {
    _ParentDocument = self;
    }

    $('#btnTrack').click(function(e){
        e.preventDefault();

        var windowURL = $('#btnTrack').prop('href');
        var position  = 'top=50px,left=50px,height=700px,width=500px,status=no,scroll=no' ;
        $.Modal.Open(windowURL, "track", position,function(){});

    });

});