(function () {
    $(document).ready(function(){
        var a = prompt('What is your name?');
        var b = prompt('What is your name?');
        var c = prompt('What is email-address?');

        $('#firstName').val(a);
        $('#lastName').val(b);
        $('#email').val(b);

    });

}());