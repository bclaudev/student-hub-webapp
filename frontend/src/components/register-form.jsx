import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function RegisterForm({ className, ...props }) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        const payload = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password: formData.get("password"),
            dateOfBirth: formData.get("dateOfBirth"),
        }

        const res = await fetch("http://localhost:8787/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
            })
        

        const data = await res.json()

        if (res.ok) {
        console.log("Registered:", data)
        // Optionally: redirect or show toast
        } else {
        console.error("Error:", data)
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-foreground">
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-balance">
              Sign up for Student Hub
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" type="text" placeholder="Claudia" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" type="text" placeholder="QA" required />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="consfirmPassword" type="password" required />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-primary underline underline-offset-4">
              Login
            </a>
          </div>
        </form>

        <div
          className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
