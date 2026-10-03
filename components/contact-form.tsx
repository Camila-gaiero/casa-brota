"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitLead } from "@/app/actions"
import { WHATSAPP_NUMBER } from "@/lib/site-content"

/**
 * Formulario de la página /contacto.
 * Guarda la consulta en la tabla `leads` y después abre WhatsApp con el resumen,
 * igual que hace el modal de la portada.
 */
export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const response = await submitLead(formData)

    setIsLoading(false)

    if (!response.success) {
      toast.error("No pudimos enviar el mensaje", {
        description: response.message || "Revisá los campos e intentá nuevamente.",
      })
      return
    }

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const source = formData.get("source") as string
    const query = formData.get("query") as string

    const message = `Hola Casa Brota! 👋\n\nMi nombre es ${firstName} ${lastName}.\n\nMis datos de contacto:\n📧 Email: ${email}\n📱 Teléfono: ${phone}\n\n${source ? `Los conocí por: ${source}\n\n` : ""}Consulta:\n${query || "Me gustaría recibir más información."}`

    form.reset()

    toast.success("¡Gracias! Te llevamos a WhatsApp para continuar.", {
      description: "Guardamos tu consulta, no te preocupes si no se abre la ventana.",
    })

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" name="firstName" placeholder="Tu nombre" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" name="lastName" placeholder="Tu apellido" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+54 9 11 ..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">¿Cómo nos conociste? (opcional)</Label>
        <Select name="source">
          <SelectTrigger id="source">
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

      <div className="space-y-2">
        <Label htmlFor="query">Mensaje</Label>
        <Textarea
          id="query"
          name="query"
          placeholder="Contanos sobre tu proyecto..."
          className="min-h-[150px]"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enviar Mensaje
      </Button>
    </form>
  )
}