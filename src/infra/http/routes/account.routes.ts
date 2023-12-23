import { FastifyInstance } from 'fastify'
import { signUpStudent } from '../controllers/signup-student-controller'
import { registerStudent } from '../controllers/register-student-controller'
import { registerDriver } from '../controllers/register-driver-controller'
import { registerAdmin } from '../controllers/register-admin-controller'
import { authenticate } from '../controllers/authenticate-controller'
import { fetchPendingSolicitations } from '../controllers/fetch-pending-solicitations-controller'
import { userProfile } from '../controllers/user-profile-controller'
import { studentProfile } from '../controllers/student-profile-controller'
import { editStudentProfile } from '../controllers/edit-student-profile-controller'
import { deleteYourAccount } from '../controllers/delete-your-account-controller'
import { changePassword } from '../controllers/change-password-controller'

import { verifyJWT } from '../middlewares/verify-jwt'

export async function accountRoutes(app: FastifyInstance) {
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
