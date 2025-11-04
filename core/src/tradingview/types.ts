export interface TvError {
    detail: string
}

export interface TvUser {
    id: string,
    avatars: {
        small: string,
        mid: string,
        big: string,
        orig: string
    }
    username: string,
    is_broker: boolean
    is_pro: boolean
    is_paid_pro: boolean
    pro_plan: string,
    broker_name?: string
    broker_plan?: string
    is_moderator: boolean
    is_trial: boolean
    website: string
    signature: string
    twitter_username: string
    facebook_username: string
    youtube_channel_name: string
    youtube_channel: string,
    follow_status: boolean
}

export interface TvSymbol {
    resolved_symbol: string,
    pro_symbol: string,
    exchange: string,
    exchange_for_display: string,
    short_name: string,
    insturment_name: string,
    description: string,
    short_description: string
    local_description: string
    languange: string,
    country: string,
    provider_id: string,
    flag: string,
    has_fundamentals: true,
    is_spread: true,
    typespecs: string[],
    root?: any
    type: 'stock',
    href: string,
    logo_id: string,
    currency_logo_id: string,
}

export interface TvImage {
    middle: string,
    middle_webp: string,
    big: string
}

export interface TvComment {
    id: number,
    comment: string,
    created_at: string,
    editable_until: string,
    replies_count: number
    likes_count: number,
    user_vote: number,
    user: TvUser,
    spam_status?: any
    is_hidden: boolean,
}

export interface TvIdeaMisc {
    bg_color: string,
    language: string,
    pub_type: 'pine',
    script_type: string
}

export interface TvScript {
    id: number,
    uuid: string,
    views: number,
    description: string,
    like_score: number,
    is_active: boolean,
    is_visible: boolean,
    is_education: boolean,
    is_public: boolean,
    chart_url: string,
    direction: number
    user: TvUser,
    tags: TvTag[],
    image: TvImage,
    symbol: TvSymbol,
    updates: TvScriptUpdate[],
    created_at: string,
    created_timestamp: number
}

export interface TvScriptUpdate {
    id: number,
    type: 'script_update',
    value: string,
    label: string,
    description: string,
    created_at: string
}

export interface TvTag {
    tag: string,
    title: string,
    source: number,
    idea_full_url: string,
    script_full_url: string,
}