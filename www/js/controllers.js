/**
 *
 * @param $scope
 * @constructor
 */
function SudokuCtrl($rootScope, $scope, SudokuModel) {
  SudokuModel.initGrid();
  // private

  // public
  var grid = SudokuModel.getGrid();

  var newGrid = function() {
    SudokuModel.initGrid();
  }

  // exports
  angular.extend(this, {
    grid: grid,
    newGrid: newGrid
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
  'SudokuModel'
];

angular.module('sudoku.controllers', [])
  .controller('SudokuCtrl', SudokuCtrl)
  .controller('AccountCtrl', AccountCtrl)

