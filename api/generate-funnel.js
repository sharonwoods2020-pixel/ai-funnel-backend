import { createClient } from '@supabase/supabase-js'
import { CAREER_INTELLIGENCE } from '../data/careerIntelligence.js'
import { TEMPLATE_INTELLIGENCE } from '../data/templateIntelligence.js'
import { buildFunnelPrompt } from '../aiFunnelPrompt.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?auto=format&fit=crop&w=1400&q=80'

const getNicheCategory = (niche = '') => {
  const n = niche.toLowerCase().trim()

  if (n.includes('braid') || n.includes('knotless') || n.includes('loc')) return 'braids'
  if (n.includes('hair') || n.includes('wig') || n.includes('extension')) return 'hair'
  if (n.includes('barber') || n.includes('beard') || n.includes('fade')) return 'barber'
  if (n.includes('nail') || n.includes('acrylic') || n.includes('gel')) return 'nails'
  if (n.includes('lash') || n.includes('brow')) return 'lashes'
  if (n.includes('fragrance') || n.includes('perfume') || n.includes('cologne')) return 'fragrance'
  if (n.includes('skin') || n.includes('skincare') || n.includes('facial')) return 'skincare'
  if (n.includes('gift') || n.includes('basket') || n.includes('bundle')) return 'giftbaskets'

  return 'beauty'
}

const normalizeCareerKey = (niche = '') => {
  const normalized = niche.toLowerCase().trim()

  if (
    normalized.includes('braid') ||
    normalized.includes('braider') ||
    normalized.includes('hair braider') ||
    normalized.includes('loc')
  ) {
    return 'hair-braider'
  }

  return normalized.replace(/\s+/g, '-')
}

const getNicheRules = (nicheCategory) => {
  return (
    CAREER_INTELLIGENCE?.[nicheCategory] ||
    CAREER_INTELLIGENCE?.beauty || {
      allowedVocabulary: '',
      blockedVocabulary: '',
      creatorVoice: 'beauty creator',
      emotionalAngles: '',
      ctaStyle: 'Shop The Routine ✦',
      offerTypes: '',
      visualTone: 'clean beauty',
    }
  )
}

const cleanImageUrl = (value = '') => {
  if (typeof value !== 'string') return ''

  const cleaned = value
    .replace(/^url\(/, '')
    .replace(/\)$/, '')
    .replaceAll('"', '')
    .replaceAll("'", '')
    .trim()

  if (!cleaned) return ''
  if (cleaned.startsWith('http')) return cleaned
  if (cleaned.startsWith('data:image')) return cleaned
  if (cleaned.startsWith('/')) return cleaned

  return ''
}

const pickImage = (...values) => {
  return values.map(cleanImageUrl).find(Boolean) || ''
}

const loadSupabaseIntelligence = async (careerKey) => {
  try {
    const [productsResult, servicesResult, visualsResult] = await Promise.all([
      supabase.from('products').select('*').eq('career_key', careerKey),
      supabase.from('services').select('*').eq('career_key', careerKey),
      supabase.from('visuals').select('*').eq('career_key', careerKey),
    ])

    return {
      products: productsResult.data || [],
      services: servicesResult.data || [],
      visuals: visualsResult.data || [],
    }
  } catch {
    return {
      products: [],
      services: [],
      visuals: [],
    }
  }
}

const getVisualImage = (visuals = []) => {
  const heroVisual =
    visuals.find((item) =>
      String(item?.category || item?.type || item?.title || '')
        .toLowerCase()
        .includes('hero')
    ) || visuals[0]

  return pickImage(
    heroVisual?.image_url,
    heroVisual?.image,
    heroVisual?.url,
    heroVisual?.source_url
  )
}

