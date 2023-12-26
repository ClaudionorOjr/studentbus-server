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
import { refuseSolicitation } from '../controllers/refuse-solicitation-controller'

import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyRole } from '../middlewares/verify-role'

export async function accountRoutes(app: FastifyInstance) {
  /* POST */
  app.post('/signup', signUpStudent)
  app.post(
    '/solicitations/:solicitationId/register',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    registerStudent,
  )
  app.post('/drivers/register', registerDriver)
  app.post(
    '/admins/register',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    registerAdmin,
  )
  app.post('/sessions', authenticate)

  /* GET */
  app.get(
    '/solicitations',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    fetchPendingSolicitations,
  )
  app.get('/me', { onRequest: [verifyJWT] }, userProfile)
  app.get('/students/me', { onRequest: [verifyJWT] }, studentProfile)

  /* PUT */
  app.put('/students/me', { onRequest: [verifyJWT] }, editStudentProfile)

  /* PATCH */
  app.patch('/change-password', { onRequest: [verifyJWT] }, changePassword)
  app.patch(
    '/solicitations/:solicitationId/refuse',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    refuseSolicitation,
  )

  /* DELETE */
  app.delete('/me', { onRequest: [verifyJWT] }, deleteYourAccount)
}
