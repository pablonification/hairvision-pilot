export type PhotoAngle = 'front' | 'top' | 'left' | 'right'

export interface CapturedPhoto {
  angle: PhotoAngle
  dataUrl: string
  capturedAt: Date
}

export interface PhotoSession {
  id: string
  photos: Record<PhotoAngle, CapturedPhoto | null>
  createdAt: Date
}

export type FaceShape =
  | 'diamond'
  | 'oval'
  | 'square'
  | 'round'
  | 'heart'
  | 'triangle'
  | 'oblong'

export type HairTexture = 'straight' | 'wavy' | 'curly' | 'coily'

export type HairDensity = 'thin' | 'medium' | 'thick'

export interface FaceProportions {
  foreheadToFaceRatioPercent: number
  jawToForeheadRatioPercent: number
  faceLengthToWidthRatio: number
  symmetryScorePercent: number
  chinProminence: 'recessed' | 'balanced' | 'prominent'
  cheekboneDefinition: 'subtle' | 'moderate' | 'pronounced'
}

export interface HairAnalysis {
  texture: HairTexture
  textureConfidencePercent: number
  density: HairDensity
  densityConfidencePercent: number
  growthPattern: string
  hairlineType: 'straight' | 'widows_peak' | 'receding' | 'm_shaped' | 'rounded'
  naturalPartSide: 'left' | 'right' | 'center' | 'none'
}

export interface StyleCompatibility {
  styleName: string
  matchScorePercent: number
  keyReasons: string[]
  concerns: string[]
}

export interface GeometricAnalysis {
  faceShape: FaceShape
  faceShapeConfidencePercent?: number
  faceProportions?: FaceProportions
  hairAnalysis?: HairAnalysis
  hairTexture: HairTexture
  hairDensity: HairDensity
  jawlineWidth: string
  foreheadWidth: string
  cheekboneHeight: string
  problemAreas: string[]
}

export type ClipperGuard =
  | '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'

export type FadeType =
  | 'skin_fade'
  | 'low_fade'
  | 'mid_fade'
  | 'high_fade'
  | 'drop_fade'
  | 'taper_fade'
  | 'burst_fade'
  | 'temple_fade'

export type TexturizingTechnique =
  | 'point_cutting'
  | 'slide_cutting'
  | 'razor_cutting'
  | 'thinning_shears'
  | 'texturizing_shears'
  | 'twist_cutting'

export interface BarberInstructions {
  styleName: string
  sides: {
    clipperGuard: ClipperGuard
    fadeType: FadeType | null
    blendingNotes: string
  }
  top: {
    lengthCm: number
    lengthInches: number
    technique: string
    layeringNotes: string
  }
  back: {
    necklineShape: 'squared' | 'rounded' | 'tapered' | 'natural'
    clipperGuard: ClipperGuard
    blendingNotes: string
  }
  texture: {
    techniques: TexturizingTechnique[]
    notes: string
  }
  styling: {
    products: string[]
    applicationSteps: string[]
    maintenanceTips: string[]
  }
}

export interface HairstyleRecommendation {
  id: string
  name: string
  description?: string
  geometricReasoning: string
  whyItWorks?: string[]
  barberInstructions: BarberInstructions
  suitabilityScore: number
}

export interface AnalysisResult {
  id: string
  sessionId: string
  geometricAnalysis: GeometricAnalysis
  compatibilityMatrix?: StyleCompatibility[]
  recommendations: [HairstyleRecommendation, HairstyleRecommendation]
  visualizations?: Record<string, string>
  createdAt: Date
}

export interface VisualizationPrompt {
  task: {
    type: 'inpainting' | 'image_to_image'
    strength: number
    focusArea: string
    preserveOriginalFeatures: string[]
  }
  globalContext: {
    sceneDescription: string
    lighting: {
      source: string
      direction: string
    }
  }
  targetModification: {
    hairStyle: string
    keyElements: string[]
  }
  microDetails: string[]
  negativePromptConstraints: string[]
}

export interface VisualizationResult {
  recommendationId: string
  originalPhotoAngle: PhotoAngle
  generatedImageUrl: string
  prompt: VisualizationPrompt
  createdAt: Date
}

export interface AppState {
  currentStep: 'capture' | 'analyzing' | 'result'
  photoSession: PhotoSession | null
  analysisResult: AnalysisResult | null
  visualizations: VisualizationResult[]
  error: string | null
  isLoading: boolean
}

export interface AnalyzeResponse {
  success: boolean
  data?: AnalysisResult
  error?: string
}

export interface VisualizeResponse {
  success: boolean
  data?: VisualizationResult
  error?: string
}

export type CustomerDisplaySection =
  | 'loading'
  | 'scan_complete'
  | 'profile_analysis'
  | 'compatibility_matrix'
  | 'recommendation_1'
  | 'recommendation_2'
  | 'products'

export interface CustomerDisplayState {
  sessionCode: string
  currentSection: CustomerDisplaySection
  analysisResult: AnalysisResult | null
  visualizations: VisualizationResult[]
  isConnected: boolean
}
