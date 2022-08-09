export interface IUser{
  name: string,
  id: number,
  channel_id:string,
  email:string,
  uid: string,
  email_verified?:boolean,  
  followers_cnt?: number,
  followings_cnt?: number,
  is_following?: boolean,
  games?: IGame[],
  is_developer?: boolean,  
  picture?: string,
  profile?: any,
  setting?: any,
}




export enum eUploadStage {
  NONE = -1,
  DEV = 1,
  EARLY,
  COMPLETE,
  MONETIZATION
}

export interface IGame{
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
  user:IUser,
}


export interface IProject{
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

export interface ICommunityPayload{
  limit: number,
  offset?: number,
  community?: string,
  sort?: string,
  show?: string,
}




export interface IUserChannel{
  id:number,
  uid: string,
  name:string,
  channel_id: string,
  email: string,
  picture: string,
  is_developer: boolean,
  following_cnt: number,
  follower_cnt: number
  projects:IProject[],
  profile:{
    level: number,
    exp: number,
    following_cnt: number,
    follower_cnt: number,
    state_msg: string,
    description: string,
    url_banner: string
  },
  games:IGame[]
}

