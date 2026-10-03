import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Nuevo Producto</h1>
        <p className="text-muted-foreground">Agrega un nuevo producto al catálogo.</p>
      </div>
      <div className="max-w-2xl">
        <ProductForm />
      </div>
    </div>
  )
}
