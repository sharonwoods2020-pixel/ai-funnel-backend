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

    const generatedData = {
      success: true,

      creator: {
        name: 'AI Creator',
        handle: '@aicreator',
        tagline: `Helping ${audience}`,
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
      ],
    }

    return res.status(200).json(generatedData)
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate funnel.',
    })
  }
}
