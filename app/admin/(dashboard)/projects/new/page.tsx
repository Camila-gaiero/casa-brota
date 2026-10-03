import { ProjectForm } from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Nuevo Proyecto</h1>
        <p className="text-muted-foreground">Agrega un nuevo proyecto al portafolio.</p>
      </div>
      <div className="max-w-2xl">
        <ProjectForm />
      </div>
    </div>
  )
}
