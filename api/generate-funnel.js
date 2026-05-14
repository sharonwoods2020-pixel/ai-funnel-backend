const fallbackFunnel = ({ currentData, niche, problem, audience }) => {
  const creator = currentData?.creator || {}
  const hero = currentData?.hero || {}
  const cta = currentData?.cta || {}

  return {
    ...currentData,

    creator: {
      ...creator,
      name: 'Maya Brooks',
      handle: '@mayaglowup',
      tagline: `Helping ${audience}`,
    },

    hero: {
      ...hero,
      headline: `Fix ${problem} With This Simple ${niche} Routine`,
      subheadline: `Helpful ${niche} picks made for ${audience}.`,
      ctaLabel: 'Shop The Routine ✦',
    },

    problems: [
      {
        icon: '😩',
        title: problem,
        description: `A common issue for ${audience}.`,
      },
      {
        icon: '⏰',
        title: 'No Time',
        description: 'Simple routines are easier to stick with.',
      },
      {
        icon: '🛍️',
        title: 'Too Many Choices',
        description: 'It can be hard to know what to try first.',
      },
      {
        icon: '✨',
        title: 'Need A Simple Plan',
        description: 'A focused routine helps reduce guesswork.',
      },
    ],

    routineSteps: [
      {
        step: 1,
        title: 'Start Simple',
        tip: `Pick one ${niche} routine you can repeat.`,
      },
      {
        step: 2,
        title: 'Use Consistently',
        tip: 'Give the routine time to work into your schedule.',
      },
      {
        step: 3,
        title: 'Track What Helps',
        tip: 'Notice what feels helpful and easy to keep using.',
      },
    ],

    products: [
      {
        id: 'p1',
        image: '/images/product-1.webp',
        name: `${niche} Starter Pick`,
        benefit: `Helpful for ${problem}`,
        cta: 'Shop Now',
        href: '#',
      },
      {
        id: 'p2',
        image: '/images/product-2.webp',
        name: `${niche} Daily Essential`,
        benefit: `Easy for ${audience}`,
        cta: 'Shop Now',
        href: '#',
      },
      {
        id: 'p3',
        image: '/images/product-3.webp',
        name: `${niche} Routine Booster`,
        benefit: 'Adds support to the routine',
        cta: 'Shop Now',
        href: '#',
      },
    ],

    cta: {
      ...cta,
      barTagline: `A simple ${niche} routine for ${audience}.`,
      finalHeadline: `Ready to simplify your ${niche} routine?`,
      finalSubtext: `Start with a focused routine made for ${problem}.`,
      finalLabel: 'View Recommended Products',
    },
  }
}

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

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
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
              'You are an AI funnel copywriter. Return only valid JSON. Do not include markdown, comments, or explanation.',
          },
          {
            role: 'user',
            content: `Create a creator product funnel.

Niche: ${niche}
Problem: ${problem}
Audience: ${audience}

Return ONLY this JSON structure:
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
    {
      "icon": "emoji",
      "title": "string",
      "description": "string"
    },
    {
      "icon": "emoji",
      "title": "string",
      "description": "string"
    },
    {
      "icon": "emoji",
      "title": "string",
      "description": "string"
    },
    {
      "icon": "emoji",
      "title": "string",
      "description": "string"
    }
  ],
  "routineSteps": [
    {
      "step": 1,
      "title": "string",
      "tip": "string"
    },
    {
      "step": 2,
      "title": "string",
      "tip": "string"
    },
    {
      "step": 3,
      "title": "string",
      "tip": "string"
    }
  ],
  "products": [
    {
      "id": "p1",
      "image": "/images/product-1.webp",
      "name": "string",
      "benefit": "string",
      "cta": "Shop Now",
      "href": "#"
    },
    {
      "id": "p2",
      "image": "/images/product-2.webp",
      "name": "string",
      "benefit": "string",
      "cta": "Shop Now",
      "href": "#"
    },
    {
      "id": "p3",
      "image": "/images/product-3.webp",
      "name": "string",
      "benefit": "string",
      "cta": "Shop Now",
      "href": "#"
    }
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

    if (!aiResponse.ok) {
      const fallbackData = fallbackFunnel({
        currentData,
        niche,
        problem,
        audience,
      })

      return res.status(200).json(fallbackData)
    }

    const aiResult = await aiResponse.json()
    const rawText = aiResult.output_text || ''
    const aiData = JSON.parse(rawText)

    const generatedData = {
      ...currentData,
      ...aiData,
    }

    return res.status(200).json(generatedData)
  } catch (error) {
    const { currentData, generationInputs } = req.body || {}

    const fallbackData = fallbackFunnel({
      currentData,
      niche: generationInputs?.niche || 'beauty',
      problem: generationInputs?.problem || 'skin concerns',
      audience: generationInputs?.audience || 'busy beauty shoppers',
    })

    return res.status(200).json(fallbackData)
  }
}
