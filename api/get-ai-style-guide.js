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

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const {
      career_key = 'hair-braider',
      service_slug = 'knotless-braids',
      style_slug = 'knotless-braids',
    } = req.body || {}

    return res.status(200).json({
      success: true,
      career_key,
      service_slug,
      style_slug,
      guide: {
        best_for: [
          'Protective styling',
          'Low-tension installs',
          'Long-lasting wear',
        ],
        maintenance: [
          'Wrap hair nightly with a satin scarf or bonnet',
          'Apply light scalp oil as needed',
          'Use mousse to refresh frizz and flyaways',
        ],
        recommended_products: [
          'Braiding Hair',
          'Edge Control',
          'Foaming Mousse',
          'Scalp Oil',
        ],
      },
    })
  } catch (error) {
    console.error('GET AI STYLE GUIDE ERROR:', error)

    return res.status(500).json({
      success: false,
      error: 'Failed to load AI style guide.',
    })
  }
}
