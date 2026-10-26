import type { Access, PayloadRequest } from 'payload'

import { isLocaleCode } from '@resumedia-demo/shared/locales'

export const roles = ['admin', 'editor', 'copywriter'] as const
export type Role = (typeof roles)[number]

/**
 * What a request may do to page content in the current locale.
 * `publish` writes live content, `draft` may only save drafts, `none` is read-only.
 */
export type WriteScope = 'publish' | 'draft' | 'none'

type RequestUser = PayloadRequest['user']

function asUser(user: RequestUser) {
  return user?.collection === 'users' ? user : null
}

export function hasRole(user: RequestUser, ...allowed: Role[]): boolean {
  const u = asUser(user)
  return Boolean(u && allowed.includes(u.role))
}

function roleScope(user: NonNullable<ReturnType<typeof asUser>>, locale: PayloadRequest['locale']): WriteScope {
  switch (user.role) {
    case 'admin':
    case 'editor':
      return 'publish'
    case 'copywriter':
      return isLocaleCode(locale) && Boolean(user.locales?.includes(locale)) ? 'draft' : 'none'
  }
}

export function writeScope(req: PayloadRequest): WriteScope {
  const user = asUser(req.user)
  if (!user) return 'none'
  const scope = roleScope(user, req.locale)
  // MCP keys act as their owner, so a copywriter's key keeps its locale scope. Agents never publish: a person approves.
  const viaMcp = '_strategy' in user && user._strategy === 'mcp-api-key'
  return viaMcp && scope === 'publish' ? 'draft' : scope
}

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')
export const isStaff: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true

export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

// The admin asks this with `data._status: 'published'` to decide whether to show the Publish button.
export const canWritePage: Access = ({ req, data }) => {
  const scope = writeScope(req)
  if (scope === 'none') return false
  if (scope === 'draft' && data?._status === 'published') return false
  return true
}
