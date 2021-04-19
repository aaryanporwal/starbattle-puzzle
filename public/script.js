import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const e = React.createElement;

const colorSelected = {
  green: 'hsl(0, 50%, )'
}

const colorUnselected = {
  green: 'hsl(0, 50%, )'
}

const Square = ({ row, column, action }) => {
  // states are '', 'star', 'red'
  const [state, setState] = React.useState('white');

  return e(
    'div',
    {
      style: {
        backgroundColor: state,
        outline: 'solid',
      },
      onClick: () => {
        setState(state === action ? 'white' : action)
      }
    },
    e(
      'div',
      {
        style: {
          margin: 'auto',
        },
      },
      `(${row}, ${column})`
    )
  )
}

const Board = ({ action }) => {
  const children = [];
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      children.push(e(Square, { row, column, action }));
    }
  }
  
  return e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 100px)',
        gridTemplateRows: 'repeat(5, 100px)',
      }
    },
    children
  )
}

const Tool = ({ action, selected, onClick }) => {
  e(
    'div',
    {
      style: {
        backgroundColor: action,
        outline: 'solid',
      },
      onClick: () => {
        setState(state === action ? 'white' : action)
      }
      
    }
  )
}

const Toolbar = ({ action, setAction }) => {  
  return e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      }
    },
    'Toolbar',
    'FOo',
    'Bar'
  )
}

const App = () => {
  const [action, setAction] = React.useState('green');
  
  return e(
    'div',
    {},
    e(Toolbar, { action, setAction }),
    e(Board, { action })
  )
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
