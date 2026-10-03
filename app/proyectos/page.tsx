import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function ProjectsPage() {
  let projects: Array<{
    id: string
    name: string
    location?: string | null
    cover_image?: string | null
  }> = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("No se pudieron cargar los proyectos:", error.message)
    }

    projects = data ?? []
  } catch (error) {
    console.error("Fallo cargando los proyectos:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-32 md:py-40 bg-background">
          <div className="container mx-auto px-8 md:px-16 lg:px-32">
            <div className="max-w-2xl mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">Nuestros Proyectos</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explorá nuestra colección de espacios transformados. Cada proyecto es una historia única de diseño,
                funcionalidad y calidez.
              </p>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
                {projects.map((project) => (
                  <Link key={project.id} href={`/proyectos/${project.id}`} className="group block space-y-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                      {project.cover_image ? (
                        <Image
                          src={project.cover_image || "/placeholder.svg"}
                          alt={project.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-medium group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-muted-foreground">{project.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No hay proyectos disponibles en este momento.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Estas páginas muestran contenido editable desde /admin/contenido.
// Se renderizan por request para que los cambios del panel se vean al instante.
export const dynamic = "force-dynamic"
