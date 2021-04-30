import React from "https://cdn.skypack.dev/react";

const e = React.createElement;

const Cross = ({ onClick, size }) =>
  e(
    "svg",
    {
      width: size,
      height: size,
      onClick
    },
    e(
      'path',
      {
        stroke: 'red',
        strokeWidth: size / 5
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

export default Cross;
