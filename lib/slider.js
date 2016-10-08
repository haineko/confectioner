jQuery(document).ready(function($) {
   $('.product-gallery-slider').magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: '<div class="ux-loading dark"></div>',
      removalDelay: 300,
      closeOnContentClick: true,
      gallery: {
          enabled: true,
          navigateByImgClick: false,
          preload: [0,1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
          verticalFit: false,
          tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      },
      callbacks: {
       beforeOpen: function() {
         this.st.mainClass = 'has-product-video';
        },
        open: function () {
            var magnificPopup = $.magnificPopup.instance;

            // Add product video to gallery popup
            var productVideo = $('.product-video-popup').attr('href');

            if(productVideo){
              magnificPopup.items.push({
                  src: productVideo,
                  type: 'iframe'
              });

              magnificPopup.updateItemHTML();
            }

            // Touch slide popup
            var slidePan = $('.mfp-wrap')[0];
            var mc = new Hammer(slidePan);

            mc.on("panleft", function(ev) {
              if(ev.isFinal){ magnificPopup.prev(); }
            });

            mc.on("panright", function(ev) {
              if(ev.isFinal){ magnificPopup.next(); }
            });
        },
    }
  });

  /* Open product gallery slider */
  $('.zoom-button').click(function(e){
      $('.product-gallery-slider').find('.is-selected a').click();
      e.preventDefault();
  });

});