// app/lib/scopeMiddleware.ts

export const validateScope = (requiredScopes: string[]) => {
  return (user: any): boolean => {
    if (!user || !user.scp) {
      return false
    }

    const tokenScopes = user.scp.split(" ")
    return requiredScopes.every(scope => tokenScopes.includes(scope))
  }
}
