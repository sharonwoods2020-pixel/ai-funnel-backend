export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { prompt = '' } = req.body || {}

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing image prompt',
      })
    }

    return res.status(200).json({
      success: true,
      imageUrl: '',
      prompt,
      message: 'Image endpoint connected. Image provider will be added next.',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate hero image',
    })
  }
}
