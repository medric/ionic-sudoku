function sudokuGrid($ionicGesture) {
  return {
    restrict: 'EA',
    templateUrl: 'templates/sudoku-grid.html',
    scope: {
      grid: '=',
      selectCell: '&',
    },
    link: function (scope, element, attributes) {
      // events
      $ionicGesture.on('tap', function (event) {
        var el = angular.element(event.target),
            prev = angular.element(document.getElementsByClassName('sudoku-grid__cell--selected'));

        prev.removeClass('sudoku-grid__cell--selected');
        el.addClass('sudoku-grid__cell--selected');
      }, element);
    }
  }
}

function numberPad() {
  return {
    restrict: 'EA',
    templateUrl: 'templates/numeric-pad.html',
    scope: {
      min: '=',
      max: '=',
      selectNumber: '&',
    },
    controller: function($scope) {
      // numbers
      $scope.rows = [];
      $scope.numberOfRows = $scope.max / 3;

      var min = $scope.min,
          max = $scope.numberOfRows;
      for(var i = 0; i < $scope.numberOfRows; i++) {
        var row = [];
        for(var j = min; j <= max; j++) {
          row.push(j);
        }
        $scope.rows.push(row)
        min += 3;
        max += 3;
      }
    },
    link: function ($scope, element, attributes) {
    }
  }
}

sudokuGrid.$inject = [
  '$ionicGesture',
];

angular.module('sudoku.directives', [])
  .directive('sudokuGrid', sudokuGrid)
  .directive('numberPad', numberPad)
