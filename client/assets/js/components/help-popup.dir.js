(function() {
  'use strict';

  angular
    .module('cpaComponents.helpPopup', [])
    .directive('cpaHelpPopup', cpaHelpPopup);

  /* @ngInject */
  function cpaHelpPopup() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        parentElement: '@?'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var $element = $(element);
      var $target, $nextElement;

      function init() {
        $nextElement = $element.next();
        if($nextElement.hasClass('cpa-help-popup')) {
          $target = $nextElement;
        }
        $element.on('click', show);
      }

      function show() {
        // set the position of popup only the first time it's called
        if(!$target.data('positionSet')) {
          $target
            .css({
              left: $nextElement.position().left,
              top: $element.height() + 10
            })
            .data('positionSet', true);
        }

        $target
          .on('click', function(event) {
            // prevent click bubbling up so popup doesn't close
            event.stopPropagation();
          })
          .fadeIn(200);
        $(document).on('click', hide);
        $element.on('click', hide);
      }

      function hide(event) {
        // hide popup if event is not activation button
        if(event && !$element.is(event.target)) {
          $target.fadeOut(200);
          // kill event handler on document
          $(document).off('click', hide);
        }
      }
      init();
    }
  }
})();
