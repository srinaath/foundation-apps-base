(function() {
  'use strict';
  angular
    .module('cpaComponents', [
      'cpaComponents.editInPlace',
      'cpaComponents.helpPopup'
    ])
    .controller('ComponentsController', Components);

  /* @ngInject */
  function Components($timeout, $log) {
    /*jshint validthis: true */
    var components = this;
    components.editableText="Click to edit";
  
   
    activate();

    function activate() {}

  }
})();
