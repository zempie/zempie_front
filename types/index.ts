export interface IUser {
  name: string,
  id: number,
  channel_id: string,
  email: string,
  uid: string,
  email_verified?: boolean,
  followers_cnt?: number,
  followings_cnt?: number,
  is_following?: boolean,
  games?: IGame[],
  is_developer?: boolean,
  picture?: string,
  profile?: any,
  setting?: any,
}




export enum eGameStage {
  NONE = -1,
  DEV = 1,
  EARLY,
  COMPLETE,
  MONETIZATION
}

export interface IGame {
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
  userId: number,
  user_id: number,
  version: string,
  user: IUser,
  game_jam: any,
  is_like?: boolean
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
    url_banner: string
  },
  communities: ICommunity[]
  games: IGame[]
}

export interface IFile {
  size: number,
  url: string,
  priority: number,
  type: string
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
    follow_you: boolean,
    is_following: boolean,
    block_you: boolean,
    is_blocked: boolean,
    mutes_you: boolean,
    is_muted: boolean,
    id: number,
    uid: string,
    name: string,
    channel_id: string,
    picture: string,
    email: string,
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
    community: [],
    portfolio_ids: number,
    id: string,
    posts_id: string,
    channel_id: string,
    game_id: number
  }

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

