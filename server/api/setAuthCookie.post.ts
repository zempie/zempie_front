

import { setCookie } from 'h3'
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;

export default defineEventHandler(async(event) => {
  const body = await useBody(event)
  if(process.env.COOKIE_NAME){
  setCookie(event, process.env.COOKIE_NAME, body.accessToken, {
    maxAge:DAYSTOSEC_30,
    path:'/',
    domain:process.env.COOKIE_DOMAIN
  }); 
  return true
  }
})