import React from "https://cdn.skypack.dev/react";
import Cross from "./Cross.js";
import Star from "./Star.js";
import colors from "./colors.js";

const e = React.createElement;

function borderStyle(size, thick) {
  if (size > 20) return thick ? "solid black 4px" : "dashed black 1px";
  else return thick ? "solid black 2px" : "dashed black 1px";
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
  right,
  conflict
}) => {
  const { color, icon } = state;

  return e(
    "g",
    {
      transform: `translate(${size * column} ${size * row})`
    },
    e("rect", {
      width: size,
      height: size,
      fill: colors[color],
      stroke: 'black',
      strokeDasharray: '4 4',
      onClick: onClick
    }),
    icon === "cross"
      ? e(Cross, { size: size / 2 })
      : icon === "star"
      ? e(Star, { conflict, size: size / 2 })
      : null,
    top && e('path', { stroke: 'black', strokeWidth: '4', d: `M 0 0 L ${size} 0` }),
    bottom && e('path', { stroke: 'black', strokeWidth: '4', d: `M 0 ${size} L ${size} ${size}` }),
  );
};

const Board = ({ puzzle, board, check, squareSize, makeOnClick }) => {
  const children = [];
  const regions = puzzle.regions;
  const size = puzzle.size;
  const stars = puzzle.stars;

  const rowCounts = new Array(size).fill(0);
  const columnCounts = new Array(size).fill(0);
  const regionCounts = new Array(size * size).fill(0);

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board[row][column].icon === "star") {
        rowCounts[row]++;
        columnCounts[column]++;
        regionCounts[regions[row][column]]++;
      }
    }
  }

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const region = regions[row][column];
      const top = row === 0 || regions[row - 1][column] !== region;
      const bottom = row === size - 1 || regions[row + 1][column] !== region;
      const left = column === 0 || regions[row][column - 1] !== region;
      const right = column === size - 1 || regions[row][column + 1] !== region;
      const state = board[row][column];
      const onClick = makeOnClick(row, column);

      let conflict = false;
      if (check && state.icon === "star") {
        if (rowCounts[row] > stars) conflict = true;
        if (columnCounts[column] > stars) conflict = true;
        if (regionCounts[regions[row][column]] > stars) conflict = true;
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = column - 1; c <= column + 1; c++) {
            if (
              r >= 0 &&
              r < size &&
              c >= 0 &&
              c < size &&
              !(r === row && c === column) &&
              board[r][c].icon === "star"
            )
              conflict = true;
          }
        }
      }

      children.push(
        e(Square, {
          row,
          column,
          size: squareSize,
          state,
          onClick,
          conflict,
          top,
          bottom,
          left,
          right
        })
      );
    }
  }

  return e(
    "svg",
    {
      width: size * squareSize,
      height: size * squareSize
    },
    children
  );
};

export default Board;
