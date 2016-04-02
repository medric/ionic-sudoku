function SudokuModel() {
  // private
  var grid = [],
      blockingNumbers,
      stepCount, x, y, dX;

  /**
   * Init position / start
   * @param _x
   * @param _y
     */
  var initPosition = function(_x, _y) {
    dX = 1;
    x = _x;
    y = _y;
  }

  /**
   * Init blockingNumbers lists for each cell
   */
  var initBlockingNumbers = function() {
    blockingNumbers = [];

    for(var i = 0; i < 9; i++) {
      blockingNumbers[i] = [];
      for(var j = 0; j < 9; j++) {
        blockingNumbers[i][j] = [];
      }
    }
  }

  /**
   *  Generates numbers / go all over the grid and check each position
   * @param continueEnabled
     */
  var generateNumber = function() {
    var value;

    if(grid[x][y].value === 0) {
      do {
        value = getRandomArbitrary(1, 9);
      }
      while(blockingNumbers[x][y].length !== 9 && isBlockingNumber(value));

      // blocking step
      if(blockingNumbers[x][y].length === 9) {
        // empty
        blockingNumbers[x][y] = [];

        grid[x][y].value = 0;

        // go back
        previousPosition();

        blockingNumbers[x][y].push(grid[x][y].value);
        grid[x][y].value = 0;
      } else {
        grid[x][y].value = value;

        // move forward
        nextPosition();
      }
    }
  }

  /**
   * Goes to next position
   */
  var nextPosition = function() {
    // go to next position
    x += dX;

    // side effect
    if(x === -1 || x === 9) {
      dX *= -1;
      x += dX;

      // next row
      y++;

      // reset column
      if(y === 9) {
        y = 0;

        if (x == 0) {
          x = 8;
        }
        else if(x == 8) {
          x = 0;
        }

        dX *= -1;
      }
    }
  }

  /**
   * Goes to previous position
   */
  var previousPosition = function() {
    // go to previous position
    x -= dX;

    if(x === -1 || x === 9) {
      dX *= -1;
      x -= dX;

      // previous row
      y--;

      // y < 0
      if(y === -1) {
        y = 8;

        if(x === 0) {
          x = 8;
        }
        else if(x === 8) {
          x = 0;
        }

        dX *= -1;
      }
    }
  }

  /**
   * Checks if the given number is suitable for the current cell
   * @param value
   * @returns {boolean}
     */
  var isBlockingNumber = function(value) {
    if(blockingNumbers[x][y].indexOf(value) !== -1) {
      return true;
    } else if(checkPosition(x, y)) {
      blockingNumbers[x][y].push(value);
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Checks row value
   * @param x
   * @param y
   * @param value
   * @returns {boolean}
   */
  var checkRow = function(_x, _y, value) {
    for(var i = 0; i < 9; i++)
    {
      if(i !== _x && grid[i][_y].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks square
   * @param x
   * @param y
   * @param value
   * @param exclude
   * @returns {boolean}
   */
  var checkSquare = function(_x, _y, value) {
    var squareY = Math.round(_y) / 3 * 3;
    var squareX = Math.round(_x) / 3 * 3;

    for(var testX = 0; testX < 3; testX++) {
      for(var testY = 0; testY < 3; testY++) {
        if (grid[squareX + testX][squareY + testY].value === value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks column
   * @param x
   * @param y
   * @param value
   * @returns {boolean}
   */
  var checkColumn = function(_x, _y, value) {
    for(var i = 0; i < 9; i++) {
      if (i !== _y && grid[_x][i].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks position
   * @param x
   * @param y
   * @returns {boolean}
   */
  var checkPosition = function(_x, _y) {
    var value = grid[_x][_y].value;
    return value !== 0
      && checkRow(_x, _y, value) && checkColumn(_x, _y, value)
      && checkSquare(_x, _y, value);
  }

  // public
  /**
   * Initializes the grid
   */
  var initGrid = function() {
    initBlockingNumbers();
    initPosition(0, 0);

    for(var i = 0; i < 9; i++) {
      grid[i] = [];
      for(var j = 0; j < 9; j++) {
        grid[i][j] = {};
        grid[i][j].value = 0
      }
    }

    stepCount = 0;
    while(grid[x][y].value === 0) {
      generateNumber(true);
      stepCount++;
    }
    //
    // for(var x = 0; x < 9; x++) {
    //   grid[x] = [];
    //   for(var y = 0; y < 9; y++) {
    //     grid[x][y] = {};
    //     grid[x][y].value =
    //   }
    // }
  }

  /**
   * Returns the grid
   * @returns {Array}
     */
  var getGrid = function() {
    return grid;
  }

  // expose
  return {
    initGrid: initGrid,
    getGrid: getGrid
  }
}

function SudokuNetworkService($rootScope, $firebaseArray, $firebaseObject) {
  // private
  var grids = [];


  // public
  /**
   * Load the grids from firebase
   */
  var loadGrids = function() {
    // fill grids array
    grids = $firebaseArray($rootScope.gridsRef);
  }

  /**
   * Watcher
   */
  var sync = function(grid) {
    grids.$watch(function(event) {
    });
  }

  /**
   * Share a grid over firebase
   * @param grid
   */
  var addGrid = function(owner, grid) {
    if(angular.isDefined(owner) && angular.isDefined(grid)) {
      return grids.$add({
        'owner': owner,
        'grid': grid,
        'date': new Date().toString()
      });
    }
  }

  /**
   *
   * @param grid
     */
  var saveGrid = function(index) {
    grids.$save(index).then(function(ref) {
      log('cell updated', ref);
    }).catch(function(err) {
      log(err);
    });
  }

  /**
   * Return the grids
   * @returns {Array}
     */
  var getGrids = function() {
    return grids;
  }

  // expose
  return {
    loadGrids: loadGrids,
    addGrid: addGrid,
    getGrids: getGrids,
    saveGrid: saveGrid,
    sync: sync
  }
}

function UIService($ionicPopup) {
  /**
   * Displays an alert dialog
   * @param title
   * @param template
   * @param cb
     */
  var showAlert = function(title, template, cb) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });

    alertPopup.then(function(res) {
      if(typeof cb !== 'undefined') {
        cb();
      }
    });
  };

  // expose
  return {
    showAlert: showAlert
  }
}

function AccountService() {
  var isConnected = false,
      settings = {
        'sharingEnabled': false,
      };

  var getUserInfo = function() {
    return Ionic.User.current().details;
  }

  // expose
  return {
    isConnected: isConnected,
    getUserInfo: getUserInfo,
    settings: settings
  }
}

SudokuModel.$inject = [
];

SudokuNetworkService.$inject = [
  '$rootScope',
  '$firebaseArray',
  '$firebaseObject'
];

UIService.$inject = [
  '$ionicPopup'
]

AccountService.$inject = [
]

angular.module('sudoku.services', ['firebase'])
  .factory('SudokuModel', SudokuModel)
  .factory('SudokuNetworkService', SudokuNetworkService)
  .factory('UIService', UIService)
  .factory('AccountService', AccountService);
