import * as React from 'react'
import { render } from 'react-dom'

import TodoList from './todoList'

import './styles.css'

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
