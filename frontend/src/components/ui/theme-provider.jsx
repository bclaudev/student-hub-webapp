import { useEffect, useState } from "react"

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const stored = localStorage.theme
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const activeTheme = stored || system

    document.documentElement.classList.toggle("dark", activeTheme === "dark")
    setTheme(activeTheme)
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.theme = next
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

import { createContext, useContext } from "react"
const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)
