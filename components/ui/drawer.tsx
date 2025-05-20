"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

// Import the focus trap hook
import { useFocusTrap } from "@/hooks/use-focus-trap"

const drawerVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition-all ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
)

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof drawerVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

// Add focus trap to the drawer
export function Drawer({ className, children, side = "right", open, onOpenChange, ...props }: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const focusTrapRef = useFocusTrap(isOpen && !isClosing)

  // Rest of the component remains the same

  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  React.useEffect(() => {
    setIsOpen(open || false)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  // Handle ESC key
  React.useEffect(() => {
    if (!isOpen) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleEsc)

    // Prevent body scrolling when drawer is open
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  // Handle animation end for proper cleanup

  const handleCloseWithAnimation = () => {
    setIsClosing(true)
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setIsClosing(false)
      handleClose()
    }, 200) // Match the animation duration for closing
  }

  if (!isMounted) return null

  // Don't render anything if not open and not in closing animation
  if (!isOpen && !isClosing) return null

  // Use createPortal to ensure the drawer is rendered at the root level
  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleCloseWithAnimation}
        aria-hidden="true"
      />
      <div
        ref={focusTrapRef}
        className={cn(drawerVariants({ side }), className)}
        onClick={(e) => e.stopPropagation()}
        data-state={isClosing ? "closed" : "open"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        {...props}
      >
        <button
          onClick={handleCloseWithAnimation}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close drawer"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>,
    document.body,
  )
}

export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />
}

// Update the drawer title to have an ID for aria-labelledby
export function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 id="drawer-title" className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
}

export function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

export function DrawerContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto py-2", className)} {...props}>
      {children}
    </div>
  )
}
