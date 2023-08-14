export interface IUser {
  name: string,
  id: number,
  channel_id: string,
  email: string,
  uid: string,
  email_verified?: boolean,
  followers_cnt?: number,
  followings_cnt?: number,
  follower_cnt: number,
  following_cnt: number,
  is_following?: boolean,
  games?: IGame[],
  is_developer?: boolean,
  picture?: string,
  profile?: any,
  coin?: {
    zem: number,
    pie: number
  },
  setting?: {
    alarm: boolean,
    battle: boolean,
    beat: boolean,
    language: number,
    like: boolean,
    reply: boolean,
    theme: number,
    theme_extra: any,
    dm_alarm: boolean
  },
  banner_img?: string,
  profile_img?: string,
  meta?: {
    unread_noti_count?: number,
    unread_dm_count?: number,
  }
  nickname?: string,
  unread_msg_cnt?: number,
  is_blocked?: boolean
}


export interface IFollowUser {
  block_you: boolean,
  channel_id: string,
  community: any[]
  created_at: string,
  email: string,
  follow_you: boolean,
  followers_cnt: number,
  followings_cnt: string,
  id: string,
  is_blocked: boolean,
  is_following: boolean,
  is_muted: boolean,
  mutes_you: boolean,
  name: string,
  nickname: string,
  profile_img: string,
  banner_img: string,
  type: string,
  uid: string,
}


export interface IGame {
  game: { name: string; id: number; uid: string; email: string; channel_id: string; picture: string }
  activated: boolean,
  category: number,
  control_type: number,
  count_heart: number,
  count_over: number,
  count_start: number,
  created_at: string,
  deleted_at: string,
  updated_at: string,
  description: string,
  enabled: boolean,
  hashtags: string,
  id: number,
  official: boolean,
  pathname: string,
  stage: number,
  title: string,
  url_game: string,
  url_thumb: string,
  url_thumb_gif: string,
  url_thumb_webp: string,
  url_banner: string,
  userId: number,
  user_id: number,
  version: string,
  user: IUser,
  game_jam: any,
  is_like?: boolean,
  game_type: number,
  support_platform: number | string
}


export interface IProject {
  control_type: number,
  created_at: string,
  deleted_at: string,
  deploy_version_id: number,
  description: string,
  game: IGame,
  gameId: number,
  game_id: number,
  hashtags: string,
  id: number,
  name: string,
  picture: string,
  picture2: string,
  picture_webp: string,
  projectVersions: [],
  stage: number,
  state: number,
  update_version_id: number,
  updated_at: string,
  userId: number,
  user_id: number,
}

export interface IVersion {
  autoDeploy: boolean,
  created_at: string,
  deleted_at: null
  description: null
  game_id: number,
  id: number,
  number: number,
  projectId: number,
  project_id: number,
  reason: null
  size: number,
  state: string,
  updated_at: string,
  url: string,
  version: string,
}

export interface ICommunityPayload {
  limit: number,
  offset?: number,
  community?: string,
  sort?: string,
  show?: string,
}




export interface IUserChannel {
  id: number,
  uid: string,
  name: string,
  nickname: string,
  channel_id: string,
  email: string,
  picture: string,
  is_developer: boolean,
  is_following: boolean,
  post_cnt: number,
  following_cnt: number,
  follower_cnt: number
  projects: IProject[],
  profile: {
    level: number,
    exp: number,
    following_cnt: number,
    follower_cnt: number,
    state_msg: string,
    description: string,
    banner_img: string
  },
  communities: ICommunity[]
  games: IGame[],
  is_blocked?: boolean,
}

export interface IFile {
  size: number,
  url: string,
  priority: number,
  type: string
}

