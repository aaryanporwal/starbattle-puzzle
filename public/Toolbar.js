import React from "https://cdn.skypack.dev/react";
import Cross from './Cross.js';
import Star from './Star.js';
import colors from './colors.js';

const e = React.createElement;

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
          backgroundColor: colors[action],
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
          gridTemplateColumns: "repeat(7, 50px)",
          gridTemplateRows: "50px"
        }
      },
      e(Tool, { action: "star", setAction, selected: action === "star" }),
      e(Tool, { action: "cross", setAction, selected: action === "cross" }),
      e(Tool, { action: "yellow", setAction, selected: action === "yellow" }),
      e(Tool, { action: "green", setAction, selected: action === "green" }),
      e(Tool, { action: "aqua", setAction, selected: action === "aqua" }),
      e(Tool, { action: "violet", setAction, selected: action === "violet" }),
      e(Tool, { action: "pink", setAction, selected: action === "pink" }),
    )
  );

export default Toolbar;
