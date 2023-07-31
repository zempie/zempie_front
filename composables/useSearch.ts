export default function () {
  const search = useState('search', () => ({
    results: null,
  }))

  const getSearch = async (keyword: string) => {
    if (!keyword) {
      resetResults()
      return
    }
    const { data, error, pending } = await useCustomAsyncFetch(`/search?q=${keyword}`, getComFetchOptions('get', false))
    if (data.value) {
      console.log(keyword, data.value)
      setResults(data.value)
    }
  }

  const setResults = (results: {
    community: [],
    games: [],
    posts: [],
    users: []
  }) => {
    search.value.results = results
  }

  const resetResults = () => {
    search.value.results = null
  }
  const updateResult = (feed, img) => {

    search.value.results.posts = search.value.results.posts
      .map((feed1) => {
        if (feed1.id === feed.id) {
          return {
            ...feed1,
            attatchment_files: feed1.attatchment_files
              .map((file) => {
                if (file.url === img.url) {
                  return {
                    ...file,
                    is_blind: !file.is_blind
                  }
                }
                return file
              })
          }
        }
        return feed1
      })
  }

  return {
    search,
    setResults,
    getSearch,
    resetResults,
    updateResult

  }
}
