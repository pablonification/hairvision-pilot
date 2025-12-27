import type { AnalysisResult, StyleCompatibility } from '@/types'

export const DUMMY_COMPATIBILITY_MATRIX: StyleCompatibility[] = [
  {
    styleName: 'Textured Crop',
    matchScorePercent: 94,
    keyReasons: [
      'Bentuk wajah oval sangat fleksibel',
      'Tekstur rambut wavy menambah volume alami',
      'Low maintenance, cocok untuk gaya aktif',
    ],
    concerns: [],
  },
  {
    styleName: 'Undercut Fade',
    matchScorePercent: 87,
    keyReasons: [
      'Fade di sisi memberikan definisi pada rahang',
      'Kontras tinggi menciptakan look modern',
    ],
    concerns: ['Perlu trim setiap 2-3 minggu'],
  },
  {
    styleName: 'Classic Pompadour',
    matchScorePercent: 78,
    keyReasons: [
      'Volume di atas menyeimbangkan proporsi wajah',
      'Look klasik dan profesional',
    ],
    concerns: ['Butuh waktu styling 10-15 menit', 'Perlu produk hold tinggi'],
  },
  {
    styleName: 'Buzz Cut',
    matchScorePercent: 65,
    keyReasons: ['Ultra low maintenance', 'Clean dan minimalis'],
    concerns: [
      'Kurang menonjolkan fitur wajah',
      'Bentuk kepala harus ideal',
    ],
  },
  {
    styleName: 'Slick Back',
    matchScorePercent: 72,
    keyReasons: ['Tampilan profesional', 'Cocok untuk formal'],
    concerns: ['Perlu rambut lebih panjang', 'Daily styling required'],
  },
]

