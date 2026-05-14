export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { currentData, generationInputs } = req.body

    const niche = generationInputs?.niche || 'beauty'
    const problem = generationInputs?.problem || 'skin concerns'
    const audience = generationInputs?.audience || 'busy beauty shoppers'

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You generate clean creator funnel content. Return ONLY valid JSON. Do not include markdown.',
          },
          {
            role: 'user',
            content: `Create a creator product funnel for:
Niche: ${niche}
Problem: ${problem}
Audience: ${audience}

Return JSON with this exact structure:
{
  "creator": {
    "name": "string",
    "handle": "string",
    "tagline": "string"
  },
  "hero": {
    "headline": "string",
    "subheadline": "string",
    "ctaLabel": "string"
  },
  "problems": [
    { "icon": "string", "title": "string", "description": "string" }
  ],
  "routineSteps": [
    { "step": 1, "title": "string", "tip": "string" }
  ],
  "products": [
    { "id": "p1", "image": "/images/product-1.webp", "name": "string", "benefit": "string", "cta": "Shop Now", "href": "#" }
  ],
  "cta": {
    "barTagline": "string",
    "finalHeadline": "string",
    "finalSubtext": "string",
    "finalLabel": "string"
  }
}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI request failed')
    }

    const result = await response.json()
    const text = result.output_text
    const aiData = JSON.parse(text)

    const generatedData = {
      ...currentData,
      ...aiData,
    }

    return res.status(200).json(generatedData)
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate funnel.',
    })
  }
}
