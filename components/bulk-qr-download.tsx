"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getAllProducts } from "@/app/actions"

export function BulkQRDownload() {
  const [loading, setLoading] = useState(false)

  const generateBulkQR = async () => {
    setLoading(true)
    try {
      const result = await getAllProducts()

      if (!result.success || result.products.length === 0) {
        toast.error("No hay productos activos para generar QR")
        return
      }

      const products = result.products

      // Open new window with all QR codes
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast.error("Por favor permite ventanas emergentes")
        return
      }

      // Build HTML with all products
      let productsHTML = ""
      products.forEach((product: any) => {
        const productUrl = `${window.location.origin}/tienda/${product.id}`
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(productUrl)}`

        productsHTML += `
          <div class="product-card">
            <h2>${product.name}</h2>
            <p class="ref">REF: ${product.reference_code}</p>
            ${product.description ? `<p class="description">${product.description}</p>` : ""}
            <img src="${qrUrl}" alt="QR Code - ${product.name}" />
            <p class="url">${productUrl}</p>
          </div>
        `
      })

      printWindow.document.write(`
        <html>
          <head>
            <title>Códigos QR - Casa Brota</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: sans-serif;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                page-break-after: avoid;
              }
              .header h1 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              .product-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 30px;
                margin-bottom: 40px;
                border: 1px solid #ddd;
                border-radius: 8px;
                page-break-inside: avoid;
                page-break-after: always;
              }
              .product-card:last-child {
                page-break-after: auto;
              }
              h2 {
                margin: 10px 0;
                text-align: center;
                font-size: 20px;
              }
              .ref {
                font-weight: bold;
                color: #000;
                margin: 5px 0;
                font-size: 14px;
              }
              .description {
                max-width: 500px;
                color: #333;
                margin: 15px 0;
                text-align: center;
                line-height: 1.5;
                font-size: 13px;
              }
              img {
                max-width: 300px;
                margin: 20px 0;
              }
              .url {
                color: #666;
                font-size: 12px;
                text-align: center;
                word-break: break-all;
              }
              button {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background: #2d2d2d;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
              }
              button:hover {
                background: #1a1a1a;
              }
              @media print {
                button {
                  display: none;
                }
                body {
                  padding: 0;
                }
                .product-card {
                  border: none;
                  margin: 0;
                  padding: 40px 20px;
                }
              }
            </style>
          </head>
          <body>
            <button onclick="window.print()">Imprimir PDF</button>
            <div class="header">
              <h1>Códigos QR - Casa Brota</h1>
              <p>Total de productos: ${products.length}</p>
            </div>
            ${productsHTML}
          </body>
        </html>
      `)
      printWindow.document.close()

      toast.success(`Se generaron ${products.length} códigos QR`)
    } catch (error) {
      console.error(error)
      toast.error("Error al generar los códigos QR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={generateBulkQR} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Descargar Todos los QR
        </>
      )}
    </Button>
  )
}
