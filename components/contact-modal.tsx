"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitLead } from "@/app/actions"
import { WHATSAPP_NUMBER } from "@/lib/site-content"
import { Loader2 } from "lucide-react"

export function ContactModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const response = await submitLead(formData)

    setIsLoading(false)

    if (response.success) {
      setOpen(false)

      // Construct WhatsApp message
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const phone = formData.get("phone") as string
      const source = formData.get("source") as string
      const query = formData.get("query") as string

      const message = `Hola Casa Brota! 👋\n\nMi nombre es ${firstName} ${lastName}.\n\nMis datos de contacto:\n📧 Email: ${email}\n📱 Teléfono: ${phone}\n\n${source ? `Los conocí por: ${source}\n\n` : ""}Consulta:\n${query || "Me gustaría recibir más información."}`

      // Redirect to WhatsApp
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank")
    } else {
      // Handle error (could add toast here)
      alert("Hubo un error. Por favor intentá nuevamente.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hablemos</DialogTitle>
          <DialogDescription>Dejanos tus datos para continuar la conversación por WhatsApp.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source">¿Cómo nos conociste? (Opcional)</Label>
            <Select name="source">
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="recomendacion">Recomendación</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="query">Consulta</Label>
            <Textarea id="query" name="query" placeholder="Escribí tu consulta aquí..." className="min-h-[100px]" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar a WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
