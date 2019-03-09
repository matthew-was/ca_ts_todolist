import * as React from 'react'
import styled from '@emotion/styled'
import request from 'superagent'

const url = 'http://localhost:3001'

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
  loadingData: boolean
}

class TodoList extends React.Component {
  constructor(props: ITodoListProps) {
    super(props)
    this.state = {
      todos: [],
      value: '',
      loadingData: true
    }
  }

  state: ITodoListState

  componentDidMount() {
    this.getTodos()
  }

  getTodos = async () => {
    try {
      const { body } = await request.get(url)
      console.log('body', body)
      if (body.success && body.todos) {
        this.setState({ todos: body.todos })
      }
    } catch (e) {
      return
    }
  }

  changeVal = (val: string) => this.setState(prevState => ({ value: val }))

  submitTodo = async () => {
    try {
      const todo = {
        title: this.state.value,
        complete: false
      }
      await request
        .post(url)
        .set('Content-Type', 'application/json')
        .send(todo)
      await this.getTodos()
      return
    } catch (e) {
      console.log('submitError', e)
      return
    }
  }

  toggleTodo = (index: number) => {
    const oldTodo = this.state.todos.find(todo => todo.index === index)
    if (oldTodo && oldTodo.hasOwnProperty('complete')) {
      oldTodo.complete = !oldTodo.complete
    }

    const newTodos = this.state.todos.filter(el => {
      return el.index !== index
    })
    newTodos.unshift(oldTodo as ITodo)
    this.setState({ todos: newTodos })
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