export const DUMMY_ANALYSIS_RESULT: AnalysisResult = {
  id: 'demo-analysis-001',
  sessionId: 'demo-session-001',
  geometricAnalysis: {
    faceShape: 'oval',
    faceShapeConfidencePercent: 87,
    faceProportions: {
      foreheadToFaceRatioPercent: 33,
      jawToForeheadRatioPercent: 95,
      faceLengthToWidthRatio: 1.4,
      symmetryScorePercent: 91,
      chinProminence: 'balanced',
      cheekboneDefinition: 'moderate',
    },
    hairAnalysis: {
      texture: 'wavy',
      textureConfidencePercent: 82,
      density: 'medium',
      densityConfidencePercent: 88,
      growthPattern: 'Crown searah jarum jam, natural part di kiri',
      hairlineType: 'straight',
      naturalPartSide: 'left',
    },
    hairTexture: 'wavy',
    hairDensity: 'medium',
    jawlineWidth: 'Proporsional dengan dahi, garis rahang tegas',
    foreheadWidth: 'Medium, 3 jari, seimbang dengan wajah',
    cheekboneHeight: 'Tulang pipi moderate, memberikan struktur',
    problemAreas: ['Sedikit flat di bagian crown', 'Volume kurang di sisi'],
  },
  compatibilityMatrix: DUMMY_COMPATIBILITY_MATRIX,
  recommendations: [
    {
      id: 'rec_1',
      name: 'Textured Crop',
      description:
        'Gaya modern dengan tekstur alami di bagian atas dan fade clean di sisi. Perfect untuk daily look yang effortless.',
      geometricReasoning:
        'Wajah oval Anda sangat versatile. Textured crop menambah dimensi di bagian atas sambil menjaga sisi tetap clean, menciptakan proporsi ideal.',
      whyItWorks: [
        'Bentuk wajah oval = canvas sempurna untuk hampir semua style',
        'Tekstur wavy alami Anda akan memberikan volume tanpa perlu banyak produk',
        'Fade di sisi akan mempertegas garis rahang yang sudah proporsional',
        'Low maintenance - hanya perlu 2-3 menit styling',
      ],
      suitabilityScore: 94,
      barberInstructions: {
        styleName: 'Textured Crop',
        sides: {
          clipperGuard: '1.5',
          fadeType: 'mid_fade',
          blendingNotes:
            'Mulai skin fade 1 jari di atas telinga, blend ke guard 2 di temple. Gunakan clipper over comb untuk transisi mulus.',
        },
        top: {
          lengthCm: 5,
          lengthInches: 2,
          technique: 'Point cutting dengan elevasi 45 derajat',
          layeringNotes:
            'Internal layering untuk movement. Jaga weight di bagian depan untuk styling versatility.',
        },
        back: {
          necklineShape: 'tapered',
          clipperGuard: '1',
          blendingNotes:
            'Blend seamless ke sisi. Perhatikan occipital bone - build out jika flat.',
        },
        texture: {
          techniques: ['point_cutting', 'texturizing_shears'],
          notes:
            'Texturize bagian atas 20-30% untuk menghilangkan bulk sambil menjaga shape.',
        },
        styling: {
          products: ['Matte Clay', 'Sea Salt Spray'],
          applicationSteps: [
            'Handuk kering sampai 80% damp',
            'Apply sea salt spray ke akar untuk texture',
            'Blow dry dengan medium heat, arahkan ke atas dan belakang',
            'Hangatkan clay sebesar kacang di telapak tangan',
            'Apply ke mid-lengths dan ends',
            'Define pieces dengan jari',
          ],
          maintenanceTips: [
            'Trim setiap 3-4 minggu',
            'Styling harian: 3 menit',
            'Cuci setiap 2-3 hari',
          ],
        },
      },
    },
    {
      id: 'rec_2',
      name: 'Modern Undercut',
      description:
        'Kontras bold antara sisi yang sangat pendek dengan top yang lebih panjang. Statement style yang tetap versatile.',
      geometricReasoning:
        'Undercut menciptakan contrast yang kuat, mempertegas struktur wajah oval Anda. Sisi yang clean membuat wajah terlihat lebih defined.',
      whyItWorks: [
        'Disconnect yang tegas menciptakan visual interest',
        'Sisi super clean mempertegas tulang pipi moderate Anda',
        'Top yang lebih panjang bisa di-style berbagai cara',
        'Look modern dan edgy tanpa terlalu extreme',
      ],
      suitabilityScore: 87,
      barberInstructions: {
        styleName: 'Modern Undercut',
        sides: {
          clipperGuard: '1',
          fadeType: 'high_fade',
          blendingNotes:
            'High disconnect di parietal ridge. Clean fade ke skin di bawah. Sharp line di temple.',
        },
        top: {
          lengthCm: 7,
          lengthInches: 2.75,
          technique: 'Scissor cut dengan slide cutting untuk texture',
          layeringNotes:
            'Keep length uniform di top, slight graduation ke belakang untuk natural fall.',
        },
        back: {
          necklineShape: 'squared',
          clipperGuard: '0.5',
          blendingNotes: 'Sharp line up di neckline. Clean edges semua around.',
        },
        texture: {
          techniques: ['slide_cutting', 'point_cutting'],
          notes:
            'Slide cut untuk soft texture di ends. Point cut untuk remove weight tanpa menghilangkan length.',
        },
        styling: {
          products: ['High Hold Pomade', 'Blow Dry Spray'],
          applicationSteps: [
            'Apply blow dry spray ke rambut damp',
            'Blow dry ke arah yang diinginkan',
            'Apply pomade untuk hold dan shine',
            'Style slick back atau ke samping sesuai preferensi',
          ],
          maintenanceTips: [
            'Trim sides setiap 2 minggu untuk menjaga sharpness',
            'Styling harian: 5-7 menit',
            'Deep condition weekly untuk menjaga kesehatan rambut',
          ],
        },
      },
    },
  ],
  visualizations: {
    rec_1: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=800&fit=crop',
    rec_2: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=800&fit=crop',
  },
  createdAt: new Date(),
}
