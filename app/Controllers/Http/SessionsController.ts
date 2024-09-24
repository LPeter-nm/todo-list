import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionsController {
  public async store({request, response, auth}: HttpContextContract) {
    try {
      const {email, password} = request.only(['email', 'password'])
      const token = await auth.attempt(email, password)
      return token
    } catch (error) {
      return response.status(401).json({
        error: 'Credenciais inválidas'
      })
    }
  }

  public async destroy({response, auth}: HttpContextContract) {
    try {
      await auth.logout()
      return response.status(203)
    } catch (error) {
      return response.status(400).json({
        error: 'Erro ao sair', 
        message: error.message
      })
    }
  }
}
