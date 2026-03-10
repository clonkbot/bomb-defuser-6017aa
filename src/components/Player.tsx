import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

export default function Player() {
  const groupRef = useRef<THREE.Group>(null!)
  const { setPlayerPosition } = useGame()
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  })
  const velocityRef = useRef(new THREE.Vector3())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys || e.key in keys) {
        setKeys((prev) => ({ ...prev, [e.key in prev ? e.key : key]: true }))
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys || e.key in keys) {
        setKeys((prev) => ({ ...prev, [e.key in prev ? e.key : key]: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const speed = 8
    const moveDir = new THREE.Vector3()

    if (keys.w || keys.ArrowUp) moveDir.z -= 1
    if (keys.s || keys.ArrowDown) moveDir.z += 1
    if (keys.a || keys.ArrowLeft) moveDir.x -= 1
    if (keys.d || keys.ArrowRight) moveDir.x += 1

    if (moveDir.length() > 0) {
      moveDir.normalize()
      velocityRef.current.lerp(moveDir.multiplyScalar(speed), 0.2)
    } else {
      velocityRef.current.lerp(new THREE.Vector3(), 0.1)
    }

    groupRef.current.position.x += velocityRef.current.x * delta
    groupRef.current.position.z += velocityRef.current.z * delta

    // Clamp to arena
    const arenaSize = 6
    groupRef.current.position.x = THREE.MathUtils.clamp(
      groupRef.current.position.x,
      -arenaSize,
      arenaSize
    )
    groupRef.current.position.z = THREE.MathUtils.clamp(
      groupRef.current.position.z,
      -arenaSize,
      arenaSize
    )

    // Update context
    setPlayerPosition([
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z,
    ])

    // Face direction of movement
    if (velocityRef.current.length() > 0.1) {
      const angle = Math.atan2(velocityRef.current.x, velocityRef.current.z)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.1
      )
    }

    // Bobbing animation
    const bobSpeed = velocityRef.current.length() > 0.5 ? 12 : 4
    groupRef.current.position.y = 0.3 + Math.sin(Date.now() * 0.01 * bobSpeed) * 0.1
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Big head - skin tone */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Face details - front side */}
        {/* Eyes */}
        <mesh position={[-0.25, 1.3, 0.61]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.25, 1.3, 0.61]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pupils - blue eyes like in the photo */}
        <mesh position={[-0.25, 1.3, 0.62]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#4488cc" />
        </mesh>
        <mesh position={[0.25, 1.3, 0.62]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#4488cc" />
        </mesh>

        {/* Round glasses frame */}
        <mesh position={[-0.25, 1.3, 0.63]}>
          <torusGeometry args={[0.15, 0.02, 8, 12]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.25, 1.3, 0.63]}>
          <torusGeometry args={[0.15, 0.02, 8, 12]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glasses bridge */}
        <mesh position={[0, 1.3, 0.63]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>
        {/* Glasses arms */}
        <mesh position={[-0.55, 1.3, 0.3]} castShadow>
          <boxGeometry args={[0.02, 0.02, 0.7]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>
        <mesh position={[0.55, 1.3, 0.3]} castShadow>
          <boxGeometry args={[0.02, 0.02, 0.7]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, 0.95, 0.61]} castShadow>
          <boxGeometry args={[0.25, 0.05, 0.02]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>

        {/* Earpiece with red light */}
        <mesh position={[-0.62, 1.15, 0]} castShadow>
          <boxGeometry args={[0.08, 0.15, 0.08]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[-0.65, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[-0.65, 1.05, 0]} intensity={0.5} color="#ff0000" distance={1} />

        {/* Pixel beanie hat (brown/tan like in photo) */}
        <mesh position={[0, 1.95, 0]} castShadow>
          <boxGeometry args={[1.3, 0.35, 1.3]} />
          <meshStandardMaterial color="#8B6914" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.15, 0]} castShadow>
          <boxGeometry args={[1.1, 0.15, 1.1]} />
          <meshStandardMaterial color="#A67C00" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.7]} />
          <meshStandardMaterial color="#8B6914" roughness={0.9} />
        </mesh>

        {/* Hair peeking out from beanie */}
        <mesh position={[0.4, 1.7, 0.4]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial color="#4a3520" roughness={0.9} />
        </mesh>
        <mesh position={[-0.4, 1.7, 0.4]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial color="#4a3520" roughness={0.9} />
        </mesh>

        {/* Tiny pixel body (black shirt/jacket) */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>

        {/* Tiny legs */}
        <mesh position={[-0.12, -0.05, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, -0.05, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.8} />
        </mesh>

        {/* Tiny arms */}
        <mesh position={[-0.35, 0.35, 0]} castShadow>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        <mesh position={[0.35, 0.35, 0]} castShadow>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>

        {/* Hand with ring */}
        <mesh position={[0.35, 0.1, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        <mesh position={[0.35, 0.08, 0.1]}>
          <torusGeometry args={[0.04, 0.015, 6, 8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Glasses glow effect */}
        <pointLight position={[0, 1.3, 0.8]} intensity={0.3} color="#00ffff" distance={2} />
      </Float>
    </group>
  )
}
