$(function(){
    $('#height').click(function(){
        let a = $(this).next().css('display');
        if(a == 'none'){
            $(this).next().fadeIn(200);
        }else{
            $(this).next().fadeOut(300);
        }
    });
    $('#weight').click(function(){
        let a = $(this).next().css('display');
        if(a == 'none'){
            $(this).next().fadeIn(200);
        }else{
            $(this).next().fadeOut(300);
        }
    });
    $('#size').click(function(){
        let a = $(this).next().css('display');
        if(a == 'none'){
            $(this).next().fadeIn(200);
        }else{
            $(this).next().fadeOut(300);
        }
    });
    $('input:checkbox').click(function(){
        if($(this).prop('checked')){
            $(this).parent().parent().parent().fadeOut(300);
        }
    });
});