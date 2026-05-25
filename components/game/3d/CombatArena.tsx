'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type EnvironmentType = 'forest' | 'mountains' | 'swamp' | 'castle' | 'volcano';

interface CombatArenaProps {
  environment: EnvironmentType;
}

// Environment color palettes
const ENV_COLORS: Record<EnvironmentType, { 
  ground: string; 
  groundAccent: string;
  fog: string; 
  ambient: string;
  sky: string;
}> = {
  forest: {
    ground: '#3d6b3d',
    groundAccent: '#2d4d2d',
    fog: '#1a3d1a',
    ambient: '#4a7a4a',
    sky: '#87ceeb',
  },
  mountains: {
    ground: '#8090a0',
    groundAccent: '#606878',
    fog: '#c0d8e8',
    ambient: '#a0b8d0',
    sky: '#b8d4e8',
  },
  swamp: {
    ground: '#4a5d4a',
    groundAccent: '#384838',
    fog: '#3a4a3a',
    ambient: '#5a6a5a',
    sky: '#607860',
  },
  castle: {
    ground: '#404048',
    groundAccent: '#303038',
    fog: '#202028',
    ambient: '#484858',
    sky: '#282838',
  },
  volcano: {
    ground: '#4a3028',
    groundAccent: '#3a2018',
    fog: '#301810',
    ambient: '#5a3828',
    sky: '#482818',
  },
};

function ForestEnvironment() {
  const treesRef = useRef<THREE.Group>(null);
  
  // Generate tree positions
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 4 + Math.random() * 3;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius - 2,
      ]);
    }
    return positions;
  }, []);
  
  useFrame((_, delta) => {
    if (treesRef.current) {
      treesRef.current.children.forEach((tree, i) => {
        tree.rotation.z = Math.sin(Date.now() * 0.001 + i) * 0.02;
      });
    }
  });
  
  return (
    <group ref={treesRef}>
      {treePositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tree trunk */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1, 6]} />
            <meshStandardMaterial color="#5c4033" flatShading />
          </mesh>
          {/* Tree foliage */}
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.5 + Math.random() * 0.3, 1.2, 6]} />
            <meshStandardMaterial color="#2d5a2d" flatShading />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.4 + Math.random() * 0.2, 0.9, 6]} />
            <meshStandardMaterial color="#3d6d3d" flatShading />
          </mesh>
        </group>
      ))}
      {/* Grass patches */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 3;
        return (
          <mesh 
            key={`grass-${i}`} 
            position={[Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <boxGeometry args={[0.1, 0.15, 0.02]} />
            <meshStandardMaterial color="#4a8a4a" flatShading />
          </mesh>
        );
      })}
      {/* Rocks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5 + Math.random() * 2;
        return (
          <mesh 
            key={`rock-${i}`} 
            position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]}
          >
            <dodecahedronGeometry args={[0.15 + Math.random() * 0.1, 0]} />
            <meshStandardMaterial color="#6a6a6a" flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

function MountainEnvironment() {
  const snowParticlesRef = useRef<THREE.Points>(null);
  
  // Generate mountain peaks
  const peaks = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 5 + Math.random() * 2;
      positions.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 3],
        scale: 0.8 + Math.random() * 0.8,
      });
    }
    return positions;
  }, []);
  
  // Snow particles
  const snowGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  
  useFrame((_, delta) => {
    if (snowParticlesRef.current) {
      const positions = snowParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= delta * 0.5;
        if (positions[i + 1] < 0) {
          positions[i + 1] = 5;
        }
      }
      snowParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      {peaks.map((peak, i) => (
        <group key={i} position={peak.pos} scale={peak.scale}>
          {/* Mountain base */}
          <mesh position={[0, 1, 0]}>
            <coneGeometry args={[1.5, 3, 6]} />
            <meshStandardMaterial color="#707888" flatShading />
          </mesh>
          {/* Snow cap */}
          <mesh position={[0, 2.2, 0]}>
            <coneGeometry args={[0.6, 0.8, 6]} />
            <meshStandardMaterial color="#f0f8ff" flatShading />
          </mesh>
        </group>
      ))}
      {/* Ice crystals */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 2.5;
        return (
          <mesh 
            key={`ice-${i}`}
            position={[Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius]}
            rotation={[0, Math.random() * Math.PI, Math.random() * 0.3]}
          >
            <octahedronGeometry args={[0.2 + Math.random() * 0.15, 0]} />
            <meshStandardMaterial 
              color="#a8d8e8" 
              transparent 
              opacity={0.8}
              flatShading 
            />
          </mesh>
        );
      })}
      {/* Snow particles */}
      <points ref={snowParticlesRef} geometry={snowGeometry}>
        <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.6} />
      </points>
    </group>
  );
}

