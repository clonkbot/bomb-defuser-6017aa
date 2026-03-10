import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Bomb {
  id: number
  position: [number, number, number]
  timer: number
}

interface GameContextType {
  score: number
  lives: number
  gameState: 'menu' | 'playing' | 'gameover'
  bombs: Bomb[]
  playerPosition: [number, number, number]
  startGame: () => void
  endGame: () => void
  addScore: (points: number) => void
  loseLife: () => void
  setPlayerPosition: (pos: [number, number, number]) => void
  addBomb: (bomb: Bomb) => void
  removeBomb: (id: number) => void
  highScore: number
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [bombs, setBombs] = useState<Bomb[]>([])
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0])
  const [highScore, setHighScore] = useState(0)

  const startGame = useCallback(() => {
    setScore(0)
    setLives(3)
    setBombs([])
    setPlayerPosition([0, 0, 0])
    setGameState('playing')
  }, [])

  const endGame = useCallback(() => {
    setHighScore(prev => Math.max(prev, score))
    setGameState('gameover')
  }, [score])

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setHighScore(s => Math.max(s, score))
        setGameState('gameover')
      }
      return newLives
    })
  }, [score])

  const addBomb = useCallback((bomb: Bomb) => {
    setBombs(prev => [...prev, bomb])
  }, [])

  const removeBomb = useCallback((id: number) => {
    setBombs(prev => prev.filter(b => b.id !== id))
  }, [])

  return (
    <GameContext.Provider
      value={{
        score,
        lives,
        gameState,
        bombs,
        playerPosition,
        startGame,
        endGame,
        addScore,
        loseLife,
        setPlayerPosition,
        addBomb,
        removeBomb,
        highScore,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}
