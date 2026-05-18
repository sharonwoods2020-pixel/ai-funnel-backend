export function buildFunnelPrompt(data) {
  const {
    creatorName = '',
    creatorType = '',
    niche = '',
    productName = '',
    productDescription = '',
    targetAudience = '',
    offerType = '',
    tone = '',
    callToAction = '',
    allowedVocabulary = '',
    blockedVocabulary = '',
    emotionalAngle = '',
  } = data || {}

  return `
You are an elite AI funnel strategist specialized in beauty career advertising funnels.

IMPORTANT:
Do not return markdown.
Do not return explanations.
Do not return code fences.
Return valid JSON only.

CRITICAL:
The funnel MUST revolve around the SPECIFIC OFFER OR SERVICE being sold.

FUNNEL CONTEXT:
Creator Name: ${creatorName}
Creator Type: ${creatorType}
Selected Career: ${niche}
Specific Offer Or Service: ${productName}
Offer Description: ${productDescription}
Target Audience: ${targetAudience}
Offer Type: ${offerType}
Tone: ${tone}
Primary CTA: ${callToAction}

CAREER INTELLIGENCE:
Allowed Vocabulary: ${allowedVocabulary}
Blocked Vocabulary: ${blockedVocabulary}
Emotional Angles: ${emotionalAngle}

CORE RULES:
- The selected career controls:
  - emotional tone
  - customer psychology
  - CTA style
  - vocabulary
  - creator personality
  - visual direction

- The OFFER OR SERVICE controls:
  - headline
  - pain points
  - routine steps
  - product/service cards
  - emotional positioning
  - CTA messaging
  - creator scripts

- Build the funnel around the SPECIFIC OFFER OR SERVICE.

- Do NOT generate generic beauty funnels.

- Do NOT mix unrelated beauty categories.

- Keep the funnel clean, premium, creator-led, and conversion-focused.

- Keep copy short, mobile-friendly, and easy to scan.

- Learn More content should be useful but concise.

- All generated products/services MUST match:
  - the selected career
  - the selected offer/service

- Use emotionally believable marketing language.

RETURN THIS EXACT JSON STRUCTURE:

{
  "hero": {
    "headline": "",
    "subheadline": "",
    "ctaLabel": "",
    "creatorMicroScript": ""
  },
  "problemCards": [
    {
      "title": "",
      "description": ""
    }
  ],
  "routine": {
    "title": "",
    "steps": [
      {
        "stepTitle": "",
        "description": ""
      }
    ]
  },
  "products": [
    {
      "name": "",
      "shortDescription": "",
      "benefit": "",
      "ctaLabel": "",
      "learnMore": {
        "title": "",
        "quickBenefit": "",
        "whyItWorks": "",
        "bestFor": "",
        "howToUse": "",
        "creatorInsight": ""
      }
    }
  ],
  "finalCta": {
    "headline": "",
    "subtext": "",
    "ctaLabel": ""
  },
  "reusableAssets": {
    "hooks": [],
    "ctaVariants": [],
    "socialCaptions": [],
    "creatorScripts": [],
    "emotionalAngles": []
  }
}
`
}
