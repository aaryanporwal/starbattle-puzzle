import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const e = React.createElement;

const colorSelected = {
  green: 'hsl(120, 50%, 50%)',
  red: 'hsl(0, 50%, 50%)',
  yellow: 'hsl(50, 50%, 50%)'
}

const colorUnselected = {
  green: 'hsl(120, 50%, 40%)',
  red: 'hsl(0, 50%, 40%)',
  yellow: 'hsl(50, 50%, 40%)',
}

const Square = ({ row, column, action }) => {
  // states are 'star', 'cross', 'red', 'green', 'yellow', 'white'
  const [state, setState] = React.useState('white');

  switch (state) {
    case 'star':
      return e(
        'div',
        {
          style: {
            borderStyle: 'solid',
          },
          onClick: () => {
            setState(state === action ? 'white' : action)
          }
        },
        e(
          'div',
          {
            margin: 'auto',
            fontSize: '72px',
          },
          '★'
        )
      );

    case 'cross':
      return e(
        'div',
        {
          style: {
            borderStyle: 'solid',
          },
          onClick: () => {
            setState(state === action ? 'white' : action)
          }
        },
        e(
          'div',
          {
            margin: 'auto',
            fontSize: '72px',
          },
          '❌'
        )
      );

    default:
      return e(
        'div',
        {
          style: {
            backgroundColor: colorSelected[state],
            borderStyle: 'solid',
          },
          onClick: () => {
            setState(state === action ? 'white' : action)
          }
        }
      )
  }
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

const Tool = ({ action, setAction, selected }) => {
  switch (action) {
    case 'star':
      return e(
        'div',
        {
          onClick: () => setAction(action)
        },
        e(
          'div',
          {
            margin: 'auto',
            fontSize: '72px',
          },
          '★'
        )
      )
    case 'cross':
      return e(
        'div',
        {
          onClick: () => setAction(action)
        },
        e(
          'div',
          {
            margin: 'auto',
            fontSize: '72px',
          },
          '❌'
        )
      )
    default:
      return e(
        'div',
        {
          style: {
            backgroundColor: selected ? colorSelected[action] : colorUnselected[action],
          },
          onClick: () => setAction(action)
        }
      )
  }
}

const Toolbar = ({ action, setAction }) =>
  e(
    'div',
    {
       style: {
         padding: '20px',
       }
    },
    e(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 50px)',
          gridTemplateRows: '50px',
        }
      },
      e(Tool, { action: 'star', setAction, selected: action === 'star' }),
      e(Tool, { action: 'cross', setAction, selected: action === 'cross' }),
      e(Tool, { action: 'red', setAction, selected: action === 'red' }),
      e(Tool, { action: 'green', setAction, selected: action === 'green' }),
      e(Tool, { action: 'yellow', setAction, selected: action === 'yellow' }),
    )
  )

const Title = () =>
  e('h1', {}, 'Star Battle Puzzle Party')

const App = () => {
  const [action, setAction] = React.useState('green');
  
  return e(
    'div',
    {},
    e(Title),
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
