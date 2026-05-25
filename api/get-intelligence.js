import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function normalizeCareerKey(niche = '') {
  const normalized = String(niche)
    .toLowerCase()
    .trim()

  // BRAIDS
  if (
    normalized.includes('knotless') ||
    normalized.includes('braid') ||
    normalized.includes('braider') ||
    normalized.includes('braids')
  ) {
    return 'knotless-braids'
  }

  // BARBER
  if (
    normalized.includes('barber') ||
    normalized.includes('fade')
  ) {
    return 'barber'
  }

  // NAILS
  if (
    normalized.includes('nail')
  ) {
    return 'nails'
  }

  // LASHES
  if (
    normalized.includes('lash') ||
    normalized.includes('brow')
  ) {
    return 'lash-brows'
  }

  // SKINCARE
  if (
    normalized.includes('skin') ||
    normalized.includes('facial')
  ) {
    return 'skincare'
  }

  return normalized
}

function pickImage(...values) {
  return (
    values.find(
      (value) =>
        typeof value === 'string' &&
        value.trim() !== ''
    ) || ''
  )
}

function pickRandom(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return items[Math.floor(Math.random() * items.length)]
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { niche = '' } = req.body || {}
    const careerKey = normalizeCareerKey(niche)

    const [
      careerResult,
      productsResult,
      servicesResult,
      visualsResult,
      hooksResult,
    ] = await Promise.all([
      supabase
        .from('careers')
        .select('*')
        .eq('career_key', careerKey)
        .maybeSingle(),

      supabase
        .from('products')
        .select('*')
        .eq('career_key', careerKey),

      supabase
        .from('services')
        .select('*')
        .eq('career_key', careerKey),

      supabase
        .from('career_visuals')
        .select('*')
        .eq('career_key', careerKey),

      supabase
        .from('hooks')
        .select('*')
        .eq('career_key', careerKey),
    ])

    const products = productsResult.data || []
    const services = servicesResult.data || []
    const visuals = visualsResult.data || []

    const heroVisuals = visuals.filter((item) =>
      String(
        item?.visual_type ||
          item?.category ||
          item?.type ||
          item?.title ||
          ''
      )
        .toLowerCase()
        .includes('hero')
    )

    const imagePool = heroVisuals.length > 0 ? heroVisuals : visuals
    const heroVisual = pickRandom(imagePool)

    const heroImage = pickImage(
      heroVisual?.image_url,
      heroVisual?.image,
      heroVisual?.url,
      products?.[0]?.image_url,
      products?.[0]?.image,
      products?.[0]?.url,
      services?.[0]?.image_url,
      services?.[0]?.image,
      services?.[0]?.url
    )

    return res.status(200).json({
      careerKey,
      career: careerResult.data || null,
      products,
      services,
      visuals,
      selectedVisual: heroVisual,
      hooks: hooksResult.data || [],
      heroImage,
      hero: {
        backgroundImage: heroImage,
        heroImage,
      },
      template: {
        coverImage: heroImage,
      },
      errors: [
        careerResult.error,
        productsResult.error,
        servicesResult.error,
        visualsResult.error,
        hooksResult.error,
      ].filter(Boolean),
    })
  } catch (error) {
    console.error('GET INTELLIGENCE API ERROR:', error)

    return res.status(500).json({
      error: 'Failed to load intelligence.',
    })
  }
}
