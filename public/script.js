import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import * as Immer from "https://cdn.skypack.dev/immer";
import io from "https://cdn.skypack.dev/socket.io-client";

const e = React.createElement;

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

const icons = {
  "": "",
  star: "★",
  cross: "❌"
};

function borderStyle(wall) {
  return wall === "#" ? "2px" : "1px";
}

const Square = ({ row, column, state, onClick, top, bottom, left, right }) => {
  const { color, icon } = state;

  return e(
    "div",
    {
      style: {
        backgroundColor: colorSelected[color],
        borderStyle: "solid",
        borderTopWidth: borderStyle(top),
        borderBottomWidth: borderStyle(bottom),
        borderLeftWidth: borderStyle(left),
        borderRightWidth: borderStyle(right)
      },
      onClick
    },
    e(
      "div",
      {
        margin: "auto",
        fontSize: "72px"
      },
      icons[icon]
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
      children.push(e(Square, { state, onClick, top, bottom, left, right }));
    }
  }

  return e(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(5, ${size}px)`,
        gridTemplateRows: `repeat(5, ${size}px)`
      }
    },
    children
  );
};

const Tool = ({ action, setAction, selected }) => {
  switch (action) {
    case "star":
      return e(
        "div",
        {
          onClick: () => setAction(action)
        },
        e(
          "div",
          {
            margin: "auto",
            fontSize: "72px"
          },
          "★"
        )
      );
    case "cross":
      return e(
        "div",
        {
          onClick: () => setAction(action)
        },
        e(
          "div",
          {
            margin: "auto",
            fontSize: "72px"
          },
          "❌"
        )
      );
    default:
      return e("div", {
        style: {
          backgroundColor: selected
            ? colorSelected[action]
            : colorUnselected[action]
        },
        onClick: () => setAction(action)
      });
  }
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

const Snapshots = ({ puzzle, snapshots, takeSnapshot, restoreSnapshot }) =>
  e(
    "div",
    {
      style: {}
    },
    e(SnapshotButton, { takeSnapshot }),
    e(
      "div",
      {
        style: {
          display: "flex"
        }
      },
      ...snapshots.map(board =>
        e(
          "div",
          {
            style: {
              margin: '10px',
            },
            onClick: restoreSnapshot(board)
          },
          e(Board, { puzzle, board, size: 20, makeOnClick: () => () => {} })
        )
      )
    )
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
    socket.current.on("state", state => setBoard(state.board));
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

  const restoreSnapshot = (board) => {
    if (!socket.current) return;
    socket.current.emit("restoreSnapshot", board);
  };

  return e(
    "div",
    {},
    e(Title),
    e(Toolbar, { action, setAction }),
    puzzle && board
      ? e(Board, { action, puzzle, board, size: 100, makeOnClick })
      : null,
    e(Snapshots, { puzzle, snapshots, takeSnapshot, restoreSnapshot })
  );
};

ReactDOM.render(e(App), document.getElementById("app"));
