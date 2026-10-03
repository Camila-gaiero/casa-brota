import { AlertTriangle } from "lucide-react"

/**
 * Se muestra cuando el sitio no puede conectarse a Supabase.
 * Es preferible a un 500: dice exactamente qué revisar.
 */
export function SupabaseConfigError() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-left">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="space-y-2">
            <h1 className="font-semibold text-red-900">Supabase no está configurado</h1>
            <p className="text-sm text-red-800">
              El sitio no puede conectarse a la base de datos. Revisá el archivo{" "}
              <code className="rounded bg-red-100 px-1 py-0.5 text-xs">.env.local</code> y confirmá que tenga:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-red-800">
              <li>
                <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> con una URL válida tipo{" "}
                <code className="text-xs">https://xxxx.supabase.co</code>
              </li>
              <li>
                <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> con la clave pública <em>anon</em>
              </li>
            </ul>
            <p className="text-sm text-red-800">
              Las encontrás en Supabase → <strong>Project Settings → API</strong>. Después reiniciá el servidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}