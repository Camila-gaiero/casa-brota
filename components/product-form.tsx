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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, QrCode } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/image-upload"

interface ProductFormProps {
  product?: any
}

export function ProductForm({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    reference_code: product?.reference_code || "",
    materials: product?.materials || "",
    category: product?.category || "Producto",
    status: product?.status || "available",
    is_active: product?.is_active ?? true,
    main_image_url: product?.main_image_url || "",
    gallery: product?.gallery || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleMainImageChange = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData((prev) => ({ ...prev, main_image_url: urls[0] }))
    } else {
      setFormData((prev) => ({ ...prev, main_image_url: "" }))
    }
  }

  const handleGalleryChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, gallery: urls }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        price: formData.price ? Number.parseFloat(formData.price) : null,
      }

      if (product) {
        const { error } = await supabase.from("products").update(dataToSave).eq("id", product.id)

        if (error) throw error
        toast.success("Producto actualizado")
      } else {
        const { error } = await supabase.from("products").insert([dataToSave])

        if (error) throw error
        toast.success("Producto creado")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast.error("Error al guardar el producto")
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = () => {
    if (!product?.id) {
      toast.error("Guarda el producto primero para generar el QR")
      return
    }

    const productUrl = `${window.location.origin}/tienda/${product.id}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(productUrl)}`

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${formData.name}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                font-family: sans-serif;
              }
              img {
                max-width: 300px;
                margin: 20px;
              }
              h2 {
                margin: 10px 0;
                text-align: center;
              }
              p {
                color: #666;
                margin: 5px 0;
                text-align: center;
              }
              .description {
                max-width: 500px;
                color: #333;
                margin: 15px 0;
                text-align: center;
                line-height: 1.5;
              }
              .ref {
                font-weight: bold;
                color: #000;
              }
              @media print {
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <h2>${formData.name}</h2>
            <p class="ref">REF: ${formData.reference_code}</p>
            ${formData.description ? `<p class="description">${formData.description}</p>` : ""}
            <img src="${qrUrl}" alt="QR Code" />
            <p>${productUrl}</p>
            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference_code">Código de Referencia</Label>
          <Input
            id="reference_code"
            name="reference_code"
            value={formData.reference_code}
            onChange={handleChange}
            placeholder="Ej: CB01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Producto">Producto</SelectItem>
              <SelectItem value="Interiorismo">Interiorismo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Disponibilidad</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona disponibilidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="materials">Materiales</Label>
        <Input
          id="materials"
          name="materials"
          value={formData.materials}
          onChange={handleChange}
          placeholder="Ej: Madera de roble, lino, cerámica"
        />
      </div>

      <div className="space-y-4">
        <ImageUpload
          value={formData.main_image_url ? [formData.main_image_url] : []}
          onChange={handleMainImageChange}
          maxImages={1}
          label="Imagen Principal"
        />
      </div>

      <div className="space-y-4">
        <ImageUpload
          value={formData.gallery}
          onChange={handleGalleryChange}
          maxImages={5}
          label="Galería de Imágenes (hasta 5)"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Estado del Producto</Label>
          <p className="text-sm text-muted-foreground">Si está inactivo, no aparecerá en la tienda.</p>
        </div>
        <Switch checked={formData.is_active} onCheckedChange={handleSwitchChange} />
      </div>

      {product && (
        <div className="rounded-lg border p-4 bg-stone-50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Código QR</Label>
              <p className="text-sm text-muted-foreground">Genera un QR para imprimir y mostrar con el producto.</p>
            </div>
            <Button type="button" variant="outline" onClick={generateQRCode}>
              <QrCode className="mr-2 h-4 w-4" />
              Generar QR
            </Button>
          </div>
        </div>
      )}

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
            "Guardar Producto"
          )}
        </Button>
      </div>
    </form>
  )
}
