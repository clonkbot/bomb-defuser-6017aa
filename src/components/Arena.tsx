import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Arena() {
  const gridRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group>
      {/* Ground plane with pixelated grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Neon grid lines */}
      <group ref={gridRef}>
        {Array.from({ length: 21 }).map((_, i) => {
          const pos = -10 + i
          return (
            <group key={i}>
              {/* X lines */}
              <mesh position={[pos, 0.02, 0]}>
                <boxGeometry args={[0.02, 0.01, 20]} />
                <meshBasicMaterial
                  color={i === 10 ? '#ff00ff' : '#1a1a3a'}
                  transparent
                  opacity={i === 10 ? 0.8 : 0.5}
                />
              </mesh>
              {/* Z lines */}
              <mesh position={[0, 0.02, pos]}>
                <boxGeometry args={[20, 0.01, 0.02]} />
                <meshBasicMaterial
                  color={i === 10 ? '#00ffff' : '#1a1a3a'}
                  transparent
                  opacity={i === 10 ? 0.8 : 0.5}
                />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Arena boundary walls - pixelated style */}
      {[
        { pos: [0, 0.5, -7] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [14, 1, 0.3] as [number, number, number] },
        { pos: [0, 0.5, 7] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [14, 1, 0.3] as [number, number, number] },
        { pos: [-7, 0.5, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [0.3, 1, 14] as [number, number, number] },
        { pos: [7, 0.5, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [0.3, 1, 14] as [number, number, number] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos} castShadow receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.7}
            metalness={0.3}
            emissive={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Corner pillars */}
      {[
        [-7, 0, -7],
        [7, 0, -7],
        [-7, 0, 7],
        [7, 0, 7],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial
              color="#0a0a15"
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          <pointLight
            position={[0, 2.2, 0]}
            intensity={0.5}
            color={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
            distance={5}
          />
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff00ff' : '#00ffff'} />
          </mesh>
        </group>
      ))}

      {/* Ambient particles - simple cubes floating */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 16
        const y = 2 + Math.random() * 5
        const z = (Math.random() - 0.5) * 16
        const scale = 0.05 + Math.random() * 0.1
        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[scale, scale, scale]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? '#ff00ff' : '#00ffff'}
              transparent
              opacity={0.3 + Math.random() * 0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}
