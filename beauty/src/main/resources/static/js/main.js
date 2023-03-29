$(function(){
    $('.cate').mouseenter(function(){
        $(this).children('ul').css('display','block');
        $(this).children('.cate1').css('color',"#999");
    });
    $('.cate').mouseleave(function(){
        $(this).children('ul').css('display','none');
        $(this).children('.cate1').css('color',"#212121");
    });
    $(window).scroll(function(){
        let now = $(document).scrollTop();
        if(now >= 200){
            $('.moveNavi').css({'position':'fixed',
            'top':'0',
            'left':'0',
            'background':'rgba(255,255,255,0.8)',
            'border-bottom':'1px solid #e5e5e5',
            'width':'100%'});
            $('.cate').children('ul').css('border-top','none');
            $('.up').fadeIn(500);
        }else{
            $('.moveNavi').css({'position':'absolute',
            'top':'49px',
            'left':'auto',
            'background':'rgba(255,255,255,0)',
            'border-bottom':'none',
            'width':'1600px'});
            $('.cate').children('ul').css('border-top','1px solid #e5e5e5');
            $('.up').fadeOut(500);
        }
    });
    $('.up').click(function(){
        $('html, body').animate({
            scrollTop: 0
        },300);
    });
});