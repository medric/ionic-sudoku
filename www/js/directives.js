function sudokuGrid() {
  return {
    restrict: 'EA',
    templateUrl: 'templates/sudoku-grid.html',
    scope: {
      grid: '='
    },
    link: function (scope, element, attributes) {

    }
  }
}

angular.module('sudoku.directives', [])
  .directive('sudokuGrid', sudokuGrid)
