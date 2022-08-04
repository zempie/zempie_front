
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;

const COOKIE_NAME = process.env.COOKIE_NAME
export const cookie = {
  setCookie(accessToken: string ){
    console.log('COOKIE_NAME',COOKIE_NAME)

  const {$cookies } = useNuxtApp()    
    $cookies.set(COOKIE_NAME, accessToken, {
      maxAge: DAYSTOSEC_30, //30일 
      path: '/',
      domain: 'localhost'
    })
    
  }
}