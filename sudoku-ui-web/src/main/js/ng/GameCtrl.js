console && console.log("### GameCtrl.js: begin");

var sudokuApp = sudokuApp || angular.module('sudokuApp', []);

sudokuApp.controller('GameCtrl', function ($scope) {
    console.trace("GameCtrl: begin");

    const sudoku = Module("sudoku");

    $scope.Math = Math;


    const createUiCell = function(i,j) {
        const cell = $scope.board.getCell(i,j);
        const digit = cell.getDigit();
        return {
            board: board,
            cell: cell,
            digit: digit,
            uiDigit: digit === -1 ? '' : digit+1,
            hasError: false
        };
    };

    $scope.createUiGame = function() {
        //TODO
    };

    const createBoard = function() {
        $scope.board = new sudoku.Board();
    };

    $scope.resetBoard = function() {
        createBoard();
        createUiBoard();
        if ($scope.autoRefresh) $scope.refreshUiBoard();
    };

    $scope.populateBoard = function() {
        //todo convert to int?
        sudoku.SudokuHelper.populateBoardRandomly2($scope.board, $scope.initialNumberOfDigits, $scope.seed);
        if ($scope.autoRefresh) $scope.refreshUiBoard();
    };

    const createUiBoard = function() {
        // Populate UI board with cell linked to model board
        //todo move to service?
        //todo mey be better to have Array(81)

        const uiBoard = new Array(9);
        for (let i=0; i<9; i++) {
            const row = new Array(9);
            for (let j=0; j<9; j++) {
                row[j] = createUiCell(i,j);
            }
            uiBoard[i] = row;
        }
        $scope.uiBoard = uiBoard;
    };

    const refreshUiBoard = $scope.refreshUiBoard = function() {
        //todo mey be beter to recycle
        createUiBoard();
    };


    const getUiCell = $scope.getUiCell = function(i,j) {
        return $scope.uiBoard[i][j];
    };

    // Return the UI digit (1..9) of a cell.
    const getUiDigit = $scope.getUiDigit = function(i,j) {
        return getUiCell.uiDigit;
    };

    // Tells that the UI digit has changed and we have to update the model accordingly.
    $scope.changeUiDigit = function(i,j) {
        const uiCell = getUiCell(i,j);

        //translate to model digit
        const digit = uiCell.uiDigit === "" ? -1 : uiCell.uiDigit-1;

        try {
            //todo handle exception or other model feedback
            uiCell.cell.changeToDigit(digit, sudoku.CellChange.Reason.PLAYER);

            //todo reset error flag
        } catch (e) {
            if (e instanceof sudoku.BoardSanityException)
            {
                //todo block game except cell
                cell.hasError = true;
            }
        }
    };

    $scope.getUiCellCandidates = function(i,j) {
        const uiCell = getUiCell(i,j);
        // something like "9.7....21"
        const flagsString = uiCell.cell.getUiDigitFlagsString();
        ret = '';

        // Recipe for a one line string
        // Read string in revers and insert html stuff
        for (let k=0; k<9; k++) {
            ret += flagsString.charAt(8-k);
        }

        //// Recipe for a 3x3 shape
        //// Read string in revers and insert html stuff
        //for (let k=0; k<9; k++) {
        //    ret += flagsString.charAt(8-k);
        //    if (k < 8) {
        //        ret += (k+1)%3 === 0 ? '<br/>' : '&nbsp;&nbsp;';
        //    }
        //}
        return ret;
    };

    $scope.applySolverScan = function() {
        const solverStrategy = new sudoku.SolverStrategyScan();
        solverStrategy.applyOnce($scope.board);
        if ($scope.autoRefresh) $scope.refreshUiBoard();
    };

    $scope.applySolverSearch = function() {
        const solverStrategy = new sudoku.SolverStrategySearch();
        solverStrategy.applyOnce($scope.board);
        if ($scope.autoRefresh) $scope.refreshUiBoard();
    };

    $scope.applySolverComposite = function() {
        const solverStrategy = new sudoku.SolverStrategyComposite();
        solverStrategy.applyOnce($scope.board);
        if ($scope.autoRefresh) $scope.refreshUiBoard();
    };

    $scope.undoLastChange = function() {
        cellChange = $scope.board.undoLastChange();
        if ($scope.autoRefresh) $scope.refreshUiBoard();
        console.trace("undoLastChange: cellChange="+cellChange);
    };

    $scope.giveHint = function() {
        //todo NOT IMPLEMENTED
    };

    $scope.giveCell = function() {
        //todo NOT IMPLEMENTED
    };


    //todo finc way to iterate on integers without the need for a collection
    $scope.uiRows = [0,1,2,3,4,5,6,7,8];
    $scope.uiCols = [0,1,2,3,4,5,6,7,8];
    $scope.initialNumberOfDigits = 42;
    $scope.seed = 0;
    $scope.autoRefresh = true;
    createBoard();
    createUiBoard();

    console.trace("GameCtrl: end");
  });

console && console.log("### GameCtrl.js: end");
