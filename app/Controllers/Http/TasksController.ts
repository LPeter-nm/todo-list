import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'

export default class TasksController {
  public async index({auth, response}: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const tasks = await Task.query().where('user_id', user.id)
      return tasks
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao listar tarefas', 
        message: error.message
      })
    }
  }

  public async store({request, response, auth}: HttpContextContract) {
    try {
      const user = auth.authenticate()
      const {task} = request.only(['task'])
      const taskReturn = (await user).related('tasks').create({task})
      return taskReturn
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao criar tarefa', 
        message: error.message
      })
    }
  }

  public async show({response, params}: HttpContextContract) {
    try {
      const task = await Task.findByOrFail('id', params.id)
      return task
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao listar tarefa', 
        message: error.message
      })
    }
  }

  public async update({response, params}: HttpContextContract) {
    try {
      const newStatus = true
      const taskReturn = await Task.findByOrFail('id', params.id)
      taskReturn.merge({done: newStatus})
      await taskReturn.save()
      return taskReturn
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao atualizar tarefa', 
        message: error.message
      })
    }
  }

  public async destroy({response, params}: HttpContextContract) {
    try {
      const task = await Task.findByOrFail('id', params.id)
      await task.delete()
      return response.status(203)
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao deletar tarefa', 
        message: error.message
      })
    }
  }
}
