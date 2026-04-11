import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function Particles() {
  const points = useRef();
  const positions = useMemo(() => {
    const count = 1200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) {
      arr[i] = (Math.random() - 0.5) * 120;
      arr[i + 1] = (Math.random() - 0.5) * 120;
      arr[i + 2] = (Math.random() - 0.5) * 120;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.001;
      points.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.6} transparent opacity={0.6} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas className="absolute inset-0" camera={{ position: [0, 0, 50], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <Particles />
    </Canvas>
  );
}
