"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { saveSiteContent } from "@/app/actions"
import {
  SITE_CONTENT_FIELDS,
  SITE_CONTENT_GROUPS,
  type SiteContent,
  type SiteContentKey,
} from "@/lib/site-content"

export function SiteContentForm({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const updateField = (key: SiteContentKey, value: string | null) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await saveSiteContent(content as unknown as Record<string, string | null>)

      if (!result.success) {
        toast.error("No se pudo guardar", {
          description: result.message,
        })
        return
      }

      toast.success("Contenido guardado", {
        description: "Los cambios ya están publicados en el sitio.",
      })
      router.refresh()
    })
  }

  const handleReset = () => {
    if (!window.confirm("¿Descartar los cambios sin guardar?")) return
    setContent(initialContent)
    toast.info("Cambios descartados")
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {SITE_CONTENT_GROUPS.map((group) => {
        const fields = SITE_CONTENT_FIELDS.filter((field) => field.group === group.id)

        return (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>

                  {field.type === "image" ? (
                    <ImageUpload
                      label={field.label}
                      maxImages={1}
                      value={content[field.key] ? [content[field.key] as string] : []}
                      onChange={(urls) => updateField(field.key, urls[0] ?? null)}
                    />
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      rows={field.rows ?? 3}
                      value={(content[field.key] as string) ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={(content[field.key] as string) ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border bg-white/90 p-4 backdrop-blur">
        <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Descartar
        </Button>
        <Button type="submit" className="bg-stone-900 hover:bg-stone-800" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}