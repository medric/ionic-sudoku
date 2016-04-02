
/* global angular */
'use strict'; // jshint ignore:line

/**
 * Main controller
 * @param $rootScope
 * @constructor
   */
function MainCtrl($rootScope) {
  // Settings
  var enableSharing = function() {
    $rootScope.SudokuNetworkService.loadGrids();
  }

  // exports
  angular.extend(this, {
    isConnected: function () {
      return $rootScope.AccountService.isConnected;
    },
    enableSharing: enableSharing
  });
}

/**
 * Manages sudoku tab
 * @param $scope
 * @constructor
 */
function SudokuCtrl($rootScope, $scope, SudokuModel, UIService, $ionicModal, $filter) {
  // private
  var selectedCell = undefined,
      gridIndex;

  // public
  var grid = {},
      gridsListModal;

  var init = function(sync) {
    SudokuModel.initGrid();
    grid.grid = SudokuModel.getGrid();
  }

  // Provides a modal for displaying grids list
  $ionicModal.fromTemplateUrl('templates/grids-list-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    gridsListModal = modal;
  });

  /**
   * Init the grid
   */
  var newGrid = function () {
    grid = {};
    init(false);
  }

  /**
   * Shares the grid through firebase
   */
  var shareGrid = function () {
    $rootScope.SudokuNetworkService.addGrid(
      $rootScope.AccountService.getUserInfo().email,
      grid
    ).then(function () {
      UIService.showAlert('Confirm', 'Grid successfully shared !');
    })
  }

  /**
   * Get grids from firebase service layer
   * @returns {Array}
     */
  var getGrids = function() {
    if(sharingEnabled()) {
      return $rootScope.SudokuNetworkService.getGrids();
    }
  }

  /**
   * Load a grid from network
   * @param grid
     */
  var loadGrid = function(newGrid, index) {
    if(angular.isDefined(newGrid)) {
      grid.grid = {};
      angular.extend(grid, newGrid);
      gridIndex = index;
      closeGridsListModal();
    }
  }

  /**
   * Selects a cell
   * @param cell
   */
  var selectCell = function (cell) {
    if (angular.isDefined(cell)) {
      selectedCell = cell;
    }
  }

  /**
   * Selects a number from the numeric pad
   * @param number
   */
  var selectNumber = function (number) {
    if (angular.isDefined(number) && Number.isInteger(number) && angular.isDefined(selectedCell)) {
      // bind new value
      selectedCell.value = number;

      // if logged in and sharing is enabled
      if(sharingEnabled()) {
        $rootScope.SudokuNetworkService.saveGrid(gridIndex);
      }
    }
  }

  var openGridsListModal = function() {
    gridsListModal.show();
  }

  var closeGridsListModal= function() {
    gridsListModal.hide();
  }

  /**
   * Returns settings
   * @returns {*}
     */
  var sharingEnabled = function() {
    return $rootScope.AccountService.isConnected &&
      $rootScope.AccountService.settings.sharingEnabled;
  }

  var formatDate = function(date) {
    return $filter('date')(new Date(date), 'yyyy-mm-dd');
  }

  // run
  init(true);

  // exports
  angular.extend(this, {
    grid: grid,
    newGrid: newGrid,
    shareGrid: shareGrid,
    selectNumber: selectNumber,
    selectCell: selectCell,
    sharingEnabled: sharingEnabled,
    openGridsListModal: openGridsListModal,
    closeGridsListModal: closeGridsListModal,
    getGrids: getGrids,
    loadGrid: loadGrid,
    formatDate: formatDate
  });
}

/**
 * Manages user
 * @param $scope
 * @constructor
 */
function AccountCtrl($rootScope, $state, UIService) {
  // private
  var authProvider = 'basic',
    authSettings = {'remember': true},
    emailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
    credentials = {
      'email': '',
      'password': ''
    },
    settings = $rootScope.AccountService.settings;

  var authSuccess = function () {
    $rootScope.AccountService.isConnected = true;
    $state.go('tab.sudoku');
  };

  var authFailure = function (errors) {
    UIService.showAlert('Error', 'Invalid credentials');
  };

  var validateCredentials = function () {
    return credentials.email && credentials.password && emailPattern.test(credentials.email);
  }

  // public
  var login = function () {
    if(validateCredentials()) {
      Ionic.Auth.login(authProvider, authSettings, credentials)
        .then(authSuccess, authFailure);
    } else {
      UIService.showAlert('Error', 'Please check your entries !');
    }
  };

  var signUp = function () {
    if (validateCredentials()) {
      Ionic.Auth.signup(credentials).then(authSuccess, authFailure);
    } else {
      UIService.showAlert('Error', 'Please check your entries !');
    }
  }

  var redirectTo = function (state) {
    $state.go(state);
  }

  // exports
  angular.extend(this, {
    login: login,
    signUp: signUp,
    redirectTo: redirectTo,
    credentials: credentials,
    settings: settings
  });
}

SudokuCtrl.$inject = [
  '$rootScope',
  '$scope',
  'SudokuModel',
  'UIService',
  '$ionicModal',
  '$filter'
];

AccountCtrl.$inject = [
  '$rootScope',
  '$state',
  'UIService',
  'AccountService'
]

MainCtrl.$inject = [
  '$rootScope'
];

angular.module('sudoku.controllers', [])
  .controller('SudokuCtrl', SudokuCtrl)
  .controller('AccountCtrl', AccountCtrl)
  .controller('MainCtrl', MainCtrl)

