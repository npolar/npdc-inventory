'use strict';

/**
 * @ngInject
 */
let langMenuDirective = function (NpolarLang) {
  return {
    //scope: {},
    //controller: '',
    template: require('./lang-menu.html'),
    link: function(scope) {
      scope.lang = NpolarLang;
    }
  };
};

module.exports = langMenuDirective;
