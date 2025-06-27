import { enforceLoginRoles } from '@/auth/oidc'
import { createFileRoute } from '@tanstack/react-router'

export const createProtectedRoute =
  (path: any, roles: string[] = []) =>
  (options?: any) =>
    createFileRoute(path)({
      ...options,
      beforeLoad: async () => {
        await enforceLoginRoles(roles)
        options && (await options.beforeLoad?.())
      },
    })
