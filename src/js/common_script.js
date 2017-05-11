(function utilities(global, document, $) {

    function OwlHelper() {

    }

    OwlHelper.prototype.engageOwlCarousel = function(element, settings) {

        if(element.hasClass('owl-carousel'))
            this.destroyOwlCarousel(element);
        element.addClass('owl-carousel').owlCarousel(settings);

    };

    OwlHelper.prototype.destroyOwlCarousel = function(element) {

        if (element.hasClass('owl-carousel'))
        {
            element.trigger('destroy.owl.carousel')
                .removeClass('owl-carousel owl-loaded owl-center owl-hidden');
        }

    };

    global.OwlHelper = new OwlHelper;


    function Animator() {

    }

    Animator.prototype.setScrollTop = function(element, pos){

        element.on('click', function () {
            $('body,html').animate({scrollTop: (pos)}, 600);
            return false;
        });

    };

    global.Animator = new Animator;

    global.classes = {

        active: 'active',
        popupOpened: 'popup-opened',
        disabled: 'disabled'
    }

}(this, document, jQuery));