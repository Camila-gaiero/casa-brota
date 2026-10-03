import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-32 md:py-48 bg-background">
          <div className="container px-6 md:px-12 lg:px-24">
            <Link
              href="/proyectos"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-12 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Proyectos
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 mb-24">
              <div className="space-y-8">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {project.name}
                </h1>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-y border-stone-200 py-4">
                  {project.location && (
                    <div className="flex items-center">
                      <span className="font-medium text-foreground mr-2">Ubicación:</span>
                      {project.location}
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-center">
                      <span className="font-medium text-foreground mr-2">Año:</span>
                      {project.year}
                    </div>
                  )}
                </div>
                <div className="prose prose-stone prose-lg max-w-none text-muted-foreground leading-relaxed">
                  {project.description}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                {project.cover_image ? (
                  <Image
                    src={project.cover_image || "/placeholder.svg"}
                    alt={project.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Sin imagen</div>
                )}
              </div>
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-12">
                <h2 className="font-serif text-3xl font-bold text-foreground">Galería</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {project.gallery.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${project.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