const mapSourceProducts = ({ aiProducts = [], sourceProducts = [], niche, audience, rules }) => {
  const merged = aiProducts.length ? aiProducts : sourceProducts

  if (!merged.length) {
    return [
      {
        id: 'p1',
        image: FALLBACK_HERO,
        name: `${niche} Starter Offer`,
        benefit: `A focused ${niche} option for ${audience}.`,
        cta: rules.ctaStyle,
        href: '#',
      },
    ]
  }

  return merged.slice(0, 3).map((product, index) => {
    const sourceProduct = sourceProducts[index] || product

    return {
      id: product?.id || sourceProduct?.id || `p${index + 1}`,
      image:
        pickImage(
          sourceProduct?.image_url,
          sourceProduct?.image,
          sourceProduct?.imageUrl,
          sourceProduct?.thumbnail_url,
          product?.image
        ) || FALLBACK_HERO,
      name:
        product?.name ||
        sourceProduct?.name ||
        sourceProduct?.title ||
        `${niche} Offer ${index + 1}`,
      benefit:
        product?.benefit ||
        product?.shortDescription ||
        sourceProduct?.benefit ||
        sourceProduct?.description ||
        `A focused ${niche} option.`,
      cta: product?.cta || product?.ctaLabel || rules.ctaStyle,
      href:
        sourceProduct?.product_url ||
        sourceProduct?.url ||
        sourceProduct?.href ||
        product?.href ||
        '#',
      learnMore: product?.learnMore || {
        title: `Learn more about ${product?.name || sourceProduct?.name || `${niche} Offer`}`,
        quickBenefit: product?.benefit || sourceProduct?.benefit || '',
        whyItWorks: `Selected from the connected ${niche} intelligence source.`,
        bestFor: audience,
        howToUse: `Use as part of your ${niche} routine.`,
        creatorInsight: `This supports the selected ${niche} goal.`,
      },
    }
  })
}

