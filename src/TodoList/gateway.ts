import request from 'superagent'

interface IServerTodo {
  title: string
  complete: boolean
  id: number
  created: string
}

const url = 'http://localhost:3001'

export class TodoGateway {
  public get = async (): Promise<{
    success: boolean
    todos: IServerTodo[]
  }> => {
    try {
      const response: {
        body: { success: boolean; todos: IServerTodo[] }
      } = await request.get(url)
      return response.body
    } catch (e) {
      throw e
    }
  }

  public post = async (data: { title: string; complete: boolean }) => {
    try {
      await request
        .post(url)
        .set('Content-Type', 'application/json')
        .send(data)
      return
    } catch (e) {
      throw e
    }
  }

  public put = async (data: {
    title: string
    complete: boolean
    id: number
  }) => {
    try {
      await request
        .put(url)
        .set('Content-Type', 'application/json')
        .send(data)
      return
    } catch (e) {
      throw e
    }
  }

  public delete = async (index: number) => {
    try {
      await request.del(`${url}/${index}`)
      return
    } catch (e) {
      throw e
    }
  }
}

export const todoGateway = new TodoGateway()
