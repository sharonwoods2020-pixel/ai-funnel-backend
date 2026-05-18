import { PRODUCT_INTELLIGENCE } from '../data/productIntelligence.js'
import { CAREER_INTELLIGENCE } from '../data/careerIntelligence.js'
import { TEMPLATE_INTELLIGENCE } from '../data/templateIntelligence.js'
import { buildFunnelPrompt } from '../aiFunnelPrompt.js'

const getNicheCategory = (niche = '') => {
  const n = niche.toLowerCase().trim()

  if (n.includes('braid') || n.includes('knotless')) return 'braids'
  if (n.includes('hair') || n.includes('wig') || n.includes('extension')) return 'hair'
  if (n.includes('barber') || n.includes('beard') || n.includes('fade')) return 'barber'
  if (n.includes('nail') || n.includes('acrylic') || n.includes('gel')) return 'nails'
  if (n.includes('lash') || n.includes('brow')) return 'lashes'
  if (n.includes('fragrance') || n.includes('perfume') || n.includes('cologne')) return 'fragrance'
  if (n.includes('skin') || n.includes('skincare') || n.includes('facial')) return 'skincare'
  if (n.includes('gift') || n.includes('basket') || n.includes('bundle')) return 'giftbaskets'

  return 'beauty'
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

const fallbackFunnel = ({ currentData = {}, niche, problem, audience }) => {
  const nicheCategory = getNicheCategory(niche)
  const rules = getNicheRules(nicheCategory)

  return {
    ...currentData,
    template: {
      templateId: `${nicheCategory}-creator-funnel`,
      visualTone: `${nicheCategory} focused creator funnel`,
      layoutStyle: 'mobile-first creator funnel',
      colorMood: 'black, white, neutral',
    },
    creator: {
      name: currentData?.creator?.name || 'Creator',
      handle: currentData?.creator?.handle || '@creator',
      tagline: currentData?.creator?.tagline || `Helping ${audience}`,
      image: currentData?.creator?.image || '/images/creator-profile.webp',
      videoSrc: currentData?.creator?.videoSrc || '',
    },
    hero: {
      headline: `Premium ${niche} Experience`,
      subheadline: `A focused ${niche} solution for ${audience}.`,
      ctaLabel: rules.cta,
      creatorMicroScript: `Here is my recommended ${niche} approach for ${problem}.`,
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
    products: [
      {
        id: 'p1',
        image: '/images/product-1.webp',
        name: `${niche} Starter Offer`,
        benefit: `A focused ${niche} option for ${problem}`,
        cta: rules.cta,
        href: '#',
        learnMore: {
          title: `Learn more about this ${niche} offer`,
          quickBenefit: `Helps support a better ${niche} result.`,
          whyItWorks: `Built around the selected ${niche} category and audience need.`,
          bestFor: audience,
          howToUse: `Use this as part of your ${niche} routine.`,
          creatorInsight: `This keeps the ${niche} offer simple and focused.`,
        },
      },
    ],
    cta: {
      barTagline: `Simple ${niche} routine`,
      finalHeadline: `Ready for your ${niche} transformation?`,
      finalSubtext: `Start with a focused plan for ${problem}.`,
      finalLabel: rules.cta,
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

const normalizeAiFunnel = ({ aiData, currentData, niche, problem, audience, rules, templateData }) => {
  const fallback = fallbackFunnel({
    currentData,
    niche,
    problem,
    audience,
  })

  return {
    ...fallback,

    template: {
      ...fallback.template,
      ...templateData,
      ...(aiData?.template || {}),
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
      ctaLabel: aiData?.hero?.ctaLabel || rules.cta,
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

    products: Array.isArray(aiData?.products) && aiData.products.length
      ? aiData.products.slice(0, 3).map((product, index) => ({
          id: product?.id || `p${index + 1}`,
          image: product?.image || `/images/product-${index + 1}.webp`,
          name: product?.name || `${niche} Offer ${index + 1}`,
          benefit:
            product?.benefit ||
            product?.shortDescription ||
            product?.description ||
            `A focused ${niche} option.`,
          cta: product?.cta || product?.ctaLabel || rules.cta,
          href: product?.href || '#',
          learnMore: product?.learnMore || {
            title: `Learn more about ${product?.name || `${niche} Offer`}`,
            quickBenefit: product?.benefit || '',
            whyItWorks: `Created for ${niche} needs.`,
            bestFor: audience,
            howToUse: `Use as part of your ${niche} routine.`,
            creatorInsight: `This supports the selected ${niche} goal.`,
          },
        }))
      : fallback.products,

    cta: aiData?.finalCta
      ? {
          barTagline: fallback.cta.barTagline,
          finalHeadline: aiData.finalCta.headline || fallback.cta.finalHeadline,
          finalSubtext: aiData.finalCta.subtext || fallback.cta.finalSubtext,
          finalLabel: aiData.finalCta.ctaLabel || rules.cta,
        }
      : fallback.cta,

    reusableAssets: {
      hooks: Array.isArray(aiData?.reusableAssets?.hooks)
        ? aiData.reusableAssets.hooks
        : [],
      ctaVariants: Array.isArray(aiData?.reusableAssets?.ctaVariants)
        ? aiData.reusableAssets.ctaVariants
        : [],
      socialCaptions: Array.isArray(aiData?.reusableAssets?.socialCaptions)
        ? aiData.reusableAssets.socialCaptions
        : [],
      creatorScripts: Array.isArray(aiData?.reusableAssets?.creatorScripts)
        ? aiData.reusableAssets.creatorScripts
        : [],
      emotionalAngles: Array.isArray(aiData?.reusableAssets?.emotionalAngles)
        ? aiData.reusableAssets.emotionalAngles
        : [],
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
    const rules = getNicheRules(nicheCategory)

    const templateData =
      TEMPLATE_INTELLIGENCE?.[nicheCategory]?.luxury ||
      TEMPLATE_INTELLIGENCE?.[nicheCategory]?.glam ||
      {
        templateId: `${nicheCategory}-creator-funnel`,
        visualTone: `${nicheCategory} focused creator funnel`,
        layoutStyle: 'mobile-first creator funnel',
        colorMood: 'black, white, neutral',
      }

    const privatePrompt = buildFunnelPrompt({
      creatorName: currentData?.creator?.name || 'Creator',
      creatorType: rules.voice,
      niche,
      productName: `${niche} Offer`,
      productDescription: problem,
      targetAudience: audience,
      offerType: niche,
      tone: templateData?.visualTone || rules.voice,
      callToAction: rules.cta,
      allowedVocabulary: rules.allowed,
      blockedVocabulary: rules.blocked,
      emotionalAngle: rules.allowed,
    })

    const enforcedPrompt = `
${privatePrompt}

STRICT NICHE CONTROL:
The selected niche is "${niche}".
You must ONLY generate content related to: ${rules.allowed}.
You must NOT use or imply these words/topics: ${rules.blocked}.

PRODUCT/SERVICE CARD RULE:
Generate product/service cards dynamically for the selected niche.
Do NOT use generic skincare products unless the selected niche is skincare.
For Braids, product/service cards must be braid services, braid prep, braid maintenance, protective style care, scalp comfort, edge care, or braid longevity.

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
            content:
              'You are a private AI funnel engine. Return only valid JSON. Never return markdown or explanations.',
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
        }),
      )
    }

    const aiResult = await aiResponse.json()
    const rawText =
      aiResult?.output?.[0]?.content?.[0]?.text ||
      aiResult?.output_text ||
      ''

    const parsedJson = safeParseJson(rawText)

    if (!parsedJson || containsBlockedWords(parsedJson, rules.blocked)) {
      return res.status(200).json(
        fallbackFunnel({
          currentData,
          niche,
          problem,
          audience,
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
    })

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
