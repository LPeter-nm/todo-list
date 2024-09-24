import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({response}: HttpContextContract) {
    try {
      const users = await User.query().preload('tasks')
      return users
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao listar todos os usuários', 
        message: error.message
      })
    }
  }

  public async store({request, response}: HttpContextContract) {
    try {
      const {name, email, password} = request.only(['name', 'email', 'password'])
      const user = await User.create({
        name, 
        email, 
        password
      })
      return user
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao registrar usuário', 
        message: error.message
      })
    }
  }

  public async show({response, params}: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', params.id)
      return user
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao listar o usuário', 
        message: error.message
      })
    }
  }

  public async update({request, response, params}: HttpContextContract) {
    try {
      const {name, email, password} = request.only(['name', 'email', 'password'])
      const user = await User.findByOrFail('id', params.id)
      user.merge({name, email, password})
      await user.save()
      return user
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao atualizar usuário', 
        message: error.message
      })
    }
  }

  public async destroy({response, params}: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
      return response.status(203)
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao deletar usuário', 
        message: error.message
      })
    }
  }
}
