import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function pickRandom(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return items[Math.floor(Math.random() * items.length)]
}

async function getPlatformAvatar() {
  const avatarResult = await supabase
    .from('platform_talking_heads')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: true })

  const avatars = avatarResult.data || []

  if (avatars.length === 0) {
    return null
  }

  return pickRandom(avatars)
}

function mergeTalkingHeadWithAvatar(talkingHead, avatar) {
  return {
    ...talkingHead,
    avatar_id: avatar?.id || null,
    avatar_name: avatar?.name || null,
    avatar_gender: avatar?.gender || null,
    avatar_url:
      talkingHead?.thumbnail_url ||
      talkingHead?.headshot_url ||
      avatar?.avatar_url ||
      null,
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const {
      career_key = 'hair-braider',
      service_slug = 'knotless-braids',
      style_slug = 'knotless-braids',
      creator_id = null,
    } = req.body || {}

    let creatorTalkingHead = null

    if (creator_id) {
      const creatorResult = await supabase
        .from('creator_talking_heads')
        .select('*')
        .eq('creator_id', creator_id)
        .eq('active', true)
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      creatorTalkingHead = creatorResult.data || null
    }

    if (creatorTalkingHead) {
      const avatar = await getPlatformAvatar()

      return res.status(200).json({
        success: true,
        showTalkingHead: true,
        source: 'creator',
        talkingHead: mergeTalkingHeadWithAvatar(creatorTalkingHead, avatar),
      })
    }

    const templateResult = await supabase
      .from('talking_head_templates')
      .select('*')
      .eq('career_key', career_key)
      .eq('service_slug', service_slug)
      .eq('style_slug', style_slug)
      .eq('active', true)
      .eq('approval_status', 'approved')
      .order('priority', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (templateResult.data) {
      const avatar = await getPlatformAvatar()

      return res.status(200).json({
        success: true,
        showTalkingHead: true,
        source: 'platform_default',
        talkingHead: mergeTalkingHeadWithAvatar(templateResult.data, avatar),
      })
    }

    return res.status(200).json({
      success: true,
      showTalkingHead: false,
      source: 'none',
      talkingHead: null,
    })
  } catch (error) {
    console.error('GET TALKING HEAD API ERROR:', error)

    return res.status(500).json({
      success: false,
      error: 'Failed to load talking head.',
    })
  }
}
