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

const getProblemRoute = ({ nicheCategory, problem = '', niche = '' }) => {
  const problemLower = problem.toLowerCase()
  const nicheLower = niche.toLowerCase()
  const combined = `${nicheLower} ${problemLower}`

  if (nicheCategory === 'braids') {
    if (
      combined.includes('knotless') ||
      combined.includes('box braid') ||
      combined.includes('box braids')
    ) {
      return 'knotless'
    }

    if (
      combined.includes('cornrow') ||
      combined.includes('feed in') ||
      combined.includes('feed-in')
    ) {
      return 'cornrows'
    }

    if (
      combined.includes('french') ||
      combined.includes('french braids')
    ) {
      return 'french'
    }

    return 'protective'
  }

  if (nicheCategory === 'hair') {
    if (
      combined.includes('wig') ||
      combined.includes('lace') ||
      combined.includes('install')
    ) {
      return 'wigs'
    }

    if (
      combined.includes('extension') ||
      combined.includes('bundles')
    ) {
      return 'extensions'
    }

    return 'luxury'
  }

  if (nicheCategory === 'barber') {
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

  if (nicheCategory === 'nails') {
    if (
      combined.includes('press') ||
      combined.includes('press-on') ||
      combined.includes('press on')
    ) {
      return 'presson'
    }

    if (
      combined.includes('gel') ||
      combined.includes('acrylic')
    ) {
      return 'glam'
    }

    return 'glam'
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

  if (nicheCategory === 'giftbaskets') {
    if (
      combined.includes('birthday') ||
      combined.includes('holiday') ||
      combined.includes('celebration')
    ) {
      return 'celebration'
    }

    return 'luxury'
  }

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

  return 'general'
}

const getDefaultProductsForNiche = ({ nicheCategory, problem = '', audience = '' }) => {
  const productSets = {
    braids: [
      {
        name: 'Braid Prep Consultation',
        benefit: 'Plan the right braid style, length, and maintenance routine',
        image: '/images/product-1.webp',
      },
      {
        name: 'Protective Style Care Guide',
        benefit: 'Simple aftercare tips to help braids stay neat longer',
        image: '/images/product-2.webp',
      },
      {
        name: 'Braid Maintenance Kit',
        benefit: 'Support scalp comfort, edge care, and style freshness',
        image: '/images/product-3.webp',
      },
    ],

    hair: [
      {
        name: 'Hair Install Consultation',
        benefit: 'Choose the right style, look, and maintenance plan',
        image: '/images/product-1.webp',
      },
      {
        name: 'Hair Care Routine Guide',
        benefit: 'Keep your style looking polished between appointments',
        image: '/images/product-2.webp',
      },
      {
        name: 'Hair Finish Kit',
        benefit: 'Support shine, hold, and daily styling confidence',
        image: '/images/product-3.webp',
      },
    ],

    barber: [
      {
        name: 'Fresh Cut Grooming Plan',
        benefit: 'Keep your cut, beard, and edges looking sharp',
        image: '/images/product-1.webp',
      },
      {
        name: 'Beard Care Routine',
        benefit: 'Support a clean, polished beard care habit',
        image: '/images/product-2.webp',
      },
      {
        name: 'Lineup Maintenance Kit',
        benefit: 'Help maintain a fresh look between barber visits',
        image: '/images/product-3.webp',
      },
    ],

    nails: [
      {
        name: 'Nail Style Consultation',
        benefit: 'Pick the right shape, color, and design for your look',
        image: '/images/product-1.webp',
      },
      {
        name: 'Nail Care Prep Guide',
        benefit: 'Support longer-lasting sets with simple prep steps',
        image: '/images/product-2.webp',
      },
      {
        name: 'Aftercare Nail Kit',
        benefit: 'Keep your nails looking fresh between appointments',
        image: '/images/product-3.webp',
      },
    ],

    lashes: [
      {
        name: 'Lash Style Consultation',
        benefit: 'Choose a lash look that fits your face and routine',
        image: '/images/product-1.webp',
      },
      {
        name: 'Lash Aftercare Guide',
        benefit: 'Support better retention and cleaner daily care',
        image: '/images/product-2.webp',
      },
      {
        name: 'Lash Maintenance Kit',
        benefit: 'Keep lashes looking neat between fills',
        image: '/images/product-3.webp',
      },
    ],

    fragrance: [
      {
        name: 'Signature Scent Match',
        benefit: 'Find a scent profile that fits your mood and style',
        image: '/images/product-1.webp',
      },
      {
        name: 'Everyday Fragrance Guide',
        benefit: 'Choose scents for work, date night, and daily wear',
        image: '/images/product-2.webp',
      },
      {
        name: 'Fragrance Layering Set',
        benefit: 'Build a more memorable scent routine',
        image: '/images/product-3.webp',
      },
    ],

    giftbaskets: [
      {
        name: 'Custom Gift Basket Build',
        benefit: 'Create a thoughtful gift around the recipient’s style',
        image: '/images/product-1.webp',
      },
      {
        name: 'Beauty Gift Bundle',
        benefit: 'A curated beauty bundle made for easy gifting',
        image: '/images/product-2.webp',
      },
      {
        name: 'Occasion Gift Upgrade',
        benefit: 'Add a polished touch for birthdays, holidays, or events',
        image: '/images/product-3.webp',
      },
    ],

    skincare: [
      {
        name: 'HydraGlow Renewal Serum',
        benefit: 'Deep hydration and smoother-looking skin',
        image: '/images/product-1.webp',
      },
      {
        name: 'Velvet Repair Cream',
        benefit: 'Helps improve texture and softness',
        image: '/images/product-2.webp',
      },
      {
        name: 'Radiance Boost Cleanser',
        benefit: 'Fresh, clean glow without dryness',
        image: '/images/product-3.webp',
      },
    ],

    beauty: [
      {
        name: 'Beauty Routine Starter',
        benefit: 'A simple routine built around your beauty goal',
        image: '/images/product-1.webp',
      },
      {
        name: 'Creator Care Guide',
        benefit: 'Easy steps to help you get started with confidence',
        image: '/images/product-2.webp',
      },
      {
        name: 'Beauty Maintenance Kit',
        benefit: 'Helpful support for keeping your look polished',
        image: '/images/product-3.webp',
      },
    ],
  }

  return productSets[nicheCategory] || productSets.beauty
}

const getIntelligentProducts = ({ nicheCategory, productRoute, problem, audience }) => {
  const matchedProducts =
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.[productRoute] ||
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.luxury ||
    PRODUCT_INTELLIGENCE?.[nicheCategory]?.glam ||
    []

  const containsSkincareLanguage = matchedProducts?.some((product) => {
    const text = `${product?.name || ''} ${product?.benefit || ''}`.toLowerCase()

    return (
      text.includes('serum') ||
      text.includes('skin') ||
      text.includes('skincare') ||
      text.includes('hydration') ||
      text.includes('glow') ||
      text.includes('facial')
    )
  })

  if (nicheCategory !== 'skincare' && containsSkincareLanguage) {
    return getDefaultProductsForNiche({
      nicheCategory,
      problem,
      audience,
    })
  }

  if (!matchedProducts.length) {
    return getDefaultProductsForNiche({
      nicheCategory,
      problem,
      audience,
    })
  }

  return matchedProducts
}

const getTemplateIntelligence = ({ nicheCategory, productRoute }) => {
  const matchedTemplate =
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.[productRoute] ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.luxury ||
    TEMPLATE_INTELLIGENCE?.[nicheCategory]?.glam

  if (matchedTemplate) {
    return matchedTemplate
  }

  return {
    templateId: `${nicheCategory}-creator-funnel`,
    visualTone: `${nicheCategory} focused, creator driven, conversion focused`,
    layoutStyle: 'mobile-first creator funnel',
    colorMood: 'black, white, neutral',
  }
}

const getNicheEnforcement = ({ nicheCategory, niche, problem }) => {
  const rules = {
    braids: {
      allowedVocabulary:
        'braids, braid install, knotless braids, box braids, cornrows, French braids, protective styles, scalp comfort, edge care, braid maintenance, braid longevity, neat parts, style confidence',
      blockedVocabulary:
        'serum, skincare, skin glow, hydration serum, facial, acne, wrinkles, dark spots, cleanser, moisturizer',
      creatorVoice:
        'protective style specialist, braid expert, neat parts, confidence-focused, appointment-ready',
      emotionalAngle:
        'confidence, protective styling, low-maintenance beauty, fresh style, polished look',
      ctaStyle:
        'Book The Braid Look ✦',
    },

    hair: {
      allowedVocabulary:
        'hair install, extensions, wigs, bundles, lace install, silk press, style maintenance, shine, confidence, hair transformation',
      blockedVocabulary:
        'facial, acne, serum for skin, skincare, cleanser, moisturizer',
      creatorVoice:
        'hair stylist, transformation-focused, beauty expert, confidence-driven',
      emotionalAngle:
        'transformation, confidence, polished style, beauty upgrade',
      ctaStyle:
        'Shop The Hair Look ✦',
    },

    barber: {
      allowedVocabulary:
        'barber, beard, fade, lineup, grooming, clippers, fresh cut, sharp edges, masculine grooming',
      blockedVocabulary:
        'skincare serum, facial glow, lashes, nails, braid install',
      creatorVoice:
        'barber expert, sharp, clean, masculine, grooming-focused',
      emotionalAngle:
        'sharpness, confidence, clean look, professional grooming',
      ctaStyle:
        'Get The Fresh Look ✦',
    },

    nails: {
      allowedVocabulary:
        'nails, acrylics, gel set, press-ons, manicure, nail art, shape, polish, design, fresh set',
      blockedVocabulary:
        'skincare serum, facial, braids, beard growth',
      creatorVoice:
        'nail artist, stylish, expressive, glam, design-focused',
      emotionalAngle:
        'self-expression, glam, confidence, fresh set energy',
      ctaStyle:
        'Shop The Nail Look ✦',
    },

    lashes: {
      allowedVocabulary:
        'lashes, lash extensions, lash set, lash fill, brows, retention, glam eyes, lash care',
      blockedVocabulary:
        'braids, beard, skincare serum, facial cleanser',
      creatorVoice:
        'lash artist, glam, beauty-forward, confident, feminine',
      emotionalAngle:
        'glam, confidence, beauty enhancement, effortless eyes',
      ctaStyle:
        'Shop The Lash Look ✦',
    },

    fragrance: {
      allowedVocabulary:
        'perfume, cologne, fragrance, scent, signature scent, luxury, fresh, warm, romantic, everyday wear',
      blockedVocabulary:
        'braids, nails, beard, acne, cleanser',
      creatorVoice:
        'fragrance curator, elegant, luxury-driven, aspirational',
      emotionalAngle:
        'luxury, attraction, identity, signature presence',
      ctaStyle:
        'Find Your Scent ✦',
    },

    giftbaskets: {
      allowedVocabulary:
        'gift basket, curated gift, beauty bundle, occasion, birthday, holiday, thoughtful gifting, presentation',
      blockedVocabulary:
        'acne, beard growth, lash retention, braid install',
      creatorVoice:
        'gift curator, warm, thoughtful, celebratory, personal',
      emotionalAngle:
        'thoughtfulness, celebration, surprise, emotional gifting',
      ctaStyle:
        'Build The Gift ✦',
    },

    skincare: {
      allowedVocabulary:
        'skincare, skin, hydration, glow, cleanser, serum, moisturizer, texture, softness, facial routine',
      blockedVocabulary:
        'braid install, clippers, nail set, lash fill',
      creatorVoice:
        'skincare creator, soft, trustworthy, polished, routine-focused',
      emotionalAngle:
        'self-care, glow, confidence, simplicity, daily routine',
      ctaStyle:
        'Shop The Routine ✦',
    },

    beauty: {
      allowedVocabulary:
        'beauty routine, creator recommendation, self-care, confidence, polished look',
      blockedVocabulary:
        '',
      creatorVoice:
        'beauty creator, helpful, polished, conversion-focused',
      emotionalAngle:
        'confidence, simplicity, transformation',
      ctaStyle:
        'Shop The Routine ✦',
    },
  }

  return rules[nicheCategory] || rules.beauty
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
    problem,
    audience,
  })

  const nicheRules = getNicheEnforcement({
    nicheCategory,
    niche,
    problem,
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
      headline: `Create A Better ${niche} Result For ${problem}`,
      subheadline: `A focused ${niche} routine made for ${audience}.`,
      ctaLabel: nicheRules.ctaStyle,
      creatorMicroScript: `Here is the simple ${niche} approach I recommend for ${problem}.`,
    },

    problems: [
      {
        icon: '😩',
        title: problem,
        description: `A common ${niche} issue for ${audience}.`,
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
        title: 'Start With The Goal',
        tip: `Choose the ${niche} result you want before picking products or services.`,
      },
      {
        step: 2,
        title: 'Use The Right Support',
        tip: `Use ${niche}-specific care, prep, or maintenance steps.`,
      },
      {
        step: 3,
        title: 'Keep It Fresh',
        tip: 'Follow a simple maintenance plan so the result stays polished.',
      },
    ],

    products: fallbackProducts.map((product, index) => ({
      id: `p${index + 1}`,
      image: product.image,
      name: product.name,
      benefit: product.benefit,
      cta: nicheRules.ctaStyle,
      href: '#',
      learnMore: {
        title: `Learn more about ${product.name}`,
        quickBenefit: product.benefit,
        whyItWorks: `Designed specifically for a ${niche} focused routine.`,
        bestFor: audience,
        howToUse: `Use this as part of your ${niche} prep or maintenance plan.`,
        creatorInsight: `I like this because it keeps the ${niche} routine simple and focused.`,
      },
    })),

    cta: {
      barTagline: `A simple ${niche} routine for ${audience}.`,
      finalHeadline: `Ready to improve your ${niche} result?`,
      finalSubtext: `Start with a focused plan made for ${problem}.`,
      finalLabel: nicheRules.ctaStyle,
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
