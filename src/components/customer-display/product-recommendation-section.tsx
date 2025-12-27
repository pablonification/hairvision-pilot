'use client'

import { BarberInstructions } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface ProductRecommendationSectionProps {
  products: string[]
  instructions: BarberInstructions['styling']
  isActive: boolean
}

const PRODUCT_INFO: Record<string, { description: string; benefit: string }> = {
  'matte clay': {
    description: 'Memberikan tekstur natural dengan finish matte. Hold medium-strong tanpa kilap.',
    benefit: 'Cocok untuk rambut wavy, menciptakan definisi tanpa terlihat basah'
  },
  'sea salt spray': {
    description: 'Spray untuk menambah volume dan tekstur beachy. Lightweight dan mudah di-restyle.',
    benefit: 'Ideal untuk pre-styling, menambah grip dan body pada rambut'
  },
  'pomade': {
    description: 'Classic pomade dengan shine medium-high. Mudah disisir ulang sepanjang hari.',
    benefit: 'Perfect untuk slick back dan side part yang rapi'
  },
  'high hold pomade': {
    description: 'Pomade dengan hold extra kuat dan shine tinggi. Tahan sepanjang hari.',
    benefit: 'Untuk gaya yang butuh presisi dan ketahanan maksimal'
  },
  'blow dry spray': {
    description: 'Heat protectant yang juga menambah volume saat blow dry.',
    benefit: 'Melindungi rambut dari panas sambil mempermudah styling'
  },
  'hair wax': {
    description: 'Wax fleksibel dengan tekstur dan hold medium. Finish natural.',
    benefit: 'Mudah diaplikasi dan bisa di-restyle kapan saja'
  },
  'texture powder': {
    description: 'Powder ringan untuk volume instan dan tekstur matte.',
    benefit: 'Solusi cepat untuk menambah grip dan ketebalan rambut'
  }
}

function getProductInfo(productName: string): { description: string; benefit: string } {
  const normalizedName = productName.toLowerCase()
  
  for (const [key, value] of Object.entries(PRODUCT_INFO)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value
    }
  }
  
  return {
    description: 'Produk styling profesional untuk hasil maksimal.',
    benefit: 'Dipilih khusus berdasarkan tekstur dan gaya rambut Anda'
  }
}

export function ProductRecommendationSection({ products, instructions, isActive }: ProductRecommendationSectionProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
    return undefined
  }, [isActive])

  return (
    <div className={cn(
      "w-full max-w-5xl mx-auto space-y-4 transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-serif mb-2 text-gold-gradient inline-block">
          Produk Styling
        </h2>
        <p className="text-muted-foreground text-base">
          Rekomendasi produk untuk hasil maksimal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product, idx) => {
          const productInfo = getProductInfo(product)
          return (
          <Card 
            key={idx}
            className={cn(
              "overflow-hidden bg-card/40 border-accent/10 hover:border-accent/30 transition-all duration-500 group",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${idx * 150}ms` }}
          >
            <div className="aspect-[16/7] bg-accent/5 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-8 h-8 text-accent opacity-70" />
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-serif text-foreground mb-1 group-hover:text-accent transition-colors">
                {product}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {productInfo.description}
              </p>
              <p className="text-xs text-accent/80 italic">
                {productInfo.benefit}
              </p>
            </div>
          </Card>
        )})}
      </div>

      <div className={cn(
        "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 delay-500",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <Card className="p-5 bg-card/20 border-white/5">
          <h3 className="text-lg font-serif text-foreground mb-3">Cara Penggunaan</h3>
          <ul className="space-y-2">
            {instructions.applicationSteps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-accent/20">
                  {idx + 1}
                </span>
                <span className="text-sm text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-card/20 border-white/5">
          <h3 className="text-lg font-serif text-foreground mb-3">Tips Perawatan</h3>
          <ul className="space-y-2">
            {instructions.maintenanceTips.map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
