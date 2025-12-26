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
      "w-full max-w-5xl mx-auto space-y-8 transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif mb-3 text-gold-gradient inline-block">
          Produk Styling
        </h2>
        <p className="text-muted-foreground text-lg">
          Rekomendasi produk untuk hasil maksimal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div className="aspect-[16/9] bg-accent/5 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
              <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-10 h-10 text-accent opacity-70" />
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-serif text-foreground mb-2 group-hover:text-accent transition-colors">
                {product}
              </h3>
              <p className="text-muted-foreground mb-2">
                {productInfo.description}
              </p>
              <p className="text-sm text-accent/80 italic">
                {productInfo.benefit}
              </p>
            </div>
          </Card>
        )})}
      </div>

      <div className={cn(
        "mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 delay-500",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <Card className="p-8 bg-card/20 border-white/5">
          <h3 className="text-xl font-serif text-foreground mb-6">Cara Penggunaan</h3>
          <ul className="space-y-4">
            {instructions.applicationSteps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-accent/20">
                  {idx + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 bg-card/20 border-white/5">
          <h3 className="text-xl font-serif text-foreground mb-6">Tips Perawatan</h3>
          <ul className="space-y-4">
            {instructions.maintenanceTips.map((tip, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
