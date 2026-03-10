import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Game from './components/Game'
import UI from './components/UI'
import { GameProvider } from './context/GameContext'

export default function App() {
  return (
    <GameProvider>
      <div className="w-screen h-screen bg-black relative overflow-hidden">
        {/* Pixel art scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />

        <Canvas
          camera={{ position: [0, 12, 14], fov: 50 }}
          shadows
          gl={{ antialias: false, pixelRatio: 1 }}
        >
          <color attach="background" args={['#0a0a0f']} />
          <fog attach="fog" args={['#0a0a0f', 15, 35]} />
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>

        <UI />

        {/* Footer */}
        <div className="absolute bottom-2 left-0 right-0 text-center z-20">
          <p className="text-[10px] md:text-xs tracking-widest" style={{ color: '#3a3a4a', fontFamily: "'Press Start 2P', monospace" }}>
            Requested by @flambons · Built by @clonkbot
          </p>
        </div>
      </div>
    </GameProvider>
  )
}
