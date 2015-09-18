'use strict';

angular.module('idc-long-string', [])

.directive('idcLongString', function () {
  return {
    restrict: 'A',
    scope: {
      idcLongString: '='
    },
    link: function(scope, element, attrs){
      // var elInput = element.find('input');
      // var elDummy = element.find('span');
      // var inputText = elInput.val();
      // elDummy.html(inputText);
      // elInput.bind("keydown keyup", function(){
      //   var inputText = elInput.val();
      //   elDummy.html(inputText);
      //   elInput.css('width', (elDummy[0].offsetWidth + 10) + 'px');
      // });
      var span = element.find('span');
      span.html(scope.idcLongString);

      while (element[0].offsetWidth - span[0].offsetWidth <= 20 && span[0].offsetWidth > 12) {
        scope.idcLongString = scope.idcLongString.substring(0, scope.idcLongString.length - 4) + '...';
        span.html(scope.idcLongString);
      }

      // scope.$watch(function () {
      //   return element[0].style.width;
      // }, function(newVal, oldVal) {
      //   console.log('Width changed');
      //   while (element[0].offsetWidth - span[0].offsetWidth <= 20 && span[0].offsetWidth > 12) {
      //     scope.idcLongString = scope.idcLongString.substring(0, scope.idcLongString.length - 4) + '...';
      //     span.html(scope.idcLongString);
      //     console.log(span[0].offsetWidth);
      //   }
      // });
      // console.log(element[0].offsetWidth);

      // var span = element.find('span');
      // console.log(span[0].offsetWidth);
    
      // scope.idcLongString = scope.idcLongString.substring(0, 10);
      // span.html(scope.idcLongString);
      // console.log(span[0].offsetWidth);
    }
  };
});