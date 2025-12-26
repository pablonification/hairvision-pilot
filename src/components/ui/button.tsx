import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "xl" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[0_4px_14px_rgba(201,162,39,0.2)] hover:shadow-[0_6px_20px_rgba(201,162,39,0.3)] uppercase": variant === "default",
            "bg-muted text-muted-foreground hover:bg-muted/80": variant === "secondary",
            "border border-border bg-transparent hover:border-accent hover:text-accent": variant === "outline",
            "hover:bg-accent/10 hover:text-accent": variant === "ghost",
            "text-accent underline-offset-4 hover:underline": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded px-3 text-xs": size === "sm",
            "h-12 rounded px-8 text-base": size === "lg",
            "h-14 rounded-md px-10 text-lg w-full": size === "xl",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
