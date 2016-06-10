(function() {
  'use strict';

  angular.module('cpaPrototype', [
      'ui.router',
      'ngAnimate',
      'cpaComponents',

      //foundation
      'foundation',
      'foundation.dynamicRouting',
      'foundation.dynamicRouting.animations'
    ])
    .config(config)
    .run(run)
    .filter('reverse', reverse)
    .filter('num', numberFilter)
    .filter('percentage', ['$filter', percentageFilter])
    .filter('currencyInK', ['$filter', currencyInK])
    .filter('numberInK', ['$filter', numberInK]);


  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');

  }

  function currency($filter) {
    return function(input, decimals) {
      if(input === 0) {
        return 0;
      } else {
        return $filter('currency')(input, decimals);
      }
    };
  }

  function currencyInK($filter) {
    return function(input, decimals) {
      return '$' + $filter('number')(input, decimals) + 'K';
    };
  }

  function numberInK($filter) {
    return function(input, decimals) {
      return $filter('number')(input, decimals) + 'K';
    };
  }

  function percentageFilter($filter) {
    return function(input, decimals) {
      // if(input === 0) {
      //   return 0;
      // } else {
        return $filter('number')(input, decimals) + '%';
      //}
    };
  }

  function numberFilter() {
    return function(input) {
      return parseInt(input, 10);
    };
  }

  function run() {
    FastClick.attach(document.body);
  }

  function reverse() {
    return function(items) {
      return items.slice().reverse();
    };
  }


})();
