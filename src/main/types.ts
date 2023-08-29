import myzod, { Infer } from 'myzod'

// ---- COOKIES ----

export interface ICookie {
  name: string
  value?: string
  hostOnly: boolean
  domain: string
  path: string
  secure: boolean
  httpOnly: boolean
  session: boolean
  expirationDate?: number
  sameSite: string
}

export const CookieSchema = myzod.object({
  name: myzod.string(),
  value: myzod.string(),
  domain: myzod.string(),
  hostOnly: myzod.boolean(),
  path: myzod.string(),
  secure: myzod.boolean(),
  httpOnly: myzod.boolean(),
  session: myzod.boolean(),
  expirationDate: myzod.number().optional(),
  sameSite: myzod.string()
})

export type Cookie = Infer<typeof CookieSchema>

export const CookiesArraySchema = myzod.array(CookieSchema)

// --- CLIENT ----

export interface WindowSize {
  width: number
  height: number
}
