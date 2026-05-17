import { PRODUCT_INTELLIGENCE } from '../data/productIntelligence.js'
import { TEMPLATE_INTELLIGENCE } from '../data/templateIntelligence.js'
import { buildFunnelPrompt } from '../aiFunnelPrompt.js'

const getNicheCategory = (niche = '') => {
  const nicheLower = niche.toLowerCase()

  if (nicheLower.includes('beard') || nicheLower.includes('barber')) {
    return 'beard'
  }

  if (nicheLower.includes('lash') || nicheLower.includes('lashes')) {
    return 'lashes'
  }

  if (
    nicheLower.includes('fragrance') ||
    nicheLower.includes('perfume') ||
    nicheLower.includes('cologne')
  ) {
    return 'fragrance'
  }

  if (
    nicheLower.includes('skin') ||
    nicheLower.includes('skincare') ||
    nicheLower.includes('face') ||
    nicheLower.includes('beauty')
  ) {
    return 'skincare'
  }

  return 'skincare'
}

const getProblemRoute = ({ nicheCategory, problem = '', niche = '' }) => {
  const problemLower = problem.toLowerCase()
  const nicheLower = niche.toLowerCase()
  const combined = `${nicheLower} ${problemLower}`

  if (nicheCategory === 'skincare') {
    if (
      combined.includes('acne') ||
      combined.includes('breakout') ||
      combined.includes('blemish') ||
      combined.includes('pimple')
    ) {
      return 'acne'
    }

    if (
      combined.includes('dark spot') ||
      combined.includes('dark spots') ||
      combined.includes('hyperpigmentation') ||
      combined.includes('discoloration') ||
      combined.includes('uneven tone')
    ) {
      return 'darkspots'
    }

    if (
      combined.includes('aging') ||
      combined.includes('anti aging') ||
      combined.includes('anti-aging') ||
      combined.includes('wrinkle') ||
      combined.includes('fine line') ||
      combined.includes('firming')
    ) {
      return 'antiaging'
    }

    return 'luxury'
  }

  if (nicheCategory === 'beard') {
    if (
      combined.includes('patchy') ||
      combined.includes('thin beard') ||
      combined.includes('beard growth') ||
      combined.includes('fuller beard')
    ) {
      return 'patchy'
    }

    return 'luxury'
  }

  if (nicheCategory === 'lashes') {
    if (
      combined.includes('growth') ||
      combined.includes('thin lashes') ||
      combined.includes('sparse lashes') ||
      combined.includes('lash fallout') ||
      combined.includes('weak lashes')
    ) {
      return 'growth'
    }

    return 'glam'
  }

  if (nicheCategory === 'fragrance') {
    if (
      combined.includes('everyday') ||
      combined.includes('daily') ||
      combined.includes('clean') ||
      combined.includes('fresh')
    ) {
      return 'everyday'
    }

    return 'luxury'
  }

  return 'luxury'
}

const getIntelligentProducts = ({ nicheCategory, productRoute }) => {
  return (
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.[productRoute] ||
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.luxury ||
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.glam ||
    PRODUCT_INTELLIGENCE?.skincare?.luxury ||
    []
  )
}

const getTemplateIntelligence = ({ nicheCategory, productRoute }) => {
  return (
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.[productRoute] ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.luxury ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.glam ||
    TEMPLATE_INTELLIGENCE?.skincare?.luxury ||
    {
      templateId: 'default-creator-funnel',
      visualTone: 'clean, modern, creator-focused',
      layoutStyle: 'mobile-first creator funnel',
      colorMood: 'white, black, soft accent',
    }
  )
}

