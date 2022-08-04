export interface IUser{
  channel_id:string,
  email:string,
  email_verified:boolean,  
  follower_cnt: number,
  following_cnt: number,
  is_following: boolean,
  games: [],
  id: number,
  is_developer: boolean,
  name: string,
  picture: string,
  profile: any,
  setting: any,
  uid: string
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
  description: string,
  enabled: boolean,
  hashtags: string,
  id: number,
  official: boolean,
  pathname: string,
  stage: number,
  title: string,
  updated_at: string,
  url_game: string,
  url_thumb: string,
  url_thumb_gif: string,
  url_thumb_webp: string,
  userId: number,
  user_id: number,
  version: string,
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