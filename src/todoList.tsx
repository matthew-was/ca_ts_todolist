import * as React from 'react'
import styled from '@emotion/styled'
import request from 'superagent'

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
  text-decoration: ${props => (props.complete ? 'line-through' : 'initial')};
  width: 200px;
  display: inline-block;
  vertical-align: middle;
`

const TodoButton = styled.button`
  width: 90px;
  padding: 0 5px;
`

interface ITodo {
  title: string
  complete: boolean
  index: number
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
      {props.todos.map((el, index) => {
        return (
          <TodosListItem key={el.title + '-' + index}>
            <TodoItem complete={el.complete}>{el.title}</TodoItem>
            <TodoButton onClick={() => props.toggleComplete(el.index)}>
              {el.complete ? 'Active' : 'Complete'}
            </TodoButton>
            <TodoButton onClick={() => props.deleteTodo(el.index)}>
              Delete
            </TodoButton>
          </TodosListItem>
        )
      })}
    </TodosList>
  ) : null
}

interface ITodoListProps {}

interface ITodoListState {
  todos: ITodo[]
  value: string
  index: number
  loadingData: boolean
}

class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      value: '',
      index: 0,
      loadingData: true
    }
  }

  props: ITodoListProps
  state: ITodoListState

  componentDidMount() {
    console.log('fetching')
    this.fetchData()
  }

  fetchData = async () => {
    console.log('request')
    try {
      const response = await request.get('localhost:3000/all')
      console.log('response', response)
    } catch (e) {
      console.log('fetch error', e)
    }
  }

  changeVal = val => this.setState(prevState => ({ value: val }))

  submitTodo = () => {
    if (this.state.value === '') return
    const newTodos = [...this.state.todos]
    const todo = {
      title: this.state.value,
      complete: false,
      index: this.state.index
    }
    const newIndex = this.state.index + 1
    newTodos.push(todo)
    this.setState(prevState => ({
      todos: newTodos,
      value: '',
      index: newIndex
    }))
    return
  }

  toggleTodo = (index: number) => {
    const oldTodo = this.state.todos.find(todo => todo.index === index)
    oldTodo.complete = !oldTodo.complete
    const newTodos = this.state.todos.filter(el => {
      return el.index !== index
    })
    newTodos.unshift(oldTodo)
    this.setState(prevState => ({ todos: newTodos }))
    return
  }

  deleteTodo = (index: number) => {
    const newTodos = this.state.todos.filter(el => {
      return el.index !== index
    })
    this.setState(prevState => ({ todos: newTodos }))
    return
  }

  render() {
    return (
      <Wrapper>
        <Heading>Todo List</Heading>
        <Input
          value={this.state.value}
          changeVal={this.changeVal}
          submitTodo={this.submitTodo}
        />
        <List
          todos={this.state.todos.filter(todo => todo.complete)}
          toggleComplete={this.toggleTodo}
          deleteTodo={this.deleteTodo}
        />
        <List
          todos={this.state.todos.filter(todo => !todo.complete)}
          toggleComplete={this.toggleTodo}
          deleteTodo={this.deleteTodo}
        />
      </Wrapper>
    )
  }
}

export default TodoList
