import { useGame } from '../context/GameContext'
import { useEffect, useState } from 'react'

export default function UI() {
  const { score, lives, gameState, startGame, highScore } = useGame()
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setTimeout(() => setShowControls(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowControls(true)
    }
  }, [gameState])

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* HUD - Score and Lives */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-0 right-0 flex justify-between px-4 md:px-8">
          {/* Score */}
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 px-4 py-2 md:px-6 md:py-3">
            <div className="text-[10px] md:text-xs text-cyan-400 tracking-widest mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              SCORE
            </div>
            <div className="text-lg md:text-2xl text-white font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Lives */}
          <div className="bg-black/60 backdrop-blur-sm border border-pink-500/30 px-4 py-2 md:px-6 md:py-3">
            <div className="text-[10px] md:text-xs text-pink-400 tracking-widest mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              LIVES
            </div>
            <div className="flex gap-1 md:gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 md:w-6 md:h-6 ${
                    i < lives ? 'bg-pink-500' : 'bg-gray-700'
                  }`}
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {gameState === 'playing' && showControls && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-black/70 backdrop-blur-sm border border-white/10 px-4 py-3 text-center">
            <p className="text-[8px] md:text-[10px] text-gray-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              WASD or ARROWS to move
            </p>
            <p className="text-[8px] md:text-[10px] text-cyan-400 mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Touch bombs to defuse!
            </p>
          </div>
        </div>
      )}

      {/* Start Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="text-center px-4">
            {/* Title with glitch effect */}
            <div className="relative mb-8">
              <h1
                className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 animate-pulse"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                BOMB
              </h1>
              <h1
                className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                DEFUSER
              </h1>
            </div>

            {/* Character preview - pixel art style */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-16 h-20 md:w-20 md:h-24 animate-bounce">
                {/* Beanie */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 md:w-16 h-4 bg-amber-700" style={{ imageRendering: 'pixelated' }} />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 md:w-14 h-2 bg-amber-600" style={{ imageRendering: 'pixelated' }} />
                {/* Face */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-12 md:w-14 h-12 md:h-14 bg-amber-200" style={{ imageRendering: 'pixelated' }} />
                {/* Eyes with glasses */}
                <div className="absolute top-7 left-3 md:left-4 w-3 h-2 bg-white rounded-full border border-gray-400" />
                <div className="absolute top-7 right-3 md:right-4 w-3 h-2 bg-white rounded-full border border-gray-400" />
                <div className="absolute top-7 left-4 md:left-5 w-1 h-1 bg-blue-500 rounded-full" />
                <div className="absolute top-7 right-4 md:right-5 w-1 h-1 bg-blue-500 rounded-full" />
                {/* Earpiece */}
                <div className="absolute top-8 -left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                {/* Body */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-4 bg-gray-900" style={{ imageRendering: 'pixelated' }} />
              </div>
            </div>

            {highScore > 0 && (
              <div className="mb-6">
                <p className="text-[10px] md:text-xs text-pink-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  HIGH SCORE: {highScore.toString().padStart(6, '0')}
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="group relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-cyan-600 to-pink-600 text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <span className="relative z-10 text-sm md:text-base">START</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="mt-8 text-[8px] md:text-[10px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Defuse bombs before they explode!
            </p>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/70">
          <div className="text-center px-4">
            <h2
              className="text-2xl md:text-4xl text-red-500 mb-6 animate-pulse"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              GAME OVER
            </h2>

            <div className="mb-6 p-4 bg-black/60 border border-red-500/30">
              <p className="text-[10px] md:text-xs text-gray-400 mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                FINAL SCORE
              </p>
              <p className="text-xl md:text-3xl text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {score.toString().padStart(6, '0')}
              </p>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-xs md:text-sm text-yellow-400 mb-6 animate-bounce" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                NEW HIGH SCORE!
              </p>
            )}

            <button
              onClick={startGame}
              className="px-6 py-3 md:px-10 md:py-4 bg-gradient-to-r from-cyan-600 to-pink-600 text-white transition-all hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <span className="text-xs md:text-sm">PLAY AGAIN</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile touch controls */}
      {gameState === 'playing' && (
        <MobileControls />
      )}
    </div>
  )
}

function MobileControls() {
  const simulateKey = (key: string, down: boolean) => {
    const event = new KeyboardEvent(down ? 'keydown' : 'keyup', {
      key,
      bubbles: true,
    })
    window.dispatchEvent(event)
  }

  const buttonClass = "w-12 h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 active:bg-white/30 flex items-center justify-center pointer-events-auto touch-none select-none"

  return (
    <div className="absolute bottom-24 left-4 md:hidden">
      <div className="flex flex-col items-center gap-1">
        <button
          className={buttonClass}
          onTouchStart={() => simulateKey('w', true)}
          onTouchEnd={() => simulateKey('w', false)}
        >
          <span className="text-white text-lg">^</span>
        </button>
        <div className="flex gap-1">
          <button
            className={buttonClass}
            onTouchStart={() => simulateKey('a', true)}
            onTouchEnd={() => simulateKey('a', false)}
          >
            <span className="text-white text-lg">&lt;</span>
          </button>
          <button
            className={buttonClass}
            onTouchStart={() => simulateKey('s', true)}
            onTouchEnd={() => simulateKey('s', false)}
          >
            <span className="text-white text-lg">v</span>
          </button>
          <button
            className={buttonClass}
            onTouchStart={() => simulateKey('d', true)}
            onTouchEnd={() => simulateKey('d', false)}
          >
            <span className="text-white text-lg">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  )
}
