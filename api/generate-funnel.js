const buildPromptLayer = ({ niche, problem, audience }) => {
  return `You are generating a mobile-first creator funnel for a real product-based business.

INPUTS:
- Niche: ${niche}
- Problem: ${problem}
- Audience: ${audience}

IMPORTANT:
Do NOT use placeholder words like "niche", "problem", "audience", "456", "789", "string", or "Product".
Use the actual input meaning to create realistic creator branding, product names, hooks, and benefits.

STYLE:
- Write like a premium creator brand.
- Make the copy specific, emotional, and conversion-focused.
- Use short mobile-friendly copy.
- Make the audience feel understood.
- Avoid hype claims, medical claims, income claims, or guaranteed results.
- Do not mention AI.
- Do not use markdown.
- Return ONLY valid JSON.

CREATOR RULES:
Create a realistic creator name, handle, and tagline that fits the niche.
The handle should feel brandable and modern.

HERO RULES:
The headline should NOT simply repeat the inputs.
It should reposition the problem as a desirable transformation.

PROBLEM CARD RULES:
Each problem must be an object with icon, title, and description.
Do NOT return plain strings.

ROUTINE RULES:
Each routine step must be an object with step, title, and tip.
Do NOT return plain strings.

PRODUCT RULES:
Create believable product-style recommendations that match the niche and problem.
Each product must include id, image, name, benefit, cta, and href.

RETURN ONLY THIS EXACT JSON STRUCTURE:
{
  "creator": {
    "name": "realistic creator name",
    "handle": "@realisticbrandhandle",
    "tagline": "short brand tagline"
  },
  "hero": {
    "headline": "short transformation-driven headline",
    "subheadline": "short benefit-driven subheadline",
    "ctaLabel": "short action CTA"
  },
  "problems": [
    {
      "icon": "emoji",
      "title": "short problem title",
      "description": "short emotional description"
    },
    {
      "icon": "emoji",
      "title": "short problem title",
      "description": "short emotional description"
    },
    {
      "icon": "emoji",
      "title": "short problem title",
      "description": "short emotional description"
    },
    {
      "icon": "emoji",
      "title": "short problem title",
      "description": "short emotional description"
    }
  ],
  "routineSteps": [
    {
      "step": 1,
      "title": "short step title",
      "tip": "short practical tip"
    },
    {
      "step": 2,
      "title": "short step title",
      "tip": "short practical tip"
    },
    {
      "step": 3,
      "title": "short step title",
      "tip": "short practical tip"
    }
  ],
  "products": [
    {
      "id": "p1",
      "image": "/images/product-1.webp",
      "name": "realistic product name",
      "benefit": "short product benefit",
      "cta": "Shop Now",
      "href": "#"
    },
    {
      "id": "p2",
      "image": "/images/product-2.webp",
      "name": "realistic product name",
      "benefit": "short product benefit",
      "cta": "Shop Now",
      "href": "#"
    },
    {
      "id": "p3",
      "image": "/images/product-3.webp",
      "name": "realistic product name",
      "benefit": "short product benefit",
      "cta": "Shop Now",
      "href": "#"
    }
  ],
  "cta": {
    "barTagline": "short trust-building line",
    "finalHeadline": "short final CTA headline",
    "finalSubtext": "short final support text",
    "finalLabel": "short final CTA label"
  }
}`
}

const fallbackFunnel = ({ currentData, niche, problem, audience }) => {
  return {
    ...currentData,

    creator: {
      name: 'Maya Brooks',
      handle: '@mayaglowup',
      tagline: `Helping ${audience}`,
      image: currentData?.creator?.image || '/images/creator-profile.webp',
      videoSrc: currentData?.creator?.videoSrc || '',
    },

    hero: {
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
      barTagline: `A simple ${niche} routine for ${audience}.`,
      finalHeadline: `Ready to simplify your ${niche} routine?`,
      finalSubtext: `Start with a focused routine made for ${problem}.`,
      finalLabel: 'View Recommended Products',
    },
  }
}

const extractOutputText = (aiResult) => {
  try {
    return (
      aiResult?.output?.[0]?.content?.[0]?.text ||
      aiResult?.output_text ||
      ''
    )
  } catch {
    return ''
  }
}

const cleanJsonText = (text) => {
  return text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()
}

const safeParseJson = (text) => {
  try {
    return JSON.parse(cleanJsonText(text))
  } catch {
    return null
  }
}

const ensureArray = (value, fallback) => {
  return Array.isArray(value) && value.length ? value : fallback
}

const ensureString = (value, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value : fallback
}

