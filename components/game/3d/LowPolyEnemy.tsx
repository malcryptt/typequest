'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Enemy } from '@/lib/game/types';

interface LowPolyEnemyProps {
  enemy: Enemy;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isAttacking?: boolean;
  isHurt?: boolean;
  healthPercent?: number;
}

// Determine enemy type from ID for visual variations
type EnemyType = 'sprite' | 'beast' | 'humanoid' | 'elemental' | 'undead' | 'dragon' | 'boss';

function getEnemyType(enemyId: string): EnemyType {
  if (enemyId.includes('sprite')) return 'sprite';
  if (enemyId.includes('boar') || enemyId.includes('wolf') || enemyId.includes('yeti') || enemyId.includes('frog')) return 'beast';
  if (enemyId.includes('goblin') || enemyId.includes('witch') || enemyId.includes('cultist')) return 'humanoid';
  if (enemyId.includes('elemental') || enemyId.includes('golem')) return 'elemental';
  if (enemyId.includes('skeleton') || enemyId.includes('phantom') || enemyId.includes('lich')) return 'undead';
  if (enemyId.includes('dragon') || enemyId.includes('drake') || enemyId.includes('wyrm') || enemyId.includes('hydra')) return 'dragon';
  if (enemyId.includes('treant') || enemyId.includes('demon')) return 'boss';
  return 'humanoid';
}

