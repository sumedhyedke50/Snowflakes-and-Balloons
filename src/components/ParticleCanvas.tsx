import { useEffect, useState, useRef } from 'react';
import { Snowflake } from 'lucide-react';
import { Particle, EffectType } from '../types';

interface ParticleCanvasProps {
  activeEffect: EffectType;
  durationMs: number;
}

// Set of elegant, sophisticated colors for the formal balloons
const BALLOON_COLORS = [
  { name: 'Crimson Slate', fill: '#e11d48', shadow: '#9f1239' },
  { name: 'Classic Teal', fill: '#0d9488', shadow: '#115e59' },
  { name: 'Royal Indigo', fill: '#4f46e5', shadow: '#3730a3' },
  { name: 'Warm Amber', fill: '#d97706', shadow: '#92400e' },
  { name: 'Forest Emerald', fill: '#16a34a', shadow: '#166534' },
];

export default function ParticleCanvas({ activeEffect, durationMs }: ParticleCanvasProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const activeEffectRef = useRef<EffectType>('none');

  // Sync ref to keep latest state in the animation loop
  useEffect(() => {
    activeEffectRef.current = activeEffect;
    if (activeEffect === 'none') {
      // Clear out particles smoothly
      setParticles([]);
    } else {
      // Warm start with few particles instantly
      const initialParticles: Particle[] = [];
      const count = 6;
      for (let i = 0; i < count; i++) {
        initialParticles.push(createSingleParticle(activeEffect, true)); // randomized vertical placement
      }
      setParticles(initialParticles);
      lastSpawnRef.current = Date.now();
    }
  }, [activeEffect]);

  // Create a single particle
  const createSingleParticle = (type: 'snowflakes' | 'balloons', isWarmStart = false): Particle => {
    const id = Math.random().toString(36).substring(2, 9);
    const x = Math.random() * 100; // 0% to 100% width
    
    // Position depends on type and warmstart
    let y = -10; // default for snowflakes (spawn at top)
    if (type === 'balloons') {
      y = 110; // spawn at bottom
    }

    if (isWarmStart) {
      y = Math.random() * 80 + 10; // distributed between 10% and 90%
    }

    // Medium sizes:
    // Snowflakes: 20px - 28px
    // Balloons: 38px - 46px
    const size = type === 'snowflakes' 
      ? Math.random() * 8 + 20 
      : Math.random() * 8 + 38;

    // Speeds of travel
    const speed = type === 'snowflakes'
      ? Math.random() * 0.08 + 0.06  // screen height per frames
      : Math.random() * 0.09 + 0.07;

    const swaySpeed = Math.random() * 1.5 + 1.0;
    const swayAmp = type === 'snowflakes' 
      ? Math.random() * 4 + 2  // subtle winter drift
      : Math.random() * 6 + 3; // helium balloon tilt

    const opacity = type === 'snowflakes' 
      ? Math.random() * 0.4 + 0.5 
      : Math.random() * 0.15 + 0.8;

    const colorConfig = type === 'balloons' 
      ? BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] 
      : undefined;

    return {
      id,
      x,
      y,
      size,
      speed,
      swaySpeed,
      swayAmp,
      opacity,
      color: colorConfig ? JSON.stringify(colorConfig) : undefined,
      wiggleOffset: Math.random() * Math.PI * 2,
    };
  };

  // Main frame loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(time - lastTime, 100); // capped delta
      lastTime = time;

      const currentEffect = activeEffectRef.current;
      if (currentEffect === 'none') {
        // Just empty loop or clear particles
        return;
      }

      setParticles((prev) => {
        // Filter out off-screen particles and update positions
        const nextParticles = prev
          .map((p) => {
            let nextY = p.y;
            if (currentEffect === 'snowflakes') {
              nextY += p.speed * (dt * 0.1);
            } else {
              nextY -= p.speed * (dt * 0.1);
            }
            return {
              ...p,
              y: nextY,
            };
          })
          .filter((p) => {
            // Keep particles within bound + buffer
            if (currentEffect === 'snowflakes') {
              return p.y < 112;
            } else {
              return p.y > -15;
            }
          });

        return nextParticles;
      });

      // Spawn new particles at calculated rhythm if active effect matches
      const now = Date.now();
      const spawnInterval = currentEffect === 'snowflakes' ? 220 : 380; // slightly different densitites

      if (now - lastSpawnRef.current > spawnInterval) {
        setParticles((prev) => [...prev, createSingleParticle(currentEffect as 'snowflakes' | 'balloons', false)]);
        lastSpawnRef.current = now;
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div id="particle-overlay-container" className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none">
      {particles.map((p) => {
        // Calculate dynamic wave X position in percentage
        const timeSec = Date.now() / 1000;
        const currentSway = Math.sin(timeSec * p.swaySpeed + p.wiggleOffset) * p.swayAmp;
        const finalX = `calc(${p.x}% + ${currentSway}px)`;

        if (activeEffect === 'snowflakes') {
          return (
            <div
              key={p.id}
              id={`snowflake-${p.id}`}
              className="absolute"
              style={{
                left: finalX,
                top: `${p.y}%`,
                opacity: p.opacity,
                transform: `translate(-50%, -50%) rotate(${timeSec * 25 + p.wiggleOffset * 10}deg)`,
                width: p.size,
                height: p.size,
                color: '#38bdf8', // sky-400 for formal ice blue tone
                filter: 'drop-shadow(0 2px 4px rgba(56, 189, 248, 0.15))',
                willChange: 'transform, top, left',
                transition: 'opacity 0.2s ease-out',
              }}
            >
              <Snowflake size={p.size} strokeWidth={1.4} />
            </div>
          );
        }

        if (activeEffect === 'balloons') {
          // Parse beautiful colors
          let fillVal = '#e11d48';
          let shadowVal = '#9f1239';
          if (p.color) {
            try {
              const cObj = JSON.parse(p.color);
              fillVal = cObj.fill;
              shadowVal = cObj.shadow;
            } catch (e) {
              // fallback
            }
          }

          // Sway rotation based on movement
          const swayRot = Math.sin(timeSec * p.swaySpeed + p.wiggleOffset) * 10; // max 10deg lean

          return (
            <div
              key={p.id}
              id={`balloon-${p.id}`}
              className="absolute"
              style={{
                left: finalX,
                top: `${p.y}%`,
                transform: `translate(-50%, -50%) rotate(${swayRot}deg)`,
                width: p.size,
                height: p.size * 2,
                willChange: 'transform, top, left',
                transition: 'opacity 0.3s ease-out',
              }}
            >
              {/* Custom SVG premium vector balloon */}
              <svg 
                viewBox="0 0 40 80" 
                width="100%" 
                height="100%"
                style={{ opacity: p.opacity }}
              >
                <defs>
                  <radialGradient id={`grad-${p.id}`} cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="45%" stopColor={fillVal} />
                    <stop offset="100%" stopColor={shadowVal} />
                  </radialGradient>
                </defs>
                
                {/* Wobbly string */}
                <path 
                  d="M 20 44 Q 22 55, 18 64 T 20 78" 
                  fill="transparent" 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
                
                {/* Knot triangle */}
                <polygon 
                  points="17,44 23,44 20,41" 
                  fill={fillVal} 
                />
                
                {/* Shiny balloon body */}
                <ellipse 
                  cx="20" 
                  cy="25" 
                  rx="14" 
                  ry="18" 
                  fill={`url(#grad-${p.id})`} 
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                />
              </svg>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
