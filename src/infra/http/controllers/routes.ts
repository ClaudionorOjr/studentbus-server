import { FastifyInstance } from 'fastify'
import { signUpStudent } from './signup-student-controller'
import { registerStudent } from './register-student-controller'
import { registerDriver } from './register-driver-controller'
import { registerAdmin } from './register-admin-controller'
import { fetchPendingSolicitations } from './fetch-pending-solicitations-controller'
import { authenticate } from './authenticate-controller'
import { verifyJWT } from '../middlewares/verify-jwt'
import { userProfile } from './user-profile-controller'
import { studentProfile } from './student-profile-controller'
import { editStudentProfile } from './edit-student-profile-controller'
import { deleteYourAccount } from './delete-your-account-controller'
import { changePassword } from './change-password-controller'

export async function routes(app: FastifyInstance) {
  // TODO: Reorganizar rotas!
  /* POST */
  app.post('/signup', signUpStudent)

  app.post(
    '/solicitations/:solicitationId/register',
    { onRequest: [verifyJWT] },
    registerStudent,
  )
  app.post('/drivers/register', registerDriver)
  app.post('/admins/register', registerAdmin)

  app.post('/sessions', authenticate)

  /* GET */
  app.get('/solicitations', fetchPendingSolicitations)
  app.get('/me', { onRequest: [verifyJWT] }, userProfile)
  app.get('/students/me', { onRequest: [verifyJWT] }, studentProfile)

  /* PUT */
  app.put('/students/me', { onRequest: [verifyJWT] }, editStudentProfile)

  /* PATCH */
  app.patch('/change-password', { onRequest: [verifyJWT] }, changePassword)

  /* DELETE */
  app.delete('/me', { onRequest: [verifyJWT] }, deleteYourAccount)
}
