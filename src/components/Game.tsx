import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'
import Player from './Player'
import Bomb from './Bomb'
import Arena from './Arena'

let bombIdCounter = 0

export default function Game() {
  const { gameState, bombs, addBomb, removeBomb, loseLife, addScore, playerPosition } = useGame()
  const spawnTimerRef = useRef(0)
  const difficultyRef = useRef(1)

  const spawnBomb = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 3
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    addBomb({
      id: bombIdCounter++,
      position: [x, 0.5, z],
      timer: 3 + Math.random() * 2,
    })
  }, [addBomb])

  useFrame((_, delta) => {
    if (gameState !== 'playing') return

    spawnTimerRef.current += delta
    const spawnInterval = Math.max(0.5, 2 - difficultyRef.current * 0.1)

    if (spawnTimerRef.current > spawnInterval) {
      spawnBomb()
      spawnTimerRef.current = 0
      difficultyRef.current += 0.05
    }
  })

  useEffect(() => {
    if (gameState === 'menu') {
      spawnTimerRef.current = 0
      difficultyRef.current = 1
    }
  }, [gameState])

  const handleBombExplode = useCallback(
    (bombId: number, bombPos: [number, number, number]) => {
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - bombPos[0], 2) +
          Math.pow(playerPosition[2] - bombPos[2], 2)
      )

      if (distance < 2) {
        loseLife()
      }

      removeBomb(bombId)
    },
    [playerPosition, loseLife, removeBomb]
  )

  const handleBombDefuse = useCallback(
    (bombId: number) => {
      addScore(100)
      removeBomb(bombId)
    },
    [addScore, removeBomb]
  )

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#6666ff" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        color="#ff88aa"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00ffff" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#ff00ff" />

      {/* Stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />

      {/* Arena */}
      <Arena />

      {/* Player */}
      {gameState === 'playing' && <Player />}

      {/* Bombs */}
      {bombs.map((bomb) => (
        <Bomb
          key={bomb.id}
          {...bomb}
          onExplode={handleBombExplode}
          onDefuse={handleBombDefuse}
        />
      ))}

      {/* Camera Controls - limited when playing */}
      <OrbitControls
        enablePan={false}
        enableZoom={gameState !== 'playing'}
        enableRotate={gameState !== 'playing'}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}
