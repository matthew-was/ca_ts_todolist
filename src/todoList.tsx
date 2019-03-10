import * as React from 'react'
import styled from '@emotion/styled'
import request from 'superagent'
import moment from 'moment'

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
      if (body.success && body.todos) {
        const newTodos: ITodo = body.todos.map((todo: ITodo) => {
          return {
            ...todo,
            created: moment(todo.created).format('HH:mm:ss DD/MM/YYYY')
          }
        })
        this.setState({ todos: newTodos })
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
      this.setState({ value: '' })
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }

  toggleTodo = async (index: number) => {
    try {
      const oldTodo = this.state.todos.find(todo => todo.id === index)
      let newTodo = {}
      if (oldTodo && oldTodo.hasOwnProperty('complete')) {
        newTodo = { ...oldTodo, complete: !oldTodo.complete }
      } else {
        return
      }
      await request
        .put(url)
        .set('Content-Type', 'application/json')
        .send(newTodo)
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }

  deleteTodo = async (index: number) => {
    try {
      await request.del(`${url}/${index}`)
      await this.getTodos()
      return
    } catch (e) {
      return
    }
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
