export default function () {
  const search = useState('search', () => ({
    results: null,
  }))

  const getSearch = async (keyword: string) => {
    const { data, error, pending } = await community.search({
      q: keyword,
    })
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

  return {
    search,
    setResults,
    getSearch,
    resetResults
  }
}
