import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const e = React.createElement;

const Square = ({ row, column }) => {
  // states are '', 'star', 'red'
  const [state, setState] = React.useState('');
  
  return `(${row}, ${column})`;
}

const Board = () => {
  const children = [];
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      children.push(e(Square, { row, column }));
    }
  }
  
  return e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
      }
    },
    children
  )
}

const App = () => {
  return e(Board);
}

ReactDOM.render(e(App), document.getElementById('app'));

// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// console.log("hello world :o");

// // define variables that reference elements on our page
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// // a helper function that creates a list item for a given dream
// function appendNewDream(dream) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// }

// // fetch the initial list of dreams
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text
//     dreamsList.firstElementChild.remove();
  
//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);
  
//     // listen for the form to be submitted and add a new dream when it is
//     dreamsForm.addEventListener("submit", event => {
//       // stop our form submission from refreshing the page
//       event.preventDefault();

//       // get dream value and add it to the list
//       let newDream = dreamsForm.elements.dream.value;
//       dreams.push(newDream);
//       appendNewDream(newDream);

//       // reset form
//       dreamsForm.reset();
//       dreamsForm.elements.dream.focus();
//     });
//   });
