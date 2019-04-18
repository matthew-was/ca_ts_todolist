import { observable, action } from 'mobx'
import moment from 'moment'

import { todoGateway } from './gateway'

interface ITodo {
  title: string
  complete: boolean
  id: number
  created: string
}

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
      const body = await todoGateway.get()
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
      await todoGateway.post(todo)
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
      let newTodo: { id: number; complete: boolean; title: string }
      if (oldTodo && oldTodo.hasOwnProperty('complete')) {
        const { id, complete, title } = oldTodo
        newTodo = { id, title, complete: !complete }
      } else {
        return
      }
      await todoGateway.put(newTodo)
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }

  @action
  public deleteTodo = async (index: number) => {
    try {
      await todoGateway.delete(index)
      await this.getTodos()
      return
    } catch (e) {
      return
    }
  }
}