const fallbackFunnel = ({ currentData, niche, problem, audience }) => {
  const nicheCategory = getNicheCategory(niche)

  const productRoute = getProblemRoute({
    nicheCategory,
    problem,
    niche,
  })

  const templateData = getTemplateIntelligence({
    nicheCategory,
    productRoute,
  })

  const fallbackProducts = getIntelligentProducts({
    nicheCategory,
    productRoute,
  })

  return {
    ...currentData,

    template: templateData,

    creator: {
      name: currentData?.creator?.name || 'Maya Brooks',
      handle: currentData?.creator?.handle || '@mayaglowup',
      tagline: currentData?.creator?.tagline || `Helping ${audience}`,
      image: currentData?.creator?.image || '/images/creator-profile.webp',
      videoSrc: currentData?.creator?.videoSrc || '',
    },

    hero: {
      headline: `Fix ${problem} With This Simple ${niche} Routine`,
      subheadline: `Helpful ${niche} picks made for ${audience}.`,
      ctaLabel: 'Shop The Routine ✦',
      creatorMicroScript: `Here is the simple ${niche} routine I recommend for ${problem}.`,
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

    products: fallbackProducts.map((product, index) => ({
      id: `p${index + 1}`,
      image: product.image,
      name: product.name,
      benefit: product.benefit,
      cta: 'Shop Now',
      href: '#',
      learnMore: {
        title: `Learn more about ${product.name}`,
        quickBenefit: product.benefit,
        whyItWorks: 'Designed to support a simple, focused beauty routine.',
        bestFor: audience,
        howToUse: 'Use as directed in your daily routine.',
        creatorInsight: 'I like this because it keeps the routine simple and easy to follow.',
      },
    })),

    cta: {
      barTagline: `A simple ${niche} routine for ${audience}.`,
      finalHeadline: `Ready to simplify your ${niche} routine?`,
      finalSubtext: `Start with a focused routine made for ${problem}.`,
      finalLabel: 'View Recommended Products',
    },

    reusableAssets: {
      hooks: [],
      ctaVariants: [],
      socialCaptions: [],
      creatorScripts: [],
      emotionalAngles: [],
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
  creatorMicroScript: ensureString(
    hero?.creatorMicroScript,
    fallback?.creatorMicroScript || ''
  ),
})

const enforceProblems = (problems, fallback) => {
  return ensureArray(problems, fallback).slice(0, 4).map((item, index) => {
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
  return ensureArray(steps, fallback).slice(0, 4).map((item, index) => {
    if (typeof item === 'string') {
      return {
        step: index + 1,
        title: fallback[index]?.title || `Step ${index + 1}`,
        tip: item,
      }
    }

    return {
      step: item?.step || index + 1,
      title: ensureString(
        item?.title || item?.stepTitle,
        fallback[index]?.title || `Step ${index + 1}`
      ),
      tip: ensureString(
        item?.tip || item?.description,
        fallback[index]?.tip || ''
      ),
    }
  })
}

const enforceProducts = ({ aiProducts, controlledProducts, fallback }) => {
  const productsToUse = controlledProducts.map((product, index) => {
    const aiProduct = aiProducts?.[index] || {}

    return {
      id: `p${index + 1}`,

      image: ensureString(
        product?.image || aiProduct?.image,
        `/images/product-${index + 1}.webp`
      ),

      name: ensureString(
        product?.name || aiProduct?.name,
        fallback[index]?.name || `Product ${index + 1}`
      ),

      benefit: ensureString(
        product?.benefit ||
          aiProduct?.benefit ||
          aiProduct?.shortDescription ||
          aiProduct?.description,
        fallback[index]?.benefit || ''
      ),

      cta: ensureString(
        aiProduct?.cta || aiProduct?.ctaLabel || product?.cta,
        'Shop Now'
      ),

      href: ensureString(product?.href || aiProduct?.href, '#'),

      learnMore: {
        title: ensureString(aiProduct?.learnMore?.title, ''),
        quickBenefit: ensureString(aiProduct?.learnMore?.quickBenefit, ''),
        whyItWorks: ensureString(aiProduct?.learnMore?.whyItWorks, ''),
        bestFor: ensureString(aiProduct?.learnMore?.bestFor, ''),
        howToUse: ensureString(aiProduct?.learnMore?.howToUse, ''),
        creatorInsight: ensureString(aiProduct?.learnMore?.creatorInsight, ''),
      },
    }
  })

  return ensureArray(productsToUse, fallback).slice(0, 3)
}

const enforceCTA = (cta, fallback) => ({
  barTagline: ensureString(cta?.barTagline, fallback.barTagline),
  finalHeadline: ensureString(cta?.finalHeadline, fallback.finalHeadline),
  finalSubtext: ensureString(cta?.finalSubtext, fallback.finalSubtext),
  finalLabel: ensureString(cta?.finalLabel, fallback.finalLabel),
})

const enforceReusableAssets = (assets = {}) => ({
  hooks: Array.isArray(assets?.hooks) ? assets.hooks : [],
  ctaVariants: Array.isArray(assets?.ctaVariants) ? assets.ctaVariants : [],
  socialCaptions: Array.isArray(assets?.socialCaptions)
    ? assets.socialCaptions
    : [],
  creatorScripts: Array.isArray(assets?.creatorScripts)
    ? assets.creatorScripts
    : [],
  emotionalAngles: Array.isArray(assets?.emotionalAngles)
    ? assets.emotionalAngles
    : [],
})

const normalizeAiFunnel = ({
  currentData,
  aiData,
  niche,
  problem,
  audience,
  intelligentProducts,
  templateData,
}) => {
  const fallback = fallbackFunnel({
    currentData,
    niche,
    problem,
    audience,
  })

  const controlledProducts = intelligentProducts.map((product, index) => ({
    id: `p${index + 1}`,
    image: product.image,
    name: product.name,
    benefit: product.benefit,
    cta: 'Shop Now',
    href: '#',
  }))

  return {
    template: templateData,

    creator: enforceCreator(aiData?.creator, fallback.creator),

    hero: enforceHero(aiData?.hero, fallback.hero),

    problems: enforceProblems(
      aiData?.problemCards || aiData?.problems,
      fallback.problems
    ),

    routineSteps: enforceRoutineSteps(
      aiData?.routine?.steps || aiData?.routineSteps,
      fallback.routineSteps
    ),

    products: enforceProducts({
      aiProducts: aiData?.products || [],
      controlledProducts,
      fallback: fallback.products,
    }),

    cta: enforceCTA(
      aiData?.finalCta
        ? {
            barTagline: fallback.cta.barTagline,
            finalHeadline: aiData.finalCta.headline,
            finalSubtext: aiData.finalCta.subtext,
            finalLabel: aiData.finalCta.ctaLabel,
          }
        : aiData?.cta,
      fallback.cta
    ),

    reusableAssets: enforceReusableAssets(aiData?.reusableAssets),
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

    const nicheCategory = getNicheCategory(niche)

    const productRoute = getProblemRoute({
      nicheCategory,
      problem,
      niche,
    })

    const intelligentProducts = getIntelligentProducts({
      nicheCategory,
      productRoute,
    })

    const templateData = getTemplateIntelligence({
      nicheCategory,
      productRoute,
    })

    console.log('PRODUCT INTELLIGENCE CATEGORY:', nicheCategory)
    console.log('PRODUCT INTELLIGENCE ROUTE:', productRoute)
    console.log('CONTROLLED PRODUCTS:', intelligentProducts)
    console.log('TEMPLATE INTELLIGENCE:', templateData)

    const privatePrompt = buildFunnelPrompt({
      creatorName: currentData?.creator?.name || 'Creator',
      creatorType: niche,
      niche,
      productName: intelligentProducts?.[0]?.name || 'Featured Product',
      productDescription: intelligentProducts?.[0]?.benefit || problem,
      targetAudience: audience,
      offerType: niche,
      tone: templateData?.visualTone || 'premium',
      callToAction: 'Shop The Routine ✦',
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
      intelligentProducts,
      templateData,
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
