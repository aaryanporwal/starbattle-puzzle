import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import * as Immer from "https://cdn.skypack.dev/immer";
import io from "https://cdn.skypack.dev/socket.io-client";

import Buttons from './Buttons.js';
import Board from './Board.js';
import Toolbar from './Toolbar.js';

const e = React.createElement;

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

const Labels = ({ size, squareSize, children }) => {
  const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
  let labelSize = 25;
  return e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: `${labelSize}px ${size * squareSize}px`,
        gridTemplateRows: `${labelSize}px ${size * squareSize}px`,
      }
    },
    e('div', {}, ''),
    e(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${squareSize}px)`,
        }
      },
      new Array(size).fill().map((_, i) =>
        e('div', { style: { margin: 'auto' } }, alphabet[i])
      )
    ),
    e(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateRows: `repeat(${size}, ${squareSize}px)`,
        }
      },
      new Array(size).fill().map((_, i) =>
        e('div', { style: { margin: 'auto' } }, i + 1)
      )
    ),
    children
  );
}

const Title = () =>
  e('h1',
    { style: { fontSize: '36px', fontFamily: 'sans-serif', fontStyle: 'italic', margin: '10px' } },
    'STAR BATTLE PUZZLE PARTY'
  )

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
    setBoard(board);
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
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        maxHeight: '100vh',
      },
    },
    e('div'),
    e('div', { style: { alignSelf: 'end' }},
      e(Title),
      e(
        Buttons,
        { currentPuzzle, puzzleList, choosePuzzle, check, setCheck, takeSnapshot, reset }
      ),
    ),
    e('div'),
    e(Toolbar, { action, setAction }),
    puzzle && board && board.length === puzzle.size && e(
      Labels,
      { size: puzzle.size, squareSize: 500 / puzzle.size },
      e(Board, { action, puzzle, board, check, squareSize: 500 / puzzle.size, makeOnClick }),
    ),
    puzzle && snapshots.length > 0 && snapshots[0].length === puzzle.size &&
      e(Snapshots, { puzzle, snapshots, check, restoreSnapshot }),
  );
  

    
    
//     e(
//     "div",
//     {
//       style: {
//         margin: 'auto',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//       }
//     },
//     e('h1',
//       { style: { fontSize: '36px', fontFamily: 'sans-serif', fontStyle: 'italic', margin: '10px' } },
//       'STAR BATTLE PUZZLE PARTY'
//     ),
//     e(Buttons, { currentPuzzle, puzzleList, choosePuzzle, check, setCheck, takeSnapshot, reset }),
//     e('div',
//       {
//         style: {
//           display: 'grid',
//           gridTemplateColumns: `1fr 1fr 1fr`,
//           gridColumnGap: '5px',
//           width: '100%',
//         }
//       },
//     e(Toolbar, { action, setAction }),
//     // don't render the board if the size doesn't match
//     // i.e. we've received a puzzle update but not yet a board update
//     puzzle && board && board.length === puzzle.size && e(
//       Labels,
//       { size: puzzle.size, squareSize: 500 / puzzle.size },
//       e(Board, { action, puzzle, board, check, squareSize: 500 / puzzle.size, makeOnClick }),
//     ),
//     puzzle && snapshots.length > 0 && snapshots[0].length === puzzle.size &&
//       e(Snapshots, { puzzle, snapshots, check, restoreSnapshot }),
//     ),
//   );
};

ReactDOM.render(e(App), document.getElementById("app"));
