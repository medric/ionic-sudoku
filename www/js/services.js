function SudokuModel() {
  // private
  var grid = [];

  // public
  /**
   * Initializes the grid
   */
  var initGrid = function() {
    for(var x = 0; x < 9; x++) {
      grid[x] = [];
      for(var y = 0; y < 9; y++) {
        grid[x][y] = {};
        grid[x][y].value = getRandomArbitrary(1, 9);
      }
    }
  }

  /**
   *
   * @param y
   * @param value
   * @returns {boolean}
     */
  var checkRow = function(y, value) {
    for(var x = 0; x < 9; x++)
    {
      if(grid[x][y].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param x
   * @param y
   * @param value
   * @returns {boolean}
     */
  var checkRowWithException = function(x, y, value) {
    for(var i = 0; i < 9; i++)
    {
      if(i !== x && grid[i][y].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param x
   * @param value
   * @returns {boolean}
     */
  var checkColumn = function(x, value) {
    for(var y = 0; y < 9; y++) {
      if (grid[x][y].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param x
   * @param y
   * @param value
   * @param exclude
   * @returns {boolean}
     */
  var checkSquare = function(x, y, value) {
    var squareY = Math.Floor(y) / 3 * 3;
    var squareX = Math.Floor(y) / 3 * 3;

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
   *
   * @param x
   * @param y
   * @param value
   * @returns {boolean}
   */
  var checkColumnWithException = function(x, y, value) {
    for(var i = 0; i < 9; i++) {
      if (i !== y && grid[x][i].value === value) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param x
   * @param y
   * @returns {boolean}
   */
  var checkPosition = function(x, y) {
    var value = grid[x][y];
    return value !== 0
      && checkRowWithException(x, y, value) && checkColumnWithException(x, y, value)
      && checkSquare(x, y, value);
  }

  /**
   *
   * @param x
   * @param y
   * @param value
   * @returns {boolean}
     */
  var checkPositionWithValue = function(x, y, value) {
    return checkRow(y, value) && checkColumn(x, value) && checkSquare(x, y, value);
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
    getGrid: getGrid,
    checkPosition: checkPosition,
    checkPositionWithValue: checkPositionWithValue
  }
}

function SudokuNetworkService($rootScope, firebaseArray) {
  // private
  var grids = [];

  // public
  /**
   * Load the grids from firebase
   */
  var loadGrids = function() {
  }

  /**
   * Share a grid over firebase
   * @param grid
   */
  var shareGrid = function(grid) {
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
    shareGrid: shareGrid,
    getGrids: getGrids
  }
}

SudokuModel.$inject = [
];

SudokuNetworkService.$inject = [
  '$rootScope',
  '$firebaseArray'
];

angular.module('sudoku.services', ['firebase'])
.factory('SudokuModel', SudokuModel)
