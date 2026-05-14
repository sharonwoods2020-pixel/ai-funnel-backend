const buildPromptLayer = ({ niche, problem, audience }) => {
  return `Create a high-converting creator product funnel.

INPUTS:
- Niche: ${niche}
- Problem: ${problem}
- Audience: ${audience}

PROMPT LAYER RULES:
- Write for a mobile-first creator funnel.
- Use clear, benefit-driven language.
- Make the audience feel seen quickly.
- Keep headlines punchy.
- Keep descriptions short.
- Make CTAs action-oriented.
- Match the tone to the niche.
- Do not sound generic.
- Do not mention AI.
- Do not include markdown.
- Return only valid JSON.

FUNNEL STRATEGY:
- Hero should create immediate desire.
- Problem cards should name the emotional/friction points.
- Routine steps should feel simple and doable.
- Products should sound like curated recommendations.
- Final CTA should move the viewer toward action.

RETURN ONLY THIS JSON SHAPE:
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
    { "icon": "emoji", "title": "string", "description": "string" },
    { "icon": "emoji", "title": "string", "description": "string" },
    { "icon": "emoji", "title": "string", "description": "string" },
    { "icon": "emoji", "title": "string", "description": "string" }
  ],
  "routineSteps": [
    { "step": 1, "title": "string", "tip": "string" },
    { "step": 2, "title": "string", "tip": "string" },
    { "step": 3, "title": "string", "tip": "string" }
  ],
  "products": [
    { "id": "p1", "image": "/images/product-1.webp", "name": "string", "benefit": "string", "cta": "Shop Now", "href": "#" },
    { "id": "p2", "image": "/images/product-2.webp", "name": "string", "benefit": "string", "cta": "Shop Now", "href": "#" },
    { "id": "p3", "image": "/images/product-3.webp", "name": "string", "benefit": "string", "cta": "Shop Now", "href": "#" }
  ],
  "cta": {
    "barTagline": "string",
    "finalHeadline": "string",
    "finalSubtext": "string",
    "finalLabel": "string"
  }
}`
}

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

const extractOutputText = (aiResult) => {
  if (typeof aiResult?.output_text === 'string') {
    return aiResult.output_text
  }

  const output = aiResult?.output

  if (!Array.isArray(output)) {
    return ''
  }

  for (const item of output) {
    const content = item?.content

    if (!Array.isArray(content)) continue

    for (const block of content) {
      if (typeof block?.text === 'string') {
        return block.text
      }
    }
  }

  return ''
}

const safeParseJson = (text) => {
  if (typeof text !== 'string') return null

  const cleaned = text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (error) {
    return null
  }
}

const normalizeAiFunnel = ({ currentData, aiData, niche, problem, audience }) => {
  const fallback = fallbackFunnel({
    currentData,
    niche,
    problem,
    audience,
  })

  return {
    ...fallback,
    ...aiData,

    creator: {
      ...fallback.creator,
      ...(aiData?.creator || {}),
      image: currentData?.creator?.image || fallback.creator.image,
      videoSrc: currentData?.creator?.videoSrc || fallback.creator.videoSrc,
    },

    hero: {
      ...fallback.hero,
      ...(aiData?.hero || {}),
    },

    problems:
      Array.isArray(aiData?.problems) && aiData.problems.length
        ? aiData.problems
        : fallback.problems,

    routineSteps:
      Array.isArray(aiData?.routineSteps) && aiData.routineSteps.length
        ? aiData.routineSteps
        : fallback.routineSteps,

    products:
      Array.isArray(aiData?.products) && aiData.products.length
        ? aiData.products.map((product, index) => ({
            id: product?.id || `p${index + 1}`,
            image: product?.image || `/images/product-${index + 1}.webp`,
            name: product?.name || `${niche} Product ${index + 1}`,
            benefit: product?.benefit || `Helpful for ${problem}`,
            cta: product?.cta || 'Shop Now',
            href: product?.href || '#',
          }))
        : fallback.products,

    cta: {
      ...fallback.cta,
      ...(aiData?.cta || {}),
    },
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    console.log('Backend endpoint working')

    const { currentData, generationInputs } = req.body

    const niche = generationInputs?.niche || 'beauty'
    const problem = generationInputs?.problem || 'skin concerns'
    const audience = generationInputs?.audience || 'busy beauty shoppers'

    const privatePrompt = buildPromptLayer({
      niche,
      problem,
      audience,
    })

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
              'You are a private AI funnel engine. Return only valid JSON. No markdown. No explanations.',
          },
          {
            role: 'user',
            content: privatePrompt,
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      console.log(
        'OPENAI REQUEST FAILED:',
        await aiResponse.text()
      )

      const fallbackData = fallbackFunnel({
        currentData,
        niche,
        problem,
        audience,
      })

      return res.status(200).json(fallbackData)
    }

    const aiResult = await aiResponse.json()

    console.log(
      'AI RESULT:',
      JSON.stringify(aiResult, null, 2)
    )

    const rawText = extractOutputText(aiResult)

    console.log('AI RAW TEXT:', rawText)

    const aiData = safeParseJson(rawText)

    if (!aiData) {
      console.log('AI JSON PARSE FAILED')

      const fallbackData = fallbackFunnel({
        currentData,
        niche,
        problem,
        audience,
      })

      return res.status(200).json(fallbackData)
    }

    const generatedData = normalizeAiFunnel({
      currentData,
      aiData,
      niche,
      problem,
      audience,
    })

    return res.status(200).json(generatedData)
  } catch (error) {
    console.log('SERVER ERROR:', error)

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
