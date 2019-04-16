import { observable, action } from 'mobx'
import request from 'superagent'
import moment from 'moment'

interface ITodo {
  title: string
  complete: boolean
  id: number
  created: string
}

const url = 'http://localhost:3001'

export class TodoPresenter {
  constructor() {
    this.getTodos()
  }

  @observable
  public value: string = ''

  @action
  public changeVal = (value: string) => {
    this.value = value
  }

  @observable
  public todos: ITodo[] = []

  @action
  public getTodos = async () => {
    try {
      const { body } = await request.get(url)
      if (body.success && body.todos) {
        const newTodos: ITodo[] = body.todos.map((todo: ITodo) => {
          return {
            ...todo,
            created: moment(todo.created).format('HH:mm:ss DD/MM/YYYY')
          }
        })
        this.todos = newTodos
      }
    } catch (e) {
      return
    }
  }

  @action
  public submitTodo = async () => {
    try {
      const todo = {
        title: this.value,
        complete: false
      }
      await request
        .post(url)
        .set('Content-Type', 'application/json')
        .send(todo)
      this.value = ''
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }

  @action
  public toggleTodo = async (index: number) => {
    try {
      const oldTodo = this.todos.find(todo => todo.id === index)
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

  @action
  public deleteTodo = async (index: number) => {
    try {
      await request.del(`${url}/${index}`)
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }
}
