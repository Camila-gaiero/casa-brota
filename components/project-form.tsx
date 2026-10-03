"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ProjectFormProps {
  project?: any
}

export function ProjectForm({ project }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    location: project?.location || "",
    year: project?.year || new Date().getFullYear(),
    cover_image: project?.cover_image || "",
    is_active: project?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `project-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, cover_image: publicUrl }))
      toast.success("Imagen subida correctamente")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, cover_image: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        year: Number.parseInt(formData.year.toString()),
      }

      if (project) {
        const { error } = await supabase.from("projects").update(dataToSave).eq("id", project.id)

        if (error) throw error
        toast.success("Proyecto actualizado")
      } else {
        const { error } = await supabase.from("projects").insert([dataToSave])

        if (error) throw error
        toast.success("Proyecto creado")
      }

      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      toast.error("Error al guardar el proyecto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Proyecto</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ej: Buenos Aires, Argentina"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Año</Label>
          <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="space-y-4">
        <Label>Imagen de Portada</Label>

        {formData.cover_image ? (
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-stone-100">
            <Image src={formData.cover_image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="relative aspect-video w-full max-w-md border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-colors bg-stone-50">
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
            {uploading ? (
              <Loader2 className="h-12 w-12 text-stone-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-12 w-12 text-stone-400 mb-4" />
                <span className="text-sm text-stone-600 font-medium">Subir imagen de portada</span>
                <span className="text-xs text-stone-500 mt-2">JPG, PNG, WEBP (máx. 10MB)</span>
              </>
            )}
          </label>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Estado del Proyecto</Label>
          <p className="text-sm text-muted-foreground">Si está inactivo, no aparecerá en el portafolio.</p>
        </div>
        <Switch checked={formData.is_active} onCheckedChange={handleSwitchChange} />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-stone-900 hover:bg-stone-800" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Proyecto"
          )}
        </Button>
      </div>
    </form>
  )
}
