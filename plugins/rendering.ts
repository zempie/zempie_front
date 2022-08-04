

export default defineNuxtPlugin(async(nuxtApp)=>{  
  nuxtApp.hooks.hook('page:start', () =>{
    
  })
  nuxtApp.hooks.hook('page:finish', () =>{
    console.log('when?')
  })
})