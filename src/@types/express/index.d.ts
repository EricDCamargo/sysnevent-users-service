import { Role } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user_id: string
      user_role: Role
    }
  }
}
