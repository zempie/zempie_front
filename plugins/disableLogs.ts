//nuxt production mode 주석 제거

export default defineNuxtPlugin(() => {

  function disableLogs() {
    console.log = () => { };
  }

  console.log('process.env', process.env.NODE_ENV)

  // process.env.NODE_ENV === "production" ? disableLogs() : null;
})
