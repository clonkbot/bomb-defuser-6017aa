import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface BombProps {
  id: number
  position: [number, number, number]
  timer: number
  onExplode: (id: number, pos: [number, number, number]) => void
  onDefuse: (id: number) => void
}

export default function Bomb({ id, position, timer, onExplode, onDefuse }: BombProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [timeLeft, setTimeLeft] = useState(timer)
  const [isExploding, setIsExploding] = useState(false)
  const [isDefused, setIsDefused] = useState(false)
  const { playerPosition, gameState } = useGame()

  useFrame((_, delta) => {
    if (gameState !== 'playing' || isDefused) return

    if (!isExploding) {
      setTimeLeft((prev) => {
        const newTime = prev - delta
        if (newTime <= 0) {
          setIsExploding(true)
          return 0
        }
        return newTime
      })

      // Pulse effect based on timer
      if (meshRef.current) {
        const pulse = 1 + Math.sin(Date.now() * 0.02 * (5 - timeLeft + 1)) * 0.1
        meshRef.current.scale.setScalar(pulse)
      }

      // Check if player is close enough to defuse
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - position[0], 2) +
          Math.pow(playerPosition[2] - position[2], 2)
      )

      if (distance < 1.2) {
        setIsDefused(true)
        onDefuse(id)
      }
    }
  })

  useEffect(() => {
    if (isExploding) {
      const timeout = setTimeout(() => {
        onExplode(id, position)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isExploding, id, position, onExplode])

  if (isDefused) return null

  const urgency = Math.max(0, 1 - timeLeft / timer)
  const bombColor = new THREE.Color().lerpColors(
    new THREE.Color('#333333'),
    new THREE.Color('#ff0000'),
    urgency
  )

  return (
    <group position={position}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Bomb body - pixel style */}
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial
            color={isExploding ? '#ff4400' : bombColor}
            roughness={0.3}
            metalness={0.7}
            emissive={isExploding ? '#ff4400' : bombColor}
            emissiveIntensity={isExploding ? 3 : urgency * 0.5}
          />
        </mesh>

        {/* Fuse */}
        {!isExploding && (
          <>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
              <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>
            {/* Spark */}
            <pointLight
              position={[0, 0.7, 0]}
              intensity={1 + Math.sin(Date.now() * 0.05) * 0.5}
              color="#ffaa00"
              distance={2}
            />
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshBasicMaterial color="#ffff00" />
            </mesh>
          </>
        )}

        {/* Explosion effect */}
        {isExploding && (
          <>
            <mesh scale={[3, 3, 3]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
            </mesh>
            <pointLight intensity={10} color="#ff4400" distance={8} />
          </>
        )}

        {/* Timer display */}
        {!isExploding && (
          <Text
            position={[0, 1, 0]}
            fontSize={0.3}
            color={urgency > 0.7 ? '#ff0000' : '#00ff00'}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nYivN04w.woff2"
          >
            {Math.ceil(timeLeft)}
          </Text>
        )}
      </Float>

      {/* Ground warning circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.5, 2, 16]} />
        <meshBasicMaterial
          color={urgency > 0.7 ? '#ff0000' : '#ff6600'}
          transparent
          opacity={0.2 + urgency * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
