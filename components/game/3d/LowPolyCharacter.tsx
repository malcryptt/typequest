'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CharacterClass } from '@/lib/game/types';

interface LowPolyCharacterProps {
  characterClass: CharacterClass;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isAttacking?: boolean;
  isHurt?: boolean;
  isIdle?: boolean;
}

// Color palettes for each character
const CHARACTER_COLORS: Record<CharacterClass, { primary: string; secondary: string; accent: string; skin: string }> = {
  knight: {
    primary: '#6d5d4d',    // Armor
    secondary: '#8b7355',  // Leather
    accent: '#c4a35a',     // Gold trim
    skin: '#e8c4a0',
  },
  mage: {
    primary: '#4a3875',    // Robes
    secondary: '#6b5b95',  // Inner robe
    accent: '#9d8dff',     // Magic glow
    skin: '#f0d5c0',
  },
  rogue: {
    primary: '#2d2d2d',    // Dark leather
    secondary: '#454545',  // Hood
    accent: '#50c878',     // Poison green
    skin: '#d4b896',
  },
  ranger: {
    primary: '#3d5c3d',    // Forest green
    secondary: '#5a7a5a',  // Light green
    accent: '#8fbc8f',     // Leaf accent
    skin: '#dfc4a8',
  },
};

export function LowPolyCharacter({
  characterClass,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isAttacking = false,
  isHurt = false,
  isIdle = true,
}: LowPolyCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const colors = CHARACTER_COLORS[characterClass];
  
  // Animation state
  const animState = useRef({ time: 0, attackTime: 0, hurtTime: 0 });
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    animState.current.time += delta;
    
    // Idle breathing animation
    if (isIdle && !isAttacking && !isHurt) {
      groupRef.current.position.y = position[1] + Math.sin(animState.current.time * 2) * 0.02;
    }
    
    // Attack animation
    if (isAttacking) {
      animState.current.attackTime += delta * 8;
      const attackProgress = Math.min(animState.current.attackTime, Math.PI);
      groupRef.current.rotation.x = Math.sin(attackProgress) * 0.3;
      
      if (animState.current.attackTime > Math.PI) {
        animState.current.attackTime = 0;
      }
    } else {
      groupRef.current.rotation.x = 0;
    }
    
    // Hurt shake
    if (isHurt) {
      animState.current.hurtTime += delta * 20;
      groupRef.current.position.x = position[0] + Math.sin(animState.current.hurtTime) * 0.05;
    } else {
      animState.current.hurtTime = 0;
      if (!isAttacking) {
        groupRef.current.position.x = position[0];
      }
    }
  });
  
  // Create character geometry based on class
  const characterGeometry = useMemo(() => {
    return characterClass;
  }, [characterClass]);
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshStandardMaterial color={colors.primary} flatShading />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.28, 0.3, 0.26]} />
        <meshStandardMaterial color={colors.skin} flatShading />
      </mesh>
      
      {/* Character-specific features */}
      {characterGeometry === 'knight' && (
        <>
          {/* Helmet */}
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.32, 0.2, 0.3]} />
            <meshStandardMaterial color={colors.primary} flatShading />
          </mesh>
          {/* Helmet visor */}
          <mesh position={[0, 1.05, 0.14]}>
            <boxGeometry args={[0.2, 0.08, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" flatShading />
          </mesh>
          {/* Shield (left arm) */}
          <mesh position={[-0.35, 0.55, 0.05]}>
            <boxGeometry args={[0.08, 0.4, 0.3]} />
            <meshStandardMaterial color={colors.accent} flatShading />
          </mesh>
          {/* Sword (right arm) */}
          <mesh position={[0.35, 0.7, 0]}>
            <boxGeometry args={[0.06, 0.6, 0.04]} />
            <meshStandardMaterial color="#c0c0c0" flatShading />
          </mesh>
          {/* Sword handle */}
          <mesh position={[0.35, 0.35, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.08]} />
            <meshStandardMaterial color={colors.secondary} flatShading />
          </mesh>
        </>
      )}
      
      {characterGeometry === 'mage' && (
        <>
          {/* Hood */}
          <mesh position={[0, 1.2, -0.02]}>
            <coneGeometry args={[0.2, 0.35, 4]} />
            <meshStandardMaterial color={colors.primary} flatShading />
          </mesh>
          {/* Staff */}
          <mesh position={[0.3, 0.6, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#5c4033" flatShading />
          </mesh>
          {/* Staff orb */}
          <mesh position={[0.3, 1.25, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.5} flatShading />
          </mesh>
          {/* Robe bottom */}
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.25, 0.4, 6]} />
            <meshStandardMaterial color={colors.primary} flatShading />
          </mesh>
        </>
      )}
      
      {characterGeometry === 'rogue' && (
        <>
          {/* Hood */}
          <mesh position={[0, 1.15, -0.05]}>
            <boxGeometry args={[0.32, 0.2, 0.32]} />
            <meshStandardMaterial color={colors.secondary} flatShading />
          </mesh>
          {/* Mask */}
          <mesh position={[0, 0.98, 0.1]}>
            <boxGeometry args={[0.26, 0.1, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" flatShading />
          </mesh>
          {/* Twin daggers */}
          <mesh position={[-0.28, 0.5, 0.1]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color="#a0a0a0" flatShading />
          </mesh>
          <mesh position={[0.28, 0.5, 0.1]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color="#a0a0a0" flatShading />
          </mesh>
          {/* Cape */}
          <mesh position={[0, 0.5, -0.15]}>
            <boxGeometry args={[0.35, 0.6, 0.05]} />
            <meshStandardMaterial color={colors.primary} flatShading />
          </mesh>
        </>
      )}
      
      {characterGeometry === 'ranger' && (
        <>
          {/* Hood/hat */}
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.18, 0.25, 6]} />
            <meshStandardMaterial color={colors.secondary} flatShading />
          </mesh>
          {/* Bow */}
          <mesh position={[-0.35, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.25, 0.02, 4, 12, Math.PI]} />
            <meshStandardMaterial color="#5c4033" flatShading />
          </mesh>
          {/* Quiver */}
          <mesh position={[0.2, 0.6, -0.15]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
            <meshStandardMaterial color={colors.secondary} flatShading />
          </mesh>
          {/* Arrows in quiver */}
          {[0, 0.03, -0.03].map((offset, i) => (
            <mesh key={i} position={[0.2 + offset, 0.85, -0.15]}>
              <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
              <meshStandardMaterial color="#c4a35a" flatShading />
            </mesh>
          ))}
          {/* Cape */}
          <mesh position={[0, 0.45, -0.14]}>
            <boxGeometry args={[0.38, 0.5, 0.04]} />
            <meshStandardMaterial color={colors.primary} flatShading />
          </mesh>
        </>
      )}
      
      {/* Arms */}
      <mesh position={[-0.28, 0.6, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshStandardMaterial color={characterClass === 'knight' ? colors.primary : colors.secondary} flatShading />
      </mesh>
      <mesh position={[0.28, 0.6, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshStandardMaterial color={characterClass === 'knight' ? colors.primary : colors.secondary} flatShading />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.18, 0]}>
        <boxGeometry args={[0.14, 0.35, 0.14]} />
        <meshStandardMaterial color={colors.secondary} flatShading />
      </mesh>
      <mesh position={[0.1, 0.18, 0]}>
        <boxGeometry args={[0.14, 0.35, 0.14]} />
        <meshStandardMaterial color={colors.secondary} flatShading />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.1, 0, 0.03]}>
        <boxGeometry args={[0.12, 0.06, 0.18]} />
        <meshStandardMaterial color={colors.primary} flatShading />
      </mesh>
      <mesh position={[0.1, 0, 0.03]}>
        <boxGeometry args={[0.12, 0.06, 0.18]} />
        <meshStandardMaterial color={colors.primary} flatShading />
      </mesh>
    </group>
  );
}