function SwampEnvironment() {
  const fogRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (fogRef.current) {
      fogRef.current.children.forEach((fog, i) => {
        fog.position.x += Math.sin(Date.now() * 0.0005 + i) * delta * 0.1;
        fog.position.z += Math.cos(Date.now() * 0.0003 + i) * delta * 0.1;
      });
    }
  });
  
  return (
    <group>
      {/* Dead trees */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        return (
          <group key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 2]}>
            <mesh position={[0, 0.6, 0]} rotation={[Math.random() * 0.2, 0, Math.random() * 0.2]}>
              <cylinderGeometry args={[0.08, 0.12, 1.2, 5]} />
              <meshStandardMaterial color="#3d3525" flatShading />
            </mesh>
            {/* Bare branches */}
            <mesh position={[0.15, 1, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.02, 0.03, 0.4, 4]} />
              <meshStandardMaterial color="#3d3525" flatShading />
            </mesh>
            <mesh position={[-0.1, 0.9, 0.1]} rotation={[0.3, 0, -0.4]}>
              <cylinderGeometry args={[0.02, 0.03, 0.35, 4]} />
              <meshStandardMaterial color="#3d3525" flatShading />
            </mesh>
          </group>
        );
      })}
      {/* Murky water pools */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 2;
        return (
          <mesh 
            key={`pool-${i}`}
            position={[Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.3 + Math.random() * 0.3, 6]} />
            <meshStandardMaterial 
              color="#2a3a2a" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        );
      })}
      {/* Mushrooms */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 3;
        const mushroomColor = ['#8b4513', '#9acd32', '#6b8e23'][Math.floor(Math.random() * 3)];
        return (
          <group key={`mushroom-${i}`} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.1, 4]} />
              <meshStandardMaterial color="#d4c4a0" flatShading />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.06, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={mushroomColor} flatShading />
            </mesh>
          </group>
        );
      })}
      {/* Fog layers */}
      <group ref={fogRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={`fog-${i}`}
            position={[(Math.random() - 0.5) * 6, 0.3 + Math.random() * 0.3, (Math.random() - 0.5) * 6]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial 
              color="#5a6a5a" 
              transparent 
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CastleEnvironment() {
  return (
    <group>
      {/* Stone pillars */}
      {[[-3, -4], [3, -4], [-3, 3], [3, 3]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.5, 3, 0.5]} />
            <meshStandardMaterial color="#484858" flatShading />
          </mesh>
          {/* Pillar top */}
          <mesh position={[0, 3.1, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.6]} />
            <meshStandardMaterial color="#585868" flatShading />
          </mesh>
          {/* Torch */}
          <mesh position={[0.3, 2, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.2, 4]} />
            <meshStandardMaterial color="#5c4033" flatShading />
          </mesh>
          <pointLight position={[0.3, 2.2, 0]} color="#ff6600" intensity={0.5} distance={3} />
        </group>
      ))}
      {/* Stone floor tiles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i % 5) * 1.2 - 2.4;
        const z = Math.floor(i / 5) * 1.2 - 2.4;
        return (
          <mesh key={`tile-${i}`} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.1, 1.1]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#3a3a42' : '#424250'} 
              flatShading 
            />
          </mesh>
        );
      })}
      {/* Chains */}
      {[[-2.5, 0, -3], [2.5, 0, -3]].map((pos, i) => (
        <group key={`chain-${i}`} position={pos as [number, number, number]}>
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} position={[0, 2.5 - j * 0.3, 0]} rotation={[j % 2 === 0 ? 0 : Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.02, 4, 6]} />
              <meshStandardMaterial color="#4a4a5a" flatShading />
            </mesh>
          ))}
        </group>
      ))}
      {/* Skulls decoration */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI - Math.PI / 2;
        const radius = 2.5;
        return (
          <mesh 
            key={`skull-${i}`}
            position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius - 1]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color="#d4c9b0" flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

function VolcanoEnvironment() {
  const lavaRef = useRef<THREE.Mesh>(null);
  const emberRef = useRef<THREE.Points>(null);
  
  // Ember particles
  const emberGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  
  useFrame((state, delta) => {
    // Lava glow pulse
    if (lavaRef.current) {
      const material = lavaRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    // Rising embers
    if (emberRef.current) {
      const positions = emberRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * (0.5 + Math.random() * 0.5);
        positions[i] += Math.sin(Date.now() * 0.001 + i) * delta * 0.1;
        if (positions[i + 1] > 4) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 8;
          positions[i + 2] = (Math.random() - 0.5) * 8;
        }
      }
      emberRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      {/* Volcanic rocks */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 3 + Math.random() * 3;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius - 2]}
            rotation={[Math.random() * 0.5, Math.random() * Math.PI, 0]}
          >
            <dodecahedronGeometry args={[0.3 + Math.random() * 0.4, 0]} />
            <meshStandardMaterial color="#3a2820" flatShading />
          </mesh>
        );
      })}
      {/* Lava pools */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const radius = 2 + Math.random();
        return (
          <mesh 
            key={`lava-${i}`}
            ref={i === 0 ? lavaRef : undefined}
            position={[Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.4 + Math.random() * 0.3, 8]} />
            <meshStandardMaterial 
              color="#ff4400"
              emissive="#ff2200"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
      {/* Obsidian spikes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4 + Math.random();
        return (
          <mesh 
            key={`spike-${i}`}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 2]}
            rotation={[Math.random() * 0.2, 0, Math.random() * 0.2]}
          >
            <coneGeometry args={[0.2, 1 + Math.random() * 0.5, 5]} />
            <meshStandardMaterial color="#1a1015" flatShading />
          </mesh>
        );
      })}
      {/* Ember particles */}
      <points ref={emberRef} geometry={emberGeometry}>
        <pointsMaterial 
          color="#ff6600" 
          size={0.05} 
          transparent 
          opacity={0.8}
        />
      </points>
      {/* Ambient glow */}
      <pointLight position={[0, 0.5, 0]} color="#ff4400" intensity={0.3} distance={5} />
    </group>
  );
}

export function CombatArena({ environment }: CombatArenaProps) {
  const colors = ENV_COLORS[environment];
  
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color={colors.ground} flatShading />
      </mesh>
      
      {/* Ground detail ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 3, 32]} />
        <meshStandardMaterial color={colors.groundAccent} flatShading />
      </mesh>
      
      {/* Environment-specific elements */}
      {environment === 'forest' && <ForestEnvironment />}
      {environment === 'mountains' && <MountainEnvironment />}
      {environment === 'swamp' && <SwampEnvironment />}
      {environment === 'castle' && <CastleEnvironment />}
      {environment === 'volcano' && <VolcanoEnvironment />}
      
      {/* Lighting */}
      <ambientLight intensity={0.4} color={colors.ambient} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={environment === 'castle' ? 0.3 : 0.6} 
        castShadow
        color={environment === 'volcano' ? '#ff8866' : '#ffffff'}
      />
      {environment === 'volcano' && (
        <pointLight position={[0, 2, 0]} color="#ff4400" intensity={0.5} distance={10} />
      )}
      
      {/* Fog */}
      <fog attach="fog" args={[colors.fog, 5, 15]} />
    </group>
  );
}