const enforceCreator = (creator, fallback) => ({
  name: ensureString(creator?.name, fallback.name),
  handle: ensureString(creator?.handle, fallback.handle),
  tagline: ensureString(creator?.tagline, fallback.tagline),
  image: fallback.image,
  videoSrc: fallback.videoSrc,
})

const enforceHero = (hero, fallback) => ({
  headline: ensureString(hero?.headline, fallback.headline),
  subheadline: ensureString(hero?.subheadline, fallback.subheadline),
  ctaLabel: ensureString(hero?.ctaLabel, fallback.ctaLabel),
})

const enforceProblems = (problems, fallback) => {
  return ensureArray(problems, fallback).map((item, index) => {
    if (typeof item === 'string') {
      return {
        icon: fallback[index]?.icon || '✨',
        title: item,
        description: fallback[index]?.description || '',
      }
    }

    return {
      icon: ensureString(item?.icon, fallback[index]?.icon || '✨'),
      title: ensureString(item?.title, fallback[index]?.title || 'Problem'),
      description: ensureString(
        item?.description,
        fallback[index]?.description || ''
      ),
    }
  })
}

const enforceRoutineSteps = (steps, fallback) => {
  return ensureArray(steps, fallback).slice(0, 3).map((item, index) => {
    if (typeof item === 'string') {
      return {
        step: index + 1,
        title: fallback[index]?.title || `Step ${index + 1}`,
        tip: item,
      }
    }

    return {
      step: index + 1,
      title: ensureString(item?.title, fallback[index]?.title || 'Step'),
      tip: ensureString(item?.tip, fallback[index]?.tip || ''),
    }
  })
}

const enforceProducts = (products, fallback) => {
  return ensureArray(products, fallback).slice(0, 3).map((item, index) => ({
    id: ensureString(item?.id, `p${index + 1}`),
    image: ensureString(item?.image, `/images/product-${index + 1}.webp`),
    name: ensureString(item?.name, fallback[index]?.name || `Product ${index + 1}`),
    benefit: ensureString(
      item?.benefit || item?.description,
      fallback[index]?.benefit || ''
    ),
    cta: ensureString(item?.cta || item?.ctaLabel, 'Shop Now'),
    href: ensureString(item?.href, '#'),
  }))
}

const enforceCTA = (cta, fallback) => ({
  barTagline: ensureString(cta?.barTagline, fallback.barTagline),
  finalHeadline: ensureString(cta?.finalHeadline, fallback.finalHeadline),
  finalSubtext: ensureString(cta?.finalSubtext, fallback.finalSubtext),
  finalLabel: ensureString(cta?.finalLabel, fallback.finalLabel),
})

const normalizeAiFunnel = ({ currentData, aiData, niche, problem, audience }) => {
  const fallback = fallbackFunnel({
    currentData,
    niche,
    problem,
    audience,
  })

  return {
    creator: enforceCreator(aiData?.creator, fallback.creator),
    hero: enforceHero(aiData?.hero, fallback.hero),
    problems: enforceProblems(aiData?.problems, fallback.problems),
    routineSteps: enforceRoutineSteps(aiData?.routineSteps, fallback.routineSteps),
    products: enforceProducts(aiData?.products, fallback.products),
    cta: enforceCTA(aiData?.cta, fallback.cta),
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
        temperature: 0.7,
        input: [
          {
            role: 'system',
            content:
              'You are a private AI funnel engine. Return only valid JSON. Never return markdown or explanations.',
          },
          {
            role: 'user',
            content: privatePrompt,
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      console.log('OPENAI REQUEST FAILED:', await aiResponse.text())

      return res.status(200).json(
        fallbackFunnel({
          currentData,
          niche,
          problem,
          audience,
        })
      )
    }

    const aiResult = await aiResponse.json()

    console.log('AI RESULT:', JSON.stringify(aiResult, null, 2))

    const rawText = extractOutputText(aiResult)

    console.log('AI RAW TEXT:', rawText)

    const parsedJson = safeParseJson(rawText)

    if (!parsedJson) {
      console.log('AI JSON PARSE FAILED')

      return res.status(200).json(
        fallbackFunnel({
          currentData,
          niche,
          problem,
          audience,
        })
      )
    }

    const generatedData = normalizeAiFunnel({
      currentData,
      aiData: parsedJson,
      niche,
      problem,
      audience,
    })

    console.log('FINAL ENFORCED JSON READY')

    return res.status(200).json(generatedData)
  } catch (error) {
    console.log('SERVER ERROR:', error)

    const { currentData, generationInputs } = req.body || {}

    return res.status(200).json(
      fallbackFunnel({
        currentData,
        niche: generationInputs?.niche || 'beauty',
        problem: generationInputs?.problem || 'skin concerns',
        audience: generationInputs?.audience || 'busy beauty shoppers',
      })
    )
  }
}
