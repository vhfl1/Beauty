$(function(){
    if($('.on').is(':checked')){
        $('.passArea').show();
    } else {
        $('.passArea').hide();
    }

    $('input[name=open]').on('change', function(){
        if($('.on').is(':checked')){
            $('.passArea').show();
        } else {
            $('.passArea').hide();
        }
    });
});