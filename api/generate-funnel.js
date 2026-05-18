import { PRODUCT_INTELLIGENCE } from '../data/productIntelligence.js'
import { TEMPLATE_INTELLIGENCE } from '../data/templateIntelligence.js'
import { buildFunnelPrompt } from '../aiFunnelPrompt.js'

const getNicheCategory = (niche = '') => {
  const nicheLower = niche.toLowerCase().trim()

  if (
    nicheLower.includes('braid') ||
    nicheLower.includes('braids') ||
    nicheLower.includes('knotless') ||
    nicheLower.includes('protective style')
  ) {
    return 'braids'
  }

  if (
    nicheLower.includes('hair') ||
    nicheLower.includes('wig') ||
    nicheLower.includes('extension') ||
    nicheLower.includes('lace')
  ) {
    return 'hair'
  }

  if (
    nicheLower.includes('barber') ||
    nicheLower.includes('beard') ||
    nicheLower.includes('fade') ||
    nicheLower.includes('clipper')
  ) {
    return 'barber'
  }

  if (
    nicheLower.includes('nail') ||
    nicheLower.includes('acrylic') ||
    nicheLower.includes('gel nails') ||
    nicheLower.includes('press on')
  ) {
    return 'nails'
  }

  if (
    nicheLower.includes('lash') ||
    nicheLower.includes('lashes') ||
    nicheLower.includes('brows') ||
    nicheLower.includes('brow')
  ) {
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
    nicheLower.includes('facial') ||
    nicheLower.includes('acne')
  ) {
    return 'skincare'
  }

  if (
    nicheLower.includes('gift') ||
    nicheLower.includes('basket') ||
    nicheLower.includes('bundle')
  ) {
    return 'giftbaskets'
  }

  return 'beauty'
}

const getProblemRoute = ({
  nicheCategory,
  problem = '',
  niche = '',
}) => {
  const problemLower = problem.toLowerCase()
  const nicheLower = niche.toLowerCase()
  const combined = `${nicheLower} ${problemLower}`

  if (nicheCategory === 'braids') {
    if (
      combined.includes('knotless') ||
      combined.includes('box braid')
    ) {
      return 'knotless'
    }

    if (
      combined.includes('cornrow') ||
      combined.includes('feed in')
    ) {
      return 'cornrows'
    }

    return 'protective'
  }

  if (nicheCategory === 'hair') {
    if (
      combined.includes('wig') ||
      combined.includes('lace')
    ) {
      return 'wigs'
    }

    return 'extensions'
  }

  if (nicheCategory === 'barber') {
    return 'luxury'
  }

  if (nicheCategory === 'nails') {
    return 'glam'
  }

  if (nicheCategory === 'lashes') {
    return 'glam'
  }

  if (nicheCategory === 'fragrance') {
    return 'luxury'
  }

  if (nicheCategory === 'giftbaskets') {
    return 'luxury'
  }

  if (nicheCategory === 'skincare') {
    return 'luxury'
  }

  return 'general'
}

const getTemplateIntelligence = ({
  nicheCategory,
  productRoute,
}) => {
  const matchedTemplate =
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.[
      productRoute
    ] ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]
      ?.luxury ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]
      ?.glam

  if (matchedTemplate) {
    return matchedTemplate
  }

  return {
    templateId: `${nicheCategory}-creator-funnel`,
    visualTone: `${nicheCategory} focused creator funnel`,
    layoutStyle: 'mobile-first creator funnel',
    colorMood: 'black, white, neutral',
  }
}

const getNicheEnforcement = ({
  nicheCategory,
}) => {
  const rules = {
    braids: {
      blockedVocabulary:
        'serum, skincare, hydration serum, acne, moisturizer, facial',
      ctaStyle:
        'Book The Braid Look ✦',
      creatorVoice:
        'protective style specialist',
    },

    hair: {
      blockedVocabulary:
        'facial cleanser, acne treatment',
      ctaStyle:
        'Shop The Hair Look ✦',
      creatorVoice:
        'hair stylist expert',
    },

    barber: {
      blockedVocabulary:
        'lashes, skincare serum',
      ctaStyle:
        'Get The Fresh Look ✦',
      creatorVoice:
        'barber grooming expert',
    },

    nails: {
      blockedVocabulary:
        'beard growth, braid install',
      ctaStyle:
        'Shop The Nail Look ✦',
      creatorVoice:
        'nail artist',
    },

    lashes: {
      blockedVocabulary:
        'barber fade, braid install',
      ctaStyle:
        'Shop The Lash Look ✦',
      creatorVoice:
        'lash specialist',
    },

    fragrance: {
      blockedVocabulary:
        'braid maintenance, nail polish',
      ctaStyle:
        'Find Your Scent ✦',
      creatorVoice:
        'luxury fragrance curator',
    },

    skincare: {
      blockedVocabulary:
        'cornrows, clippers, fades',
      ctaStyle:
        'Shop The Routine ✦',
      creatorVoice:
        'skincare creator',
    },

    beauty: {
      blockedVocabulary: '',
      ctaStyle:
        'Shop The Routine ✦',
      creatorVoice:
        'beauty creator',
    },
  }

  return rules[nicheCategory] || rules.beauty
}

