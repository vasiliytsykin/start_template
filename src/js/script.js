function attachActiveClass(element) {
    var active = 'active'
    $(".mobile-nav-header").removeClass(active);
    if(!$(element).hasClass(active) && $(element).hasClass('on'))
        $(element).addClass(active)
}

$(document).ready(function () {
    $(".mobile-nav-header").click(function() {

        if($(this).hasClass('main') && $(this).hasClass('on'))
        {
            $(".mobile-nav-header").removeClass('on')
            $('.mobile-nav ul').slideUp();
        }
        else
        {
            $(this).toggleClass('on');

            var parent = $(this).closest('.mobile-nav');
            var ul = $(parent).find('ul:first');

            $(ul).slideToggle();
        }

        attachActiveClass(this);

        return false;
    });
});