export interface IMetadata {
  title: string,
  type: number,
  url: string,
  description?: string,
  favicon?: string,
  img?: string,
}
export interface IFeed {
  liked: boolean,
  is_pinned: boolean,
  is_retweet: boolean,
  id: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
  user_id: number,
  post_type: string,
  funtion_type: string,
  attatchment_files: any
  visibility: string,
  content: string,
  hashtags: [],
  user_tag: string,
  like_cnt: number,
  comment_cnt: number,
  read_cnt: number,
  shared_cnt: number,
  scheduled_for: string,
  status: string,
  retweet_id: number,
  user: {
    name: string,
    id: number,
    channel_id: string,
    email: string,
    uid: string,
    follow_you: boolean,
    is_following: boolean,
    block_you: boolean,
    is_blocked: boolean,
    mutes_you: boolean,
    is_muted: boolean,
    nickname: string,
    picture: string,
    is_developer: number,
    last_log_in: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    followers_cnt: number,
    followings_cnt: number
  },
  posted_at: {
    created_at: string,
    updated_at: string,
    deleted_at: string,
    community: { comminity: ICommunity, channel: IComChannel }[],
    portfolio_ids: number,
    id: string,
    posts_id: string,
    channel_id: string,
    game_id?: number,
    game: IGame[]
  },
  metadata?: IMetadata

}



export interface ICommunity {
  banner_img: string,
  channels: IComChannel[],
  created_at: number,
  deletedAt: number,
  description: string,
  id: string,
  is_certificated: boolean,
  is_private: boolean,
  is_subscribed: boolean,
  manager_id: number,
  member_cnt: number,
  name: string,
  owner_id: number,
  posts_cnt: number,
  profile_img: string,
  state: string,
  submanager_id: number,
  updatedAt: number,
  url: string,
  visit_cnt: number,
}

export interface IComChannel {
  community_id: string,
  created_at: number,
  deletedAt: number,
  description: string,
  id: string,
  profile_img: string,
  state: string,
  title: string,
  updatedAt: number,
  user_id: number,
}

export interface INotification {
  id: number,
  user_id: number,
  target_id: string,
  is_read: boolean,
  content: string,
  type: number,
  created_at: string,
  user: IUser
  updated_at?: string,
  type_text?: string
}

export interface IEvent {
  id: number,
  start_date: string,
  desc: string,
  title: string,
  end_date: string,
  type: number,
  url_img: string,
  category: eGameCategory
}

export interface IComment {
  attatchment_files: [],
  children_comments: IComment[],
  content: string,
  created_at: string,
  deleted_at: string,
  dislike_cnt: number,
  id: string,
  is_liked: boolean,
  is_pinned: boolean,
  is_private: boolean,
  is_read: boolean,
  like_cnt: number,
  post_id: string,
  type: string,
  updated_at: string,
  user: IUser,
  user_id: number,
  user_uid: string,
  parent_id?: string,
}

export interface IChat {
  id: number,
  created_at: string,
  unread_count: number,
  is_read: boolean,
  last_message: IMessage,
  last_chat_at: string,
  joined_users: IUser[],
  is_group_room: boolean,
  unread_start_id: number,
  updated_message?: IMessage[]
  meta?: { isLastMsg: boolean },
  has_name: Boolean,
  name: String
}

export interface IMessage {
  id: number,
  chat_idx?: number,
  contents: string,
  sender: IUser,
  room_id: number,
  created_at: string | number,
  type: eChatType,
  media_attachments?: [
    {
      id: number,
      type: string,
      url: string,
      preview_url: string,
      user_uid: string,
      file_name: string,
      content_type: string
    }
  ],
  card?: {
    id: number,
    url: string,
    title: string,
    description: string,
    type: string,
    provider_user: IUser
    preview_image: string
  }

}
export interface IReply {
  content: string,
  count_bad: number,
  count_good: number,
  count_reply: number,
  created_at: string,
  id: number,
  my_reply: number,
  target: number,
  updated_at: string
  user: IUser,
  game_id?: number
}


export enum eGameStage {
  NONE = -1,
  DEV = 1,
  EARLY,
  COMPLETE,
  MONETIZATION
}

export enum eGameCategory {
  NONE = -1,
  Challenge,
  Certified,
  Affiliated,
  ZemJam,
  GJ,
  GGJ,
}

export enum eGameType {
  Html = 1,
  Download
}

export enum ePlatformType {
  Window = 1,
  Mac,
  Android,
  Ios
}

export enum eNotificationType {
  notice = 1,
  post,
  post_like,
  comment,
  comment_like,
  report,
  retweet,
  follow,
  recomment,
  dm
}

export enum eMetadataType {
  website = 1,
  video
}

export enum eReportType {
  post = 1,
  comment,
  game,
  user
}

export enum eChatType {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  HTML = 4,
}



declare global {
  interface Window {
    Kakao: any
  }
}