const getFallbackProducts = (
  nicheCategory,
) => {
  const products = {
    braids: [
      {
        name: 'Braid Prep Consultation',
        benefit:
          'Plan braid styles and maintenance',
        image: '/images/product-1.webp',
      },
      {
        name: 'Protective Style Care',
        benefit:
          'Support braid longevity and neatness',
        image: '/images/product-2.webp',
      },
    ],

    hair: [
      {
        name: 'Luxury Hair Install',
        benefit:
          'Polished install and styling support',
        image: '/images/product-1.webp',
      },
    ],

    barber: [
      {
        name: 'Fresh Cut Grooming',
        benefit:
          'Sharp look and beard maintenance',
        image: '/images/product-1.webp',
      },
    ],

    nails: [
      {
        name: 'Nail Glam Set',
        benefit:
          'Fresh polished nail appearance',
        image: '/images/product-1.webp',
      },
    ],

    lashes: [
      {
        name: 'Lash Glam Routine',
        benefit:
          'Full glam lash maintenance',
        image: '/images/product-1.webp',
      },
    ],

    fragrance: [
      {
        name: 'Luxury Signature Scent',
        benefit:
          'Elegant daily fragrance experience',
        image: '/images/product-1.webp',
      },
    ],

    skincare: [
      {
        name: 'HydraGlow Renewal Serum',
        benefit:
          'Deep hydration and glow support',
        image: '/images/product-1.webp',
      },
    ],

    beauty: [
      {
        name: 'Beauty Creator Routine',
        benefit:
          'Simple creator beauty routine',
        image: '/images/product-1.webp',
      },
    ],
  }

  return (
    products[nicheCategory] ||
    products.beauty
  )
}

const getIntelligentProducts = ({
  nicheCategory,
}) => {
  const matchedProducts =
    PRODUCT_INTELLIGENCE?.[
      nicheCategory
    ]?.luxury || []

  const containsSkincareLanguage =
    matchedProducts?.some((product) => {
      const text = `${product?.name || ''} ${
        product?.benefit || ''
      }`.toLowerCase()

      return (
        text.includes('serum') ||
        text.includes('skin') ||
        text.includes('hydration')
      )
    })

  if (
    nicheCategory !== 'skincare' &&
    containsSkincareLanguage
  ) {
    return getFallbackProducts(
      nicheCategory,
    )
  }

  if (!matchedProducts.length) {
    return getFallbackProducts(
      nicheCategory,
    )
  }

  return matchedProducts
}

const fallbackFunnel = ({
  currentData,
  niche,
  problem,
  audience,
}) => {
  const nicheCategory =
    getNicheCategory(niche)

  const nicheRules =
    getNicheEnforcement({
      nicheCategory,
    })

  const products =
    getFallbackProducts(
      nicheCategory,
    )

  return {
    ...currentData,

    template: {
      templateId: `${nicheCategory}-creator-funnel`,
    },

    creator: {
      name:
        currentData?.creator?.name ||
        'Maya Brooks',

      handle:
        currentData?.creator?.handle ||
        '@creator',

      tagline:
        currentData?.creator?.tagline ||
        `Helping ${audience}`,

      image:
        currentData?.creator?.image ||
        '/images/creator-profile.webp',

      videoSrc:
        currentData?.creator?.videoSrc ||
        '',
    },

    hero: {
      headline:
        `Premium ${niche} Experience`,

      subheadline:
        `A focused ${niche} solution for ${audience}.`,

      ctaLabel:
        nicheRules.ctaStyle,

      creatorMicroScript:
        `Here is my recommended ${niche} routine.`,
    },

    problems: [
      {
        icon: '✨',
        title: problem,
        description:
          `A common ${niche} concern.`,
      },
    ],

    routineSteps: [
      {
        step: 1,
        title: 'Choose Your Look',
        tip:
          `Start with the right ${niche} goal.`,
      },

      {
        step: 2,
        title: 'Follow The Routine',
        tip:
          `Use a consistent ${niche} plan.`,
      },
    ],

    products: products.map(
      (product, index) => ({
        id: `p${index + 1}`,
        image: product.image,
        name: product.name,
        benefit: product.benefit,
        cta:
          nicheRules.ctaStyle,
        href: '#',
      }),
    ),

    cta: {
      barTagline:
        `Simple ${niche} routine`,

      finalHeadline:
        `Ready for your ${niche} transformation?`,

      finalSubtext:
        `Start your new ${niche} journey today.`,

      finalLabel:
        nicheRules.ctaStyle,
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

export default async function handler(
  req,
  res,
) {
  try {
    const {
      currentData = {},
      generationInputs = {},
    } = req.body || {}

    const {
      niche = 'Beauty',
      problem = 'beauty challenge',
      audience = 'beauty creators',
    } = generationInputs

    const nicheCategory =
      getNicheCategory(niche)

    const productRoute =
      getProblemRoute({
        nicheCategory,
        problem,
        niche,
      })

    const intelligentProducts =
      getIntelligentProducts({
        nicheCategory,
        productRoute,
      })

    const templateData =
      getTemplateIntelligence({
        nicheCategory,
        productRoute,
      })

    const nicheRules =
      getNicheEnforcement({
        nicheCategory,
      })

    const privatePrompt =
      buildFunnelPrompt({
        creatorName:
          currentData?.creator?.name ||
          'Creator',

        creatorType:
          nicheRules.creatorVoice,

        niche,

        productName:
          intelligentProducts?.[0]
            ?.name ||
          `${niche} Offer`,

        productDescription:
          intelligentProducts?.[0]
            ?.benefit ||
          problem,

        targetAudience:
          audience,

        offerType:
          niche,

        tone:
          templateData?.visualTone ||
          nicheRules.creatorVoice,

        callToAction:
          nicheRules.ctaStyle,

        blockedVocabulary:
          nicheRules.blockedVocabulary,
      })

    console.log(
      'PRIVATE PROMPT:',
      privatePrompt,
    )

    const generatedFunnel =
      fallbackFunnel({
        currentData,
        niche,
        problem,
        audience,
      })

    return res.status(200).json({
      success: true,
      promptUsed:
        privatePrompt,
      funnel:
        generatedFunnel,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      error:
        'Failed to generate funnel',
    })
  }
}
