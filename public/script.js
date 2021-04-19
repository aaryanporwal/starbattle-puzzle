import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import io from 'https://cdn.skypack.dev/socket.io-client';

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

const icons = {
  '': '',
  'star': '★',
  'cross': '❌',
}

const Square = ({ row, column, state, action, onClick }) => {
  const { color, icon } = state;

  return e(
    'div',
    {
      style: {
        backgroundColor: colorSelected[color],
        borderStyle: 'solid',
      },
      onClick
    },
    e(
      'div',
      {
        margin: 'auto',
        fontSize: '72px',
      },
      icons[icon]
    )
  );
}

const Board = ({ action, board, makeOnClick }) => {
  const children = [];
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      const state = board[row][column];
      const onClick = makeOnClick(row, column, action);
      children.push(e(Square, { state, action, onClick }));
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

const Dots = () => {
  return null;
}

const Title = () =>
  e('h1', {}, 'Star Battle Puzzle Party')

const App = () => {
  const [action, setAction] = React.useState('green');
  const [board, setBoard] = React.useState(
    new Array(5).fill().map((_, i) =>
      new Array(5).fill().map((_, j) =>
        ({ color: 'white', icon: '' })
      )
    )
  )
  const socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = io();
    socket.current.on('state', state => setBoard(state.board));
  }, []);
  
  const makeOnClick = (row, column, action) => () => {
    if (!socket.current) return;
    socket.current.emit('click', { row, column, action });
  }
  
  return e(
    'div',
    {},
    e(Title),
    e(Toolbar, { action, setAction }),
    e(Board, { action, board, makeOnClick }),
    e(Dots, {})
  )
}

ReactDOM.render(e(App), document.getElementById('app'));
