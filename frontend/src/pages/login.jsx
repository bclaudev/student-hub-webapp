import { LoginForm } from "@/components/login-form"
import ThemeToggle from "@/components/ui/theme-toggle"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"


export default function LoginPage({setUser, fetchUser}) {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <ThemeToggle/>
    </div>
  )
}
