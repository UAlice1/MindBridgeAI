import { createContext, useContext } from 'react'

export type Lang = 'en' | 'rw'
export interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  /** Pick the string for the current language. */
  t: (en: string, rw: string) => string
  alias: string
  setAlias: (a: string) => void
  openHelp: () => void
}
export const AppContext = createContext<AppState | null>(null)
export function useApp() {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used inside AppContext')
  return v
}
