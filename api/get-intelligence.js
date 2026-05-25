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
  const normalized = niche.toLowerCase().trim()

  if (
    normalized.includes('braid') ||
    normalized.includes('braider') ||
    normalized.includes('hair braider')
  ) {
    return 'hair-braider'
  }

  return normalized.replace(/\s+/g, '-')
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

    const heroVisual =
      visuals.find((item) =>
        String(
          item?.category ||
          item?.type ||
          item?.title ||
          ''
        )
          .toLowerCase()
          .includes('hero')
      ) || visuals[0]

    const heroImage =
      heroVisual?.image_url ||
      heroVisual?.image ||
      heroVisual?.url ||
      products?.[0]?.image_url ||
      products?.[0]?.image ||
      products?.[0]?.url ||
      services?.[0]?.image_url ||
      services?.[0]?.image ||
      services?.[0]?.url ||
      ''

    return res.status(200).json({
      careerKey,

      career: careerResult.data || null,

      products,

      services,

      visuals,

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
