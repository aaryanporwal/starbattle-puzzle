import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import * as Immer from "https://cdn.skypack.dev/immer";
import io from "https://cdn.skypack.dev/socket.io-client";

import Cross from './Cross.js';
import Star from './Star.js';
import Board from './SVGBoard.js';
import Toolbar from './Toolbar.js';

const e = React.createElement;

const SnapshotButton = ({ takeSnapshot }) =>
  e(
    "button",
    {
      style: {
        margin: "10px"
      },
      onClick: takeSnapshot
    },
    "Take snapshot"
  );

const Snapshots = ({ puzzle, snapshots, check, restoreSnapshot }) =>
  e(
    "div",
    {
      style: {
        display: "flex",
        flexWrap: 'wrap',
        justifyContent: 'center',
      }
    },
    ...snapshots.map(board =>
      e(
        "div",
        {
          style: {
            margin: "10px"
          },
          onClick: () => restoreSnapshot(board)
        },
        e(Board, { puzzle, board, check, squareSize: 100 / puzzle.size, makeOnClick: () => () => {} })
      )
    )
  );

const Reset = ({ reset }) =>
  e(
    "button",
    {
      style: {
        margin: "10px"
      },
      onClick: reset
    },
    "Reset Game"
  );

const PuzzleList = ({ currentPuzzle, puzzleList, choosePuzzle }) => {
  return e(
    "select",
    {
      onChange: e => choosePuzzle(e.currentTarget.value)
    },
    puzzleList.map(puzzleName =>
      e(
        "option",
        {
          value: puzzleName,
          selected: currentPuzzle === puzzleName
        },
        puzzleName
      )
    )
  )
}

const Checkbox = ({ check, setCheck }) => {
  return e(
    'span',
    {
      style: { margin: '5px' }
    },
    'Check board',
    e('input',
      {
        type: 'checkbox',
        checked: check,
        onClick: () => setCheck(!check)
      }
    )
  )
}

const App = () => {
  const [action, setAction] = React.useState("cross");
  const [puzzle, setPuzzle] = React.useState(null);
  const [currentPuzzle, setCurrentPuzzle] = React.useState(null);
  const [puzzleList, setPuzzleList] = React.useState(null);
  const [board, setBoard] = React.useState(null);
  const [snapshots, setSnapshots] = React.useState([]);
  const [check, setCheck] = React.useState(false);
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = io();
    socket.current.on("puzzle", puzzle => setPuzzle(puzzle));
    socket.current.on("board", board => setBoard(board));
    socket.current.on("puzzleSelection", puzzleSelection => {
      setPuzzleList(puzzleSelection.puzzleList);
      setCurrentPuzzle(puzzleSelection.currentPuzzle);
    });
    socket.current.on("snapshots", snapshots => setSnapshots(snapshots));
  }, []);

  const makeOnClick = (row, column) => () => {
    setBoard(
      Immer.produce(board, board => {
        const square = board[row][column];
        switch (action) {
          case "star":
          case "cross":
            square.icon = square.icon === action ? "" : action;
            break;
          default:
            square.color = square.color === action ? "" : action;
            break;
        }
      })
    );
    if (!socket.current) return;
    socket.current.emit("click", { row, column, action });
  };

  const takeSnapshot = () => {
    if (!socket.current) return;
    socket.current.emit("takeSnapshot");
  };

  const restoreSnapshot = board => {
    if (!socket.current) return;
    socket.current.emit("restoreSnapshot", board);
  };

  const reset = () => {
    socket.current.emit("reset");
  };

  const choosePuzzle = puzzleName => {
    socket.current.emit("choosePuzzle", puzzleName);    
  };
  
  return e(
    "div",
    {
      style: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }
    },
    e(Toolbar, { action, setAction }),
    e('div',
      {
        style: { userSelect: 'none' }
      },
      puzzleList && currentPuzzle &&
        e(PuzzleList, { currentPuzzle, puzzleList, choosePuzzle }),
      e(Checkbox, { check, setCheck }),
      e(SnapshotButton, { takeSnapshot }),
      e(Reset, { reset })
    ),
    // don't render the board if the size doesn't match
    // i.e. we've received a puzzle update but not yet a board update
    puzzle && board && board.length === puzzle.size &&
      e(Board, { action, puzzle, board, check, squareSize: 500 / puzzle.size, makeOnClick }),
    puzzle && snapshots.length > 0 && snapshots[0].length === puzzle.size &&
      e(Snapshots, { puzzle, snapshots, check, restoreSnapshot }),
  );
};

ReactDOM.render(e(App), document.getElementById("app"));
