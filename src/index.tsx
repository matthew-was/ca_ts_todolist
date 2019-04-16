import * as React from 'react'
import { render } from 'react-dom'

import { TodoList } from './TodoList/todoList'
import { TodoPresenter } from './TodoList/presenter'

const todoPresenter: TodoPresenter = new TodoPresenter()

import './styles.css'

function App() {
  return (
    <div className="App">
      <TodoList presenter={todoPresenter} />
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
