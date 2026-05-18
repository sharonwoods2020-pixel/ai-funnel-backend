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

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1536',
        quality: 'medium',
      }),
    })

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text()

      return res.status(500).json({
        success: false,
        error: 'OpenAI image generation failed',
        details: errorText,
      })
    }

    const imageData = await imageResponse.json()
    const base64Image = imageData?.data?.[0]?.b64_json || ''

    if (!base64Image) {
      return res.status(500).json({
        success: false,
        error: 'No image returned from OpenAI',
      })
    }

    return res.status(200).json({
      success: true,
      imageUrl: `data:image/png;base64,${base64Image}`,
      prompt,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate hero image',
    })
  }
}
