import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import * as Immer from "https://cdn.skypack.dev/immer";
import io from "https://cdn.skypack.dev/socket.io-client";

const e = React.createElement;

const Cross = ({ size }) =>
  e(
    "svg",
    {
      width: size,
      height: size
    },
    e("line", {
      x1: 0,
      y1: 0,
      x2: size,
      y2: size,
      stroke: "#FF0000",
      strokeWidth: size / 5
    }),
    e("line", {
      x1: 0,
      y1: size,
      x2: size,
      y2: 0,
      stroke: "#FF0000",
      strokeWidth: size / 5
    })
  );

const Star = ({ size }) =>
  e(
    "svg",
    {
      width: size,
      height: size
    },
    e("polygon", {
      // points of the star lie on a circle with radius size / 2
      // with an angle of 2/5 pi between each
      // to draw the star, sweep an angle by 4/5 pi so we hit every other point
      // point 0 at angle 0 is the middle right of the circle
      // so the top point is point 3 at angle 12/5 pi = 2/5 pi
      // but this results in a rotated star; we want the top point at 1/2 pi
      // so subtract 1/10 pi to rotate the star so the top is at 1/2 pi
      points: new Array(5)
        .fill()
        .map((_, i) => {
          const theta = (4 / 5) * Math.PI * i - (1 / 10) * Math.PI;
          const x = size / 2 + (Math.cos(theta) * size) / 2;
          const y = size / 2 + (Math.sin(theta) * size) / 2;
          return `${x} ${y}`;
        })
        .join(" "),
      stroke: "black",
      strokeWidth: "1"
    })
  );

const colorSelected = {
  green: "hsl(120, 50%, 50%)",
  red: "hsl(0, 50%, 50%)",
  yellow: "hsl(50, 50%, 50%)"
};

const colorUnselected = {
  green: "hsl(120, 50%, 40%)",
  red: "hsl(0, 50%, 40%)",
  yellow: "hsl(50, 50%, 40%)"
};

function borderStyle(wall) {
  return wall === "#" ? "solid blue 2px" : "solid black 1px";
}

const Square = ({
  size,
  row,
  column,
  state,
  onClick,
  top,
  bottom,
  left,
  right
}) => {
  const { color, icon } = state;

  return e(
    "div",
    {
      style: {
        display: "grid",
        backgroundColor: colorSelected[color],
        borderTop: borderStyle(top),
        borderBottom: borderStyle(bottom),
        borderLeft: borderStyle(left),
        borderRight: borderStyle(right)
      },
      onClick
    },
    e(
      "div",
      {
        style: {
          margin: "auto"
        }
      },
      icon === "cross"
        ? e(Cross, { size: size / 2 })
        : icon === "star"
        ? e(Star, { size: size / 2 })
        : null
    )
  );
};

const Board = ({ puzzle, board, size, makeOnClick }) => {
  const children = [];
  const { columns, rows } = puzzle.borders;
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      const top = columns[column][row];
      const bottom = columns[column][row + 1];
      const left = rows[row][column];
      const right = rows[row][column + 1];
      const state = board[row][column];
      const onClick = makeOnClick(row, column);
      children.push(
        e(Square, { size, state, onClick, top, bottom, left, right })
      );
    }
  }

  return e(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(5, ${size}px)`,
        gridTemplateRows: `repeat(5, ${size}px)`,
        border: borderStyle("#"),
        // without an explicit maxWidth, the grid takes up the whole width ?
        maxWidth: `${5 * size + 4}px` // +4 to account for border
      }
    },
    children
  );
};

const Tool = ({ action, setAction, selected }) => {
  let button;
  switch (action) {
    case "star":
    case "cross":
      button = e(
        "div",
        {
          style: {
            margin: "auto"
          }
        },
        e(action === "star" ? Star : Cross, { size: 35 })
      );
      break;

    default:
      button = e("div", {
        style: {
          margin: "auto",
          backgroundColor: colorSelected[action],
          width: "35px",
          height: "35px"
        },
        onClick: () => setAction(action)
      });
  }

  return e(
    "div",
    {
      style: {
        display: "grid",
        backgroundColor: selected ? "lightgray" : "white"
      },
      onClick: () => setAction(action)
    },
    button
  );
};

const Toolbar = ({ action, setAction }) =>
  e(
    "div",
    {
      style: {
        padding: "20px"
      }
    },
    e(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(5, 50px)",
          gridTemplateRows: "50px"
        }
      },
      e(Tool, { action: "star", setAction, selected: action === "star" }),
      e(Tool, { action: "cross", setAction, selected: action === "cross" }),
      e(Tool, { action: "red", setAction, selected: action === "red" }),
      e(Tool, { action: "green", setAction, selected: action === "green" }),
      e(Tool, { action: "yellow", setAction, selected: action === "yellow" })
    )
  );

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

const Snapshots = ({ puzzle, snapshots, restoreSnapshot }) =>
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
        e(Board, { puzzle, board, size: 20, makeOnClick: () => () => {} })
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

const Title = () => e("h1", {}, "Star Battle Puzzle Party");

const App = () => {
  const [action, setAction] = React.useState("green");
  const [puzzle, setPuzzle] = React.useState(null);
  const [board, setBoard] = React.useState(null);
  const [snapshots, setSnapshots] = React.useState([]);
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = io();
    socket.current.on("board", board => setBoard(board));
    socket.current.on("puzzle", puzzle => setPuzzle(puzzle));
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

  return e(
    "div",
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }
    },
    e(Title),
    e(Toolbar, { action, setAction }),
    puzzle && board
      ? e(Board, { action, puzzle, board, size: 100, makeOnClick })
      : null,
    e(SnapshotButton, { takeSnapshot }),
    e(Snapshots, { puzzle, snapshots, restoreSnapshot }),
    e(Reset, { reset })
  );
};

ReactDOM.render(e(App), document.getElementById("app"));