export function LowPolyEnemy({
  enemy,
  position = [0, 0, 0],
  rotation = [0, Math.PI, 0],
  scale = 1,
  isAttacking = false,
  isHurt = false,
  healthPercent = 100,
}: LowPolyEnemyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const enemyType = getEnemyType(enemy.id);
  
  // Animation state
  const animState = useRef({ time: 0, attackTime: 0, hurtTime: 0 });
  
  // Hurt flash color
  const baseColor = useMemo(() => new THREE.Color(enemy.color), [enemy.color]);
  const hurtColor = useMemo(() => new THREE.Color('#ffffff'), []);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    animState.current.time += delta;
    
    // Idle floating/movement animation
    const floatOffset = enemyType === 'sprite' || enemyType === 'elemental' 
      ? Math.sin(animState.current.time * 3) * 0.05 
      : Math.sin(animState.current.time * 2) * 0.02;
    groupRef.current.position.y = position[1] + floatOffset;
    
    // Slight rotation for menacing effect
    groupRef.current.rotation.y = rotation[1] + Math.sin(animState.current.time * 1.5) * 0.05;
    
    // Attack lunge
    if (isAttacking) {
      animState.current.attackTime += delta * 10;
      const attackProgress = Math.min(animState.current.attackTime, Math.PI);
      groupRef.current.position.z = position[2] - Math.sin(attackProgress) * 0.3;
      
      if (animState.current.attackTime > Math.PI) {
        animState.current.attackTime = 0;
      }
    } else {
      groupRef.current.position.z = position[2];
    }
    
    // Hurt shake
    if (isHurt) {
      animState.current.hurtTime += delta * 25;
      groupRef.current.position.x = position[0] + Math.sin(animState.current.hurtTime) * 0.08;
    } else {
      animState.current.hurtTime = 0;
      groupRef.current.position.x = position[0];
    }
  });
  
  // Boss scale modifier
  const finalScale = enemy.isBoss ? scale * 1.5 : scale;
  
  // Material with hurt flash
  const currentColor = isHurt ? hurtColor : baseColor;
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={finalScale}>
      {/* Render different enemy types */}
      {enemyType === 'sprite' && (
        <>
          {/* Ethereal body */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial 
              color={currentColor} 
              emissive={enemy.color} 
              emissiveIntensity={0.3} 
              transparent 
              opacity={0.8}
              flatShading 
            />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.08, 0.45, 0.18]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.08, 0.45, 0.18]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
          {/* Wispy trail */}
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.15, 0.4, 6]} />
            <meshStandardMaterial 
              color={currentColor} 
              transparent 
              opacity={0.5}
              flatShading 
            />
          </mesh>
        </>
      )}
      
      {enemyType === 'beast' && (
        <>
          {/* Body */}
          <mesh position={[0, 0.35, 0]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.4, 0.35, 0.6]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.45, 0.35]}>
            <boxGeometry args={[0.3, 0.25, 0.3]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Snout */}
          <mesh position={[0, 0.4, 0.55]}>
            <boxGeometry args={[0.15, 0.12, 0.15]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.1, 0.5, 0.48]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.1, 0.5, 0.48]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
          {/* Legs */}
          {[[-0.15, -0.2], [0.15, -0.2], [-0.15, 0.15], [0.15, 0.15]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.12, z]}>
              <boxGeometry args={[0.1, 0.25, 0.1]} />
              <meshStandardMaterial color={currentColor} flatShading />
            </mesh>
          ))}
          {/* Tusks/horns for boss variants */}
          {enemy.isBoss && (
            <>
              <mesh position={[-0.12, 0.5, 0.6]} rotation={[0.5, 0.3, 0]}>
                <coneGeometry args={[0.03, 0.2, 4]} />
                <meshStandardMaterial color="#eeeeee" flatShading />
              </mesh>
              <mesh position={[0.12, 0.5, 0.6]} rotation={[0.5, -0.3, 0]}>
                <coneGeometry args={[0.03, 0.2, 4]} />
                <meshStandardMaterial color="#eeeeee" flatShading />
              </mesh>
            </>
          )}
        </>
      )}
      
      {enemyType === 'humanoid' && (
        <>
          {/* Body */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.35, 0.45, 0.22]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.25, 0.25, 0.22]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#8fbc8f'} flatShading />
          </mesh>
          {/* Evil eyes */}
          <mesh position={[-0.06, 0.92, 0.1]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ffff00" emissive="#ff8800" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.06, 0.92, 0.1]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ffff00" emissive="#ff8800" emissiveIntensity={0.5} />
          </mesh>
          {/* Pointy ears (goblins) */}
          <mesh position={[-0.15, 0.95, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#8fbc8f'} flatShading />
          </mesh>
          <mesh position={[0.15, 0.95, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#8fbc8f'} flatShading />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.25, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.35, 0.1]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          <mesh position={[0.25, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.35, 0.1]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Weapon */}
          <mesh position={[0.3, 0.6, 0.1]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.04, 0.35, 0.03]} />
            <meshStandardMaterial color="#666666" flatShading />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.1, 0.15, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          <mesh position={[0.1, 0.15, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
        </>
      )}
      
      {enemyType === 'elemental' && (
        <>
          {/* Core body - floating rocks/ice */}
          <mesh position={[0, 0.6, 0]}>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial 
              color={currentColor} 
              emissive={enemy.color}
              emissiveIntensity={0.2}
              flatShading 
            />
          </mesh>
          {/* Floating chunks */}
          {[[0.3, 0.8, 0.1], [-0.25, 0.4, 0.15], [0.2, 0.3, -0.2], [-0.15, 0.9, -0.1]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <dodecahedronGeometry args={[0.1 + Math.random() * 0.05, 0]} />
              <meshStandardMaterial 
                color={currentColor}
                emissive={enemy.color}
                emissiveIntensity={0.3}
                flatShading 
              />
            </mesh>
          ))}
          {/* Glowing eyes */}
          <mesh position={[-0.1, 0.65, 0.28]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.1, 0.65, 0.28]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={1} />
          </mesh>
        </>
      )}
      
      {enemyType === 'undead' && (
        <>
          {/* Skeletal body */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.15]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#d4c9b0'} flatShading />
          </mesh>
          {/* Ribcage details */}
          {[-0.08, 0, 0.08].map((y, i) => (
            <mesh key={i} position={[0, 0.5 + y, 0.08]}>
              <boxGeometry args={[0.28, 0.04, 0.02]} />
              <meshStandardMaterial color={isHurt ? '#ffffff' : '#c4b9a0'} flatShading />
            </mesh>
          ))}
          {/* Skull */}
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#e8e0d0'} flatShading />
          </mesh>
          {/* Eye sockets with glow */}
          <mesh position={[-0.05, 0.97, 0.12]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.05, 0.97, 0.12]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Soul fire in eyes */}
          <mesh position={[-0.05, 0.97, 0.13]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.05, 0.97, 0.13]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.22, 0.55, 0]}>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#d4c9b0'} flatShading />
          </mesh>
          <mesh position={[0.22, 0.55, 0]}>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#d4c9b0'} flatShading />
          </mesh>
          {/* Ghostly robe for lich */}
          {enemy.isBoss && (
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.35, 0.6, 6]} />
              <meshStandardMaterial 
                color={currentColor} 
                transparent 
                opacity={0.7}
                flatShading 
              />
            </mesh>
          )}
          {/* Legs */}
          <mesh position={[-0.08, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.06]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#d4c9b0'} flatShading />
          </mesh>
          <mesh position={[0.08, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.3, 0.06]} />
            <meshStandardMaterial color={isHurt ? '#ffffff' : '#d4c9b0'} flatShading />
          </mesh>
        </>
      )}
      
      {enemyType === 'dragon' && (
        <>
          {/* Body */}
          <mesh position={[0, 0.5, 0]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.5, 0.4, 0.8]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 0.6, 0.45]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.2, 0.25, 0.35]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.75, 0.7]}>
            <boxGeometry args={[0.25, 0.2, 0.35]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Snout */}
          <mesh position={[0, 0.72, 0.95]}>
            <boxGeometry args={[0.15, 0.12, 0.2]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Fiery eyes */}
          <mesh position={[-0.08, 0.8, 0.82]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.08, 0.8, 0.82]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={1} />
          </mesh>
          {/* Horns */}
          <mesh position={[-0.1, 0.9, 0.65]} rotation={[-0.5, -0.3, 0]}>
            <coneGeometry args={[0.04, 0.2, 4]} />
            <meshStandardMaterial color="#333333" flatShading />
          </mesh>
          <mesh position={[0.1, 0.9, 0.65]} rotation={[-0.5, 0.3, 0]}>
            <coneGeometry args={[0.04, 0.2, 4]} />
            <meshStandardMaterial color="#333333" flatShading />
          </mesh>
          {/* Wings */}
          <mesh position={[-0.4, 0.7, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.5, 0.02, 0.4]} />
            <meshStandardMaterial color={currentColor} transparent opacity={0.8} flatShading />
          </mesh>
          <mesh position={[0.4, 0.7, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.5, 0.02, 0.4]} />
            <meshStandardMaterial color={currentColor} transparent opacity={0.8} flatShading />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0.4, -0.5]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.4]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          <mesh position={[0, 0.35, -0.8]} rotation={[0.5, 0, 0]}>
            <coneGeometry args={[0.08, 0.25, 4]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Legs */}
          {[[-0.2, -0.25], [0.2, -0.25], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.15, z]}>
              <boxGeometry args={[0.12, 0.3, 0.12]} />
              <meshStandardMaterial color={currentColor} flatShading />
            </mesh>
          ))}
        </>
      )}
      
      {enemyType === 'boss' && (
        <>
          {/* Massive body */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.6, 0.7, 0.4]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.25, 0]}>
            <boxGeometry args={[0.4, 0.35, 0.35]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Glowing eyes */}
          <mesh position={[-0.1, 1.3, 0.16]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.1, 1.3, 0.16]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
          </mesh>
          {/* Horns/crown */}
          {[-0.15, 0, 0.15].map((x, i) => (
            <mesh key={i} position={[x, 1.5, 0]} rotation={[0.2, 0, x * 0.5]}>
              <coneGeometry args={[0.04, 0.25, 4]} />
              <meshStandardMaterial color="#4a0000" flatShading />
            </mesh>
          ))}
          {/* Massive arms */}
          <mesh position={[-0.45, 0.65, 0]}>
            <boxGeometry args={[0.2, 0.5, 0.2]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          <mesh position={[0.45, 0.65, 0]}>
            <boxGeometry args={[0.2, 0.5, 0.2]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.15, 0.2, 0]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
          <mesh position={[0.15, 0.2, 0]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color={currentColor} flatShading />
          </mesh>
        </>
      )}
      
      {/* Health indicator glow - more intense when low health */}
      {healthPercent < 30 && (
        <pointLight 
          position={[0, 0.5, 0]} 
          color="#ff0000" 
          intensity={0.5 + (1 - healthPercent / 100) * 0.5} 
          distance={1} 
        />
      )}
    </group>
  );
}
