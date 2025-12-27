'use client'

import { HairstyleRecommendation, GeometricAnalysis } from '@/types'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, X } from 'lucide-react'

interface PrintBarberScriptProps {
  recommendation: HairstyleRecommendation
  analysis: GeometricAnalysis
  onClose: () => void
}

export function PrintBarberScript({ recommendation, analysis, onClose }: PrintBarberScriptProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HairVision - ${recommendation.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #c9a227; 
              padding-bottom: 15px; 
              margin-bottom: 20px; 
            }
            .header h1 { font-size: 28px; color: #c9a227; margin-bottom: 5px; }
            .header p { color: #666; font-size: 14px; }
            .client-info { 
              background: #f5f5f5; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px; 
            }
            .client-info h2 { font-size: 16px; color: #666; margin-bottom: 10px; }
            .client-info .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
            .client-info .item { text-align: center; }
            .client-info .label { font-size: 11px; color: #999; text-transform: uppercase; }
            .client-info .value { font-size: 16px; font-weight: 600; }
            .section { margin-bottom: 20px; }
            .section h3 { 
              font-size: 14px; 
              text-transform: uppercase; 
              letter-spacing: 1px; 
              color: #c9a227; 
              border-bottom: 1px solid #eee;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .instruction-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px dotted #ddd; 
            }
            .instruction-row:last-child { border-bottom: none; }
            .instruction-label { font-weight: 500; }
            .instruction-value { color: #666; }
            .products { display: flex; gap: 10px; flex-wrap: wrap; }
            .product-tag { 
              background: #f0f0f0; 
              padding: 5px 12px; 
              border-radius: 20px; 
              font-size: 13px; 
            }
            .steps { counter-reset: step; }
            .step { 
              padding: 8px 0 8px 35px; 
              position: relative; 
              border-bottom: 1px dotted #ddd; 
            }
            .step:last-child { border-bottom: none; }
            .step::before { 
              counter-increment: step; 
              content: counter(step); 
              position: absolute; 
              left: 0; 
              width: 24px; 
              height: 24px; 
              background: #c9a227; 
              color: white; 
              border-radius: 50%; 
              text-align: center; 
              line-height: 24px; 
              font-size: 12px; 
              font-weight: 600;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 15px; 
              border-top: 1px solid #eee;
              color: #999;
              font-size: 11px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const bi = recommendation.barberInstructions

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="font-semibold">Preview Cetak</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Cetak
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div ref={printRef} className="p-6">
          <div className="header">
            <h1>HairVision</h1>
            <p>Instruksi Potong Rambut</p>
          </div>

          <div className="client-info">
            <h2>Profil Klien</h2>
            <div className="grid">
              <div className="item">
                <div className="label">Bentuk Wajah</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{analysis.faceShape}</div>
              </div>
              <div className="item">
                <div className="label">Tekstur Rambut</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{analysis.hairTexture}</div>
              </div>
              <div className="item">
                <div className="label">Densitas</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{analysis.hairDensity}</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{recommendation.name}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Match Score: {recommendation.suitabilityScore}%</div>
          </div>

          <div className="section">
            <h3>Samping (Sides)</h3>
            <div className="instruction-row">
              <span className="instruction-label">Clipper Guard</span>
              <span className="instruction-value">{bi.sides.clipperGuard}</span>
            </div>
            {bi.sides.fadeType && (
              <div className="instruction-row">
                <span className="instruction-label">Fade Type</span>
                <span className="instruction-value">{bi.sides.fadeType.replace('_', ' ')}</span>
              </div>
            )}
            <div className="instruction-row">
              <span className="instruction-label">Blending Notes</span>
              <span className="instruction-value">{bi.sides.blendingNotes}</span>
            </div>
          </div>

          <div className="section">
            <h3>Atas (Top)</h3>
            <div className="instruction-row">
              <span className="instruction-label">Panjang</span>
              <span className="instruction-value">{bi.top.lengthCm} cm ({bi.top.lengthInches} inch)</span>
            </div>
            <div className="instruction-row">
              <span className="instruction-label">Teknik</span>
              <span className="instruction-value">{bi.top.technique}</span>
            </div>
            <div className="instruction-row">
              <span className="instruction-label">Layering</span>
              <span className="instruction-value">{bi.top.layeringNotes}</span>
            </div>
          </div>

          <div className="section">
            <h3>Belakang (Back)</h3>
            <div className="instruction-row">
              <span className="instruction-label">Neckline</span>
              <span className="instruction-value">{bi.back.necklineShape}</span>
            </div>
            <div className="instruction-row">
              <span className="instruction-label">Clipper Guard</span>
              <span className="instruction-value">{bi.back.clipperGuard}</span>
            </div>
            <div className="instruction-row">
              <span className="instruction-label">Blending</span>
              <span className="instruction-value">{bi.back.blendingNotes}</span>
            </div>
          </div>

          <div className="section">
            <h3>Tekstur</h3>
            <div className="instruction-row">
              <span className="instruction-label">Teknik</span>
              <span className="instruction-value">{bi.texture.techniques.join(', ')}</span>
            </div>
            <div className="instruction-row">
              <span className="instruction-label">Notes</span>
              <span className="instruction-value">{bi.texture.notes}</span>
            </div>
          </div>

          <div className="section">
            <h3>Produk Styling</h3>
            <div className="products">
              {bi.styling.products.map((product, i) => (
                <span key={i} className="product-tag">{product}</span>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Langkah Aplikasi</h3>
            <div className="steps">
              {bi.styling.applicationSteps.map((step, i) => (
                <div key={i} className="step">{step}</div>
              ))}
            </div>
          </div>

          <div className="footer">
            HairVision AI • Powered by Gemini • {new Date().toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}
