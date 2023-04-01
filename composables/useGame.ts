import { IGame } from "~~/types"

export default function () {
  const game = useState('game', () => ({
    info: null as IGame
  }))

  const setGame = (info: IGame) => {
    game.value.info = info;
  }

  const resetGame = () => {
    game.value.info = null
  }




  return {
    game,
    setGame,
    resetGame,
  }
}