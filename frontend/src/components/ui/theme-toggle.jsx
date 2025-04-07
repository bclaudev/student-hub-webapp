import { useTheme } from "@/components/ui/theme-provider"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <Sun size={16} className={theme === "dark" ? "opacity-30" : "opacity-100"} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
      <Moon size={16} className={theme === "dark" ? "opacity-100" : "opacity-30"} />
    </div>
  )
}
