(function() {
  'use strict';

  angular
    .module('cpaComponents.editInPlace', [])
    .directive('cpaEditInPlace', cpaEditInPlace);


  /* @ngInject */
  function cpaEditInPlace() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      link: link,
      restrict: 'A',
      require: 'ngModel'
    };
    return directive;

    function link(scope, element, attrs, ngModelCtrl) {
      var $element = $(element);
      var $editButton;
      var $input;
      var $inputWrapper;
      var defaultElementValue = "";

      function init() {
        $editButton = $('<button>', {
            class: 'cpa-button-edit'
          })
          .css({
            'position': "relative",
            'top': "3.5px",
            'left': "0"
          });
        $element.after($editButton);
        $editButton.on('click', makeEditable);
      }

      function makeEditable() {
        $inputWrapper = $('<div>', {
          class: 'cpa-editable-text-wrapper'
        });


        $input = $('<input>', {
            type: 'text',
            class: 'cpa-editable-text-input',
            placeholder: $element.text().trim(),
            maxlength: 30
          })
          .css({
            'font-size': $element.css('font-size'),
            'font-family': $element.css('font-family'),
            'color': $element.css('color'),
            'background': $element.css('background'),
            'text-align': 'left'
          });


        var $confirmButton = $('<button>', {
          class: 'cpa-button-confirm'
        });


        $inputWrapper.append([$input, $confirmButton]);

        // Event Handling
        $input
          .val($input.attr('placeholder'))
          .on('keyup', handleKeyUp)
          .on('blur', handleKeyUp);


        $confirmButton
          .on('click', setViewValue);

        $element
          .after($inputWrapper)
          .hide();
        $editButton.hide();
        $input.trigger('focus');

      }

      function handleKeyUp(event) {
        console.log(event.keyCode);
        if (event.keyCode === 13) {
          setViewValue();
        } else if ($input.val() !== '') {
          $input.attr('placeholder', $input.val());
        }

        if (event.keyCode == 46) {
          if ($input.val() === '') {
            $input.attr('placeholder', '');
          }
        }

        if (event.keyCode == 8) {
          if ($input.val() === '') {
            $input.attr('placeholder', '');
          }
        }
      }

      function setViewValue() {
        if ($input.val() !== '') {
          ngModelCtrl.$setViewValue($input.attr('placeholder'));
        } else {
          ngModelCtrl.$setViewValue($element.text());
        }
        $element.show();
        $editButton.show();
        $inputWrapper.remove();
      }

      init();
    }
  }
})();
