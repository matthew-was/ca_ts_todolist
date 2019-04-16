import * as React from 'react'
import styled from '@emotion/styled'
import request from 'superagent'
import moment from 'moment'
import { observer } from 'mobx-react'
import { TodoPresenter } from './presenter'

const Wrapper = styled.div`
  background-color: #f5f5f5;
  padding: 40px;
`

const Heading = styled.h1`
  color: pink;
`

const TodosList = styled.ul`
  list-style-type: none;
  margin: 0 auto;
  width: 400px;
  padding: 20px 0 0 0;
`

const TodosListItem = styled.li`
  margin: 5px 0;
  padding: 5px 0;
`

const TodoItem = styled.div`
  text-decoration: ${(props: { complete: boolean }) =>
    props.complete ? 'line-through' : 'initial'};
  width: 200px;
  display: inline-block;
  vertical-align: middle;
`

const TodoButton = styled.button`
  width: 90px;
  padding: 0 5px;
`

const DateSpan = styled.span`
  color: darkgrey;
  font-size: 0.8em;
`

interface ITodo {
  title: string
  complete: boolean
  id: number
  created: string
}

const Input = (props: {
  value: string
  changeVal: (value: string) => void
  submitTodo: () => void
}) => {
  return (
    <form>
      <input
        type="text"
        placeholder="todo"
        onChange={e => {
          return props.changeVal(e.target.value)
        }}
        value={props.value}
      />
      <button
        type="submit"
        onClick={e => {
          e.preventDefault()
          props.submitTodo()
          return null
        }}
      >
        Save
      </button>
    </form>
  )
}

const List = (props: {
  todos: ITodo[]
  toggleComplete: (id: number) => void
  deleteTodo: (id: number) => void
}) => {
  return props.todos.length > 0 ? (
    <TodosList>
      {props.todos.map(el => {
        return (
          <TodosListItem key={el.title + '-' + el.id}>
            <TodoItem complete={el.complete}>
              {el.title}
              <DateSpan> - {el.created}</DateSpan>
            </TodoItem>
            <TodoButton onClick={() => props.toggleComplete(el.id)}>
              {el.complete ? 'Active' : 'Complete'}
            </TodoButton>
            <TodoButton onClick={() => props.deleteTodo(el.id)}>
              Delete
            </TodoButton>
          </TodosListItem>
        )
      })}
    </TodosList>
  ) : null
}

interface ITodoListProps {
  presenter: TodoPresenter
}

export const TodoList = observer((props: ITodoListProps) => {
  const {
    value,
    changeVal,
    submitTodo,
    todos,
    toggleTodo,
    deleteTodo
  } = props.presenter

  return (
    <Wrapper>
      <Heading>Todo List</Heading>
      <Input value={value} changeVal={changeVal} submitTodo={submitTodo} />
      <List
        todos={todos.filter(todo => todo.complete)}
        toggleComplete={toggleTodo}
        deleteTodo={deleteTodo}
      />
      <List
        todos={todos.filter(todo => !todo.complete)}
        toggleComplete={toggleTodo}
        deleteTodo={deleteTodo}
      />
    </Wrapper>
  )
})

export default TodoList
