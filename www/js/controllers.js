/**
 *
 * @param $scope
 * @constructor
 */
function SudokuCtrl($rootScope, $scope, SudokuModel, SudokuNetworkService, UIService) {
  SudokuModel.initGrid();
  SudokuNetworkService.loadGrids();

  // private
  var selectedCell = undefined;

  // public
  var grid = SudokuModel.getGrid();

  /**
   * Init the grid
   */
  var newGrid = function() {
    SudokuModel.initGrid();
  }

  /**
   * Shares the grid through firebase
   */
  var shareGrid = function() {
    SudokuNetworkService.shareGrid({
      'username': 'medric'
    }, grid).then(function() {
      UIService.showAlert('Confirm', 'Grid successfully shared !');
    })
  }

  /**
   * Selects a cell
   * @param cell
     */
  var selectCell = function(cell) {
    if(angular.isDefined(cell)) {
      selectedCell = cell;
    }
  }

  /**
   * Selects a number from the numeric pad
   * @param number
     */
  var selectNumber = function(number) {
    if(angular.isDefined(number) && Number.isInteger(number) && angular.isDefined(selectedCell)) {
      // bind new value
      selectedCell.value = number;
      // if logged in
      //SudokuNetworkService.saveGrid(grid)
    }
  }

  // exports
  angular.extend(this, {
    grid: grid,
    newGrid: newGrid,
    shareGrid: shareGrid,
    selectNumber: selectNumber,
    selectCell: selectCell
  });
}

/**
 * Manages users
 * @param $scope
 * @constructor
 */
function AccountCtrl($scope) {
  // private
  var authProvider = 'facebook';
  var authSettings = { 'remember': true };

  var authSuccess = function() {
    log('log in successful');
    //$state.go('dash');
  };

  var authFailure = function(errors) {
    for (var err in errors) {
      // check the error and provide an appropriate message
    }
  };

  // public
  var login = function() {
    Ionic.Auth.login(authProvider, authSettings, loginDetails)
      .then(authSuccess, authFailure);
  };

  // exports
  angular.extend(this, {
    login: login,
  });
}

SudokuCtrl.$inject = [
  '$rootScope',
  '$scope',
  'SudokuModel',
  'SudokuNetworkService',
  'UIService'
];

angular.module('sudoku.controllers', [])
  .controller('SudokuCtrl', SudokuCtrl)
  .controller('AccountCtrl', AccountCtrl)

