import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single()

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Editar Proyecto</h1>
        <p className="text-muted-foreground">Modifica los detalles del proyecto.</p>
      </div>
      <div className="max-w-2xl">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
