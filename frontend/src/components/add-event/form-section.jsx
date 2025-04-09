"use client"
import { cn } from "@/lib/utils"

export function FormSection({ title, children, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="border p-4 rounded-md">{children}</div>
    </div>
  )
}
