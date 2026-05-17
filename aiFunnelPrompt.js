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
  } = data || {}

  return `
You are an elite AI funnel strategist.

Generate a high-converting creator-led funnel in STRICT JSON format only.

IMPORTANT:
Do not return markdown.
Do not return explanations.
Do not return code fences.
Return valid JSON only.

FUNNEL CONTEXT:
Creator Name: ${creatorName}
Creator Type: ${creatorType}
Niche: ${niche}
Product Name: ${productName}
Product Description: ${productDescription}
Target Audience: ${targetAudience}
Offer Type: ${offerType}
Tone: ${tone}
Primary CTA: ${callToAction}

CORE RULES:
- Keep the funnel clean, premium, and conversion-focused.
- Do not add extra sections.
- Do not redesign the layout.
- Generate content only.
- Use emotional but believable sales language.
- Keep copy short, mobile-friendly, and easy to scan.
- Learn More content should be helpful but not blog-length.
- The funnel should feel creator-led and product-focused.

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
