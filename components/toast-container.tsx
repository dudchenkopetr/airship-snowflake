"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.type} onClose={() => removeToast(toast.id)}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
        </Toast>
      ))}
    </ToastProvider>
  )
}