const fallbackFunnel = ({ currentData = {}, niche, problem, audience, sourceProducts = [], visuals = [] }) => {
  const nicheCategory = getNicheCategory(niche)
  const rules = getNicheRules(nicheCategory)

  const heroImage =
    pickImage(
      getVisualImage(visuals),
      sourceProducts?.[0]?.image_url,
      sourceProducts?.[0]?.image,
      sourceProducts?.[0]?.thumbnail_url,
      currentData?.hero?.backgroundImage,
      currentData?.template?.coverImage,
      currentData?.products?.[0]?.image
    ) || FALLBACK_HERO

  return {
    ...currentData,
    template: {
      ...(currentData?.template || {}),
      templateId: `${nicheCategory}-creator-funnel`,
      visualTone: `${nicheCategory} focused creator funnel`,
      layoutStyle: 'mobile-first creator funnel',
      colorMood: 'black, white, neutral',
      coverImage: heroImage,
    },
    creator: {
      name: currentData?.creator?.name || 'Creator',
      handle: currentData?.creator?.handle || '@creator',
      tagline: currentData?.creator?.tagline || `Helping ${audience}`,
      image: currentData?.creator?.image || '/images/creator-profile.webp',
      videoSrc: currentData?.creator?.videoSrc || '',
    },
    hero: {
      ...(currentData?.hero || {}),
      headline: `Premium ${niche} Experience`,
      subheadline: `A focused ${niche} solution for ${audience}.`,
      ctaLabel: rules.ctaStyle,
      creatorMicroScript: `Here is my recommended ${niche} approach for ${problem}.`,
      backgroundImage: heroImage,
      heroImage,
    },
    problems: [
      {
        icon: '✨',
        title: problem,
        description: `A common ${niche} concern for ${audience}.`,
      },
    ],
    routineSteps: [
      {
        step: 1,
        title: 'Choose Your Look',
        tip: `Start with the right ${niche} goal.`,
      },
      {
        step: 2,
        title: 'Follow The Plan',
        tip: `Use a focused ${niche} routine that fits your needs.`,
      },
      {
        step: 3,
        title: 'Keep It Fresh',
        tip: `Maintain the ${niche} result with simple follow-up care.`,
      },
    ],
    products: mapSourceProducts({
      aiProducts: [],
      sourceProducts,
      niche,
      audience,
      rules,
    }),
    cta: {
      barTagline: `Simple ${niche} routine`,
      finalHeadline: `Ready for your ${niche} transformation?`,
      finalSubtext: `Start with a focused plan for ${problem}.`,
      finalLabel: rules.ctaStyle,
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

const cleanJsonText = (text = '') =>
  text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim()

const safeParseJson = (text = '') => {
  try {
    return JSON.parse(cleanJsonText(text))
  } catch {
    return null
  }
}

const containsBlockedWords = (data, blocked = '') => {
  if (!blocked) return false

  const blockedList = blocked
    .split(',')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean)

  const allText = JSON.stringify(data).toLowerCase()

  return blockedList.some((word) => allText.includes(word))
}

const normalizeAiFunnel = ({
  aiData,
  currentData,
  niche,
  problem,
  audience,
  rules,
  templateData,
  sourceProducts,
  sourceServices,
  visuals,
}) => {
  const fallback = fallbackFunnel({
    currentData,
    niche,
    problem,
    audience,
    sourceProducts,
    visuals,
  })

  const heroImage =
    pickImage(
      getVisualImage(visuals),
      sourceProducts?.[0]?.image_url,
      sourceProducts?.[0]?.image,
      sourceProducts?.[0]?.thumbnail_url,
      currentData?.hero?.backgroundImage,
      currentData?.template?.coverImage,
      currentData?.products?.[0]?.image,
      fallback?.hero?.backgroundImage
    ) || FALLBACK_HERO

  return {
    ...fallback,

    template: {
      ...fallback.template,
      ...templateData,
      ...(aiData?.template || {}),
      coverImage: heroImage,
    },

    creator: {
      ...fallback.creator,
      ...(aiData?.creator || {}),
      image: currentData?.creator?.image || fallback.creator.image,
      videoSrc: currentData?.creator?.videoSrc || fallback.creator.videoSrc,
    },

    hero: {
      ...fallback.hero,
      ...(aiData?.hero || {}),
      ctaLabel: aiData?.hero?.ctaLabel || rules.ctaStyle,
      backgroundImage: heroImage,
      heroImage,
    },

    problems: Array.isArray(aiData?.problemCards)
      ? aiData.problemCards
      : Array.isArray(aiData?.problems)
        ? aiData.problems
        : fallback.problems,

    routineSteps: Array.isArray(aiData?.routine?.steps)
      ? aiData.routine.steps.map((step, index) => ({
          step: index + 1,
          title: step?.title || step?.stepTitle || `Step ${index + 1}`,
          tip: step?.tip || step?.description || '',
        }))
      : Array.isArray(aiData?.routineSteps)
        ? aiData.routineSteps
        : fallback.routineSteps,

    products: mapSourceProducts({
      aiProducts: Array.isArray(aiData?.products) ? aiData.products : [],
      sourceProducts: sourceProducts?.length ? sourceProducts : sourceServices,
      niche,
      audience,
      rules,
    }),

    cta: aiData?.finalCta
      ? {
          barTagline: fallback.cta.barTagline,
          finalHeadline: aiData.finalCta.headline || fallback.cta.finalHeadline,
          finalSubtext: aiData.finalCta.subtext || fallback.cta.finalSubtext,
          finalLabel: aiData.finalCta.ctaLabel || rules.ctaStyle,
        }
      : fallback.cta,

    reusableAssets: {
      hooks: Array.isArray(aiData?.reusableAssets?.hooks) ? aiData.reusableAssets.hooks : [],
      ctaVariants: Array.isArray(aiData?.reusableAssets?.ctaVariants) ? aiData.reusableAssets.ctaVariants : [],
      socialCaptions: Array.isArray(aiData?.reusableAssets?.socialCaptions) ? aiData.reusableAssets.socialCaptions : [],
      creatorScripts: Array.isArray(aiData?.reusableAssets?.creatorScripts) ? aiData.reusableAssets.creatorScripts : [],
      emotionalAngles: Array.isArray(aiData?.reusableAssets?.emotionalAngles) ? aiData.reusableAssets.emotionalAngles : [],
    },
  }
}

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
    const { currentData = {}, generationInputs = {} } = req.body || {}

    const niche = generationInputs?.niche || 'Beauty'
    const problem = generationInputs?.problem || 'beauty challenge'
    const audience = generationInputs?.audience || 'beauty shoppers'

    const nicheCategory = getNicheCategory(niche)
    const careerKey = normalizeCareerKey(niche)
    const rules = getNicheRules(nicheCategory)

    const sourceData = await loadSupabaseIntelligence(careerKey)

    const templateData =
      TEMPLATE_INTELLIGENCE?.[nicheCategory]?.luxury ||
      TEMPLATE_INTELLIGENCE?.[nicheCategory]?.glam ||
      {
        templateId: `${nicheCategory}-creator-funnel`,
        visualTone: rules.visualTone || `${nicheCategory} focused creator funnel`,
        layoutStyle: 'mobile-first creator funnel',
        colorMood: 'black, white, neutral',
      }

    const privatePrompt = buildFunnelPrompt({
      creatorName: currentData?.creator?.name || 'Creator',
      creatorType: rules.creatorVoice,
      niche,
      productName: problem || `${niche} Offer`,
      productDescription: problem,
      targetAudience: audience,
      offerType: niche,
      tone: templateData?.visualTone || rules.visualTone,
      callToAction: rules.ctaStyle,
      allowedVocabulary: rules.allowedVocabulary,
      blockedVocabulary: rules.blockedVocabulary,
      emotionalAngle: rules.emotionalAngles,
    })

    const enforcedPrompt = `
${privatePrompt}

STRICT NICHE CONTROL:
The selected niche is "${niche}".
You must ONLY generate content related to: ${rules.allowedVocabulary}.
You must NOT use or imply these words/topics: ${rules.blockedVocabulary}.

CONNECTED SOURCE RULE:
Use the connected source data conceptually.
Do NOT invent random image URLs.
Images are assigned by the system from Supabase / BD / GetPaidMarketplace stored URLs.

AVAILABLE SOURCE PRODUCTS:
${JSON.stringify(sourceData.products.slice(0, 5))}

AVAILABLE SOURCE SERVICES:
${JSON.stringify(sourceData.services.slice(0, 5))}

PRODUCT/SERVICE CARD RULE:
Generate product/service cards dynamically for the selected niche.
Do NOT use generic skincare products unless the selected niche is skincare.
For Braids, cards must be braid services, braid prep, braid maintenance, protective style care, scalp comfort, edge care, or braid longevity.

Return ONLY valid JSON.
`

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.5,
        input: [
          {
            role: 'system',
            content: 'You are a private AI funnel engine. Return only valid JSON. Never return markdown or explanations.',
          },
          {
            role: 'user',
            content: enforcedPrompt,
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      return res.status(200).json(
        fallbackFunnel({
          currentData,
          niche,
          problem,
          audience,
          sourceProducts: sourceData.products,
          visuals: sourceData.visuals,
        }),
      )
    }

    const aiResult = await aiResponse.json()
    const rawText =
      aiResult?.output?.[0]?.content?.[0]?.text ||
      aiResult?.output_text ||
      ''

    const parsedJson = safeParseJson(rawText)

    if (!parsedJson || containsBlockedWords(parsedJson, rules.blockedVocabulary)) {
      return res.status(200).json(
        fallbackFunnel({
          currentData,
          niche,
          problem,
          audience,
          sourceProducts: sourceData.products,
          visuals: sourceData.visuals,
        }),
      )
    }

    const generatedFunnel = normalizeAiFunnel({
      aiData: parsedJson,
      currentData,
      niche,
      problem,
      audience,
      rules,
      templateData,
      sourceProducts: sourceData.products,
      sourceServices: sourceData.services,
      visuals: sourceData.visuals,
    })

    console.log('FINAL HERO IMAGE:', generatedFunnel?.hero?.backgroundImage)

    return res.status(200).json(generatedFunnel)
  } catch (error) {
    const { currentData = {}, generationInputs = {} } = req.body || {}

    return res.status(200).json(
      fallbackFunnel({
        currentData,
        niche: generationInputs?.niche || 'Beauty',
        problem: generationInputs?.problem || 'beauty challenge',
        audience: generationInputs?.audience || 'beauty shoppers',
      }),
    )
  }
}
