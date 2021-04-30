import React from "https://cdn.skypack.dev/react";

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
    "Snapshot"
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
    "Reset"
  );

const PuzzleList = ({ currentPuzzle, puzzleList, choosePuzzle }) => {
  return e(
    "select",
    {
      style: { margin: '10px '},
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
      style: { margin: '10px' }
    },
    'Check',
    e('input',
      {
        type: 'checkbox',
        checked: check,
        onClick: () => setCheck(!check)
      }
    )
  )
}

const Buttons = ({ currentPuzzle, puzzleList, choosePuzzle, check, setCheck, takeSnapshot, reset }) =>
  e('div',
    {
      // with the SVG board, clicking on top row board squares causes unexpected text selection
      style: { userSelect: 'none' }
    },
    puzzleList && currentPuzzle &&
      e(PuzzleList, { currentPuzzle, puzzleList, choosePuzzle }),
    e(Checkbox, { check, setCheck }),
    e(SnapshotButton, { takeSnapshot }),
    e(Reset, { reset })
  )

export default Buttons;
