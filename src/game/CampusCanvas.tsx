import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { sound } from '../utils/soundEffects';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

interface ClickMarker {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface AmbientSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const CampusCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentStageIndex, chosenStartup, phase, floatingDeltas, proceedFromMapToStage, stats } = useGame();

  // Expanded Arena Boundaries (3000 x 2000)
  const ARENA_WIDTH = 3000;
  const ARENA_HEIGHT = 2000;
  const WORLD_MIN_X = 60;
  const WORLD_MAX_X = 2940;
  const WORLD_MIN_Y = 60;
  const WORLD_MAX_Y = 1940;

  // Avatar state - Spawn at West Gates Plaza
  const avatarPos = useRef({ x: 250, y: 625 });
  const targetPos = useRef({ x: 250, y: 625 });
  const avatarDir = useRef<'left' | 'right'>('right');
  const walkCycle = useRef(0);
  const isCelebrating = useRef(false);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const clickMarker = useRef<ClickMarker | null>(null);
  const camera = useRef({ x: 250, y: 625 });
  const ambientSparks = useRef<AmbientSpark[]>([]);

  // Real-time HUD Compass & Distance Elements
  const needleRef = useRef<HTMLDivElement | null>(null);
  const distanceRef = useRef<HTMLSpanElement | null>(null);

  // Initialize ambient sparks across 3000x2000 arena
  useEffect(() => {
    const colors = ['#38bdf8', '#c026d3', '#facc15', '#60a5fa', '#e879f9'];
    const list: AmbientSpark[] = [];
    for (let i = 0; i < 75; i++) {
      list.push({
        x: Math.random() * ARENA_WIDTH,
        y: Math.random() * ARENA_HEIGHT,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -Math.random() * 0.9 - 0.3,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    ambientSparks.current = list;
  }, []);

  const currentTargetBuilding = ecellConfig.buildingLocations[currentStageIndex] || ecellConfig.buildingLocations[0];
  const targetDoor = { 
    x: currentTargetBuilding.doorX ?? currentTargetBuilding.x, 
    y: currentTargetBuilding.doorY ?? (currentTargetBuilding.y + 65) 
  };

  // Trigger stage opening when avatar arrives within entrance radius
  useEffect(() => {
    const checkArrival = setInterval(() => {
      if (phase === 'map_journey') {
        const dist = Math.hypot(avatarPos.current.x - targetDoor.x, avatarPos.current.y - targetDoor.y);
        if (dist <= 75) {
          proceedFromMapToStage();
          sound.playPositive();
        }
      }
    }, 180);

    return () => clearInterval(checkArrival);
  }, [phase, currentStageIndex, targetDoor.x, targetDoor.y, proceedFromMapToStage]);

  // Floating stat popups in canvas
  useEffect(() => {
    if (floatingDeltas.length > 0) {
      const latest = floatingDeltas[floatingDeltas.length - 1];
      floatingTexts.current.push({
        id: Math.random().toString(),
        x: avatarPos.current.x,
        y: avatarPos.current.y - 45,
        text: latest.text,
        color: latest.type === 'positive' ? '#10B981' : latest.type === 'negative' ? '#F43F5E' : '#00F0FF',
        alpha: 1,
        vy: -1.2,
      });

      for (let i = 0; i < 8; i++) {
        particles.current.push({
          x: avatarPos.current.x,
          y: avatarPos.current.y - 30,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 4 + 2,
          alpha: 1,
          color: latest.type === 'positive' ? '#10B981' : '#F43F5E',
        });
      }
    }
  }, [floatingDeltas]);

  // Mouse drag-to-pan state & strict arena clamping
  const isPointerDown = useRef(false);
  const dragStartClient = useRef({ x: 0, y: 0 });
  const cameraStartDrag = useRef({ x: 0, y: 0 });
  const hasDraggedMap = useRef(false);
  const isManualCamera = useRef(false);
  const [showRecenter, setShowRecenter] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Zoom factor state: 1.0 (Fit whole arena) to 2.8 (close-up), default 1.5
  const [zoomDisplay, setZoomDisplay] = useState<number>(1.5);
  const zoomFactorRef = useRef<number>(1.5);
  const targetZoomFactor = useRef<number>(1.5);

  // Touch pinch-to-zoom tracking
  const touchStartDist = useRef<number | null>(null);
  const touchStartZoom = useRef<number>(1.5);

  // Helper calculating effective render scale ensuring arena always covers viewport with zero outside void
  const getEffectiveZoom = (w: number, h: number, factor: number = zoomFactorRef.current) => {
    const baseFit = Math.max(w / ARENA_WIDTH, h / ARENA_HEIGHT);
    return baseFit * factor;
  };

  // Zoom Action functions
  const zoomIn = () => {
    sound.playClick();
    const next = Math.min(2.8, Math.round((targetZoomFactor.current + 0.3) * 10) / 10);
    targetZoomFactor.current = next;
    setZoomDisplay(next);
  };

  const zoomOut = () => {
    sound.playClick();
    const next = Math.max(1.0, Math.round((targetZoomFactor.current - 0.3) * 10) / 10);
    targetZoomFactor.current = next;
    setZoomDisplay(next);
  };

  const resetZoom = () => {
    sound.playClick();
    targetZoomFactor.current = 1.5;
    setZoomDisplay(1.5);
    isManualCamera.current = false;
    setShowRecenter(false);
  };

  const fitArena = () => {
    sound.playClick();
    targetZoomFactor.current = 1.0;
    setZoomDisplay(1.0);
  };

  // Clamps camera so viewport NEVER peeks outside the arena boundary [0, 3000] and [0, 2000]
  const clampCameraToArena = (camX: number, camY: number, canvasW: number, canvasH: number, zoomLevel: number = 1) => {
    const visibleW = canvasW / zoomLevel;
    const visibleH = canvasH / zoomLevel;
    const halfW = visibleW / 2;
    const halfH = visibleH / 2;

    const minX = halfW;
    const maxX = ARENA_WIDTH - halfW;
    const minY = halfH;
    const maxY = ARENA_HEIGHT - halfH;

    const x = minX <= maxX ? Math.max(minX, Math.min(maxX, camX)) : ARENA_WIDTH / 2;
    const y = minY <= maxY ? Math.max(minY, Math.min(maxY, camY)) : ARENA_HEIGHT / 2;

    return { x, y };
  };

  // Non-passive wheel listener for smooth mouse-wheel zoom towards cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
      const current = targetZoomFactor.current;
      const next = Math.max(1.0, Math.min(2.8, Math.round((current + zoomDelta) * 10) / 10));
      if (next === current) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const w = canvas.width;
      const h = canvas.height;

      const baseFit = Math.max(w / ARENA_WIDTH, h / ARENA_HEIGHT);
      const oldEffective = baseFit * zoomFactorRef.current;
      const newEffective = baseFit * next;

      // Current world point under pointer
      const worldX = (screenX - w / 2) / oldEffective + camera.current.x;
      const worldY = (screenY - h / 2) / oldEffective + camera.current.y;

      targetZoomFactor.current = next;
      setZoomDisplay(next);

      // Center zoom towards pointer
      const targetCamX = worldX - (screenX - w / 2) / newEffective;
      const targetCamY = worldY - (screenY - h / 2) / newEffective;
      const clamped = clampCameraToArena(targetCamX, targetCamY, w, h, newEffective);
      camera.current.x = clamped.x;
      camera.current.y = clamped.y;
      isManualCamera.current = true;
      setShowRecenter(true);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [ARENA_WIDTH, ARENA_HEIGHT]);

  // Touch pinch-to-zoom handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      touchStartZoom.current = targetZoomFactor.current;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / touchStartDist.current;
      const next = Math.max(1.0, Math.min(2.8, Math.round(touchStartZoom.current * scale * 10) / 10));
      targetZoomFactor.current = next;
      setZoomDisplay(next);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) {
      touchStartDist.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDown.current = true;
    dragStartClient.current = { x: e.clientX, y: e.clientY };
    cameraStartDrag.current = { x: camera.current.x, y: camera.current.y };
    hasDraggedMap.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 1200;
    const h = canvas ? canvas.height : 800;
    const zoom = getEffectiveZoom(w, h);

    const dx = (e.clientX - dragStartClient.current.x) / zoom;
    const dy = (e.clientY - dragStartClient.current.y) / zoom;

    if (Math.hypot(dx, dy) > 4) {
      hasDraggedMap.current = true;
      isManualCamera.current = true;
      setShowRecenter(true);
      setIsGrabbing(true);

      const newCamX = cameraStartDrag.current.x - dx;
      const newCamY = cameraStartDrag.current.y - dy;
      const clamped = clampCameraToArena(newCamX, newCamY, w, h, zoom);
      camera.current.x = clamped.x;
      camera.current.y = clamped.y;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsGrabbing(false);

    if (!hasDraggedMap.current) {
      // Single click: move avatar to destination!
      handleCanvasClick(e.clientX, e.clientY);
    }
  };

  const handlePointerLeave = () => {
    isPointerDown.current = false;
    setIsGrabbing(false);
  };

  // Click-to-move handler
  const handleCanvasClick = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = clientX - rect.left;
    const clickScreenY = clientY - rect.top;

    const zoom = getEffectiveZoom(canvas.width, canvas.height);

    // Screen to world coordinates with zoom
    const worldX = (clickScreenX - canvas.width / 2) / zoom + camera.current.x;
    const worldY = (clickScreenY - canvas.height / 2) / zoom + camera.current.y;

    // Check if clicked directly on or near a building
    let destinationX = worldX;
    let destinationY = worldY;

    for (const b of ecellConfig.buildingLocations) {
      const d = Math.hypot(worldX - b.x, worldY - b.y);
      if (d < 85) {
        // Walk directly to building entrance
        destinationX = b.doorX ?? b.x;
        destinationY = b.doorY ?? (b.y + 65);
        break;
      }
    }

    // Clamp inside world boundary
    const clampedX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, destinationX));
    const clampedY = Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, destinationY));

    targetPos.current = { x: clampedX, y: clampedY };
    clickMarker.current = { x: clampedX, y: clampedY, radius: 4, alpha: 1 };
    sound.playClick();

    // Re-lock camera to avatar when moving
    isManualCamera.current = false;
    setShowRecenter(false);
  };

  // Keyboard controls listener (WASD / Arrows & Zoom Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const step = 55;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dy -= step;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dy += step;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dx -= step;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dx += step;

      // Keyboard Zoom Controls
      if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') {
        zoomOut();
      } else if (e.key === '0' || e.code === 'Numpad0') {
        resetZoom();
      }

      if (dx !== 0 || dy !== 0) {
        targetPos.current = {
          x: Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, avatarPos.current.x + dx)),
          y: Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, avatarPos.current.y + dy)),
        };
        isManualCamera.current = false;
        setShowRecenter(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // 1. COLLISION & MOVEMENT UPDATE
      const dx = targetPos.current.x - avatarPos.current.x;
      const dy = targetPos.current.y - avatarPos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        const speed = 6.2;
        let nextX = avatarPos.current.x + (dx / dist) * Math.min(dist, speed);
        let nextY = avatarPos.current.y + (dy / dist) * Math.min(dist, speed);

        // Strict World Boundary Clamping
        nextX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, nextX));
        nextY = Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, nextY));

        // Building Solid Roof Collision with Corner Deflection (prevents avatar from getting stuck)
        for (const b of ecellConfig.buildingLocations) {
          if (b.id === 'stage-pitch') continue; // Pitch Arena is an open showdown amphitheater

          const bLeft = b.x - 60;
          const bRight = b.x + 60;
          const bTop = b.y - 45;
          const bBottom = b.y + 35;

          if (nextX > bLeft && nextX < bRight && nextY > bTop && nextY < bBottom) {
            // If hitting horizontal wall, deflect horizontally around nearest edge
            if (avatarPos.current.y <= bTop || avatarPos.current.y >= bBottom) {
              nextY = avatarPos.current.y;
              const distToLeft = Math.abs(avatarPos.current.x - bLeft);
              const distToRight = Math.abs(avatarPos.current.x - bRight);
              const deflectDir = distToLeft < distToRight ? -1 : 1;
              nextX = avatarPos.current.x + deflectDir * speed;
            }
            // If hitting vertical wall, deflect vertically around nearest top/bottom corner
            else if (avatarPos.current.x <= bLeft || avatarPos.current.x >= bRight) {
              nextX = avatarPos.current.x;
              const distToTop = Math.abs(avatarPos.current.y - bTop);
              const distToBottom = Math.abs(avatarPos.current.y - bBottom);
              const deflectDir = distToTop < distToBottom ? -1 : 1;
              nextY = avatarPos.current.y + deflectDir * speed;
            }
          }
        }

        avatarPos.current.x = nextX;
        avatarPos.current.y = nextY;
        walkCycle.current += 0.25;
        avatarDir.current = dx < 0 ? 'left' : 'right';

        // Footstep dust
        if (Math.random() < 0.22) {
          particles.current.push({
            x: avatarPos.current.x,
            y: avatarPos.current.y + 12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 0.5,
            size: Math.random() * 2.5 + 1,
            alpha: 0.5,
            color: '#94A3B8',
          });
        }
      } else {
        walkCycle.current = 0;
      }

      // Camera lerp
      if (!isManualCamera.current) {
        camera.current.x += (avatarPos.current.x - camera.current.x) * 0.09;
        camera.current.y += (avatarPos.current.y - camera.current.y) * 0.09;
      }

      // Smooth zoom interpolation & strict arena boundary clamp
      zoomFactorRef.current += (targetZoomFactor.current - zoomFactorRef.current) * 0.15;
      const zoom = getEffectiveZoom(width, height, zoomFactorRef.current);
      const clampedCam = clampCameraToArena(camera.current.x, camera.current.y, width, height, zoom);
      camera.current.x = clampedCam.x;
      camera.current.y = clampedCam.y;

      // Update real-time 360° Compass Needle & Distance
      const distToTarget = Math.hypot(targetDoor.x - avatarPos.current.x, targetDoor.y - avatarPos.current.y);
      const liveAngle = Math.atan2(targetDoor.y - avatarPos.current.y, targetDoor.x - avatarPos.current.x);

      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${Math.round((liveAngle * 180) / Math.PI)}deg)`;
      }
      if (distanceRef.current) {
        distanceRef.current.innerText = `${Math.round(distToTarget)}m`;
      }

      // -------------------------------------------------------------
      // DRAWING
      // -------------------------------------------------------------
      ctx.save();
      ctx.fillStyle = '#050711';
      ctx.fillRect(0, 0, width, height);

      // Camera Transform with guaranteed arena coverage
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camera.current.x, -camera.current.y);

      // -------------------------------------------------------------
      // 1. CATCHY BRAWL STARS STADIUM TURF & AMBIENT SPARKS (3000 x 2000)
      // -------------------------------------------------------------
      ctx.fillStyle = '#060918';
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

      // Alternating Horizontal Stadium Turf Bands (Brawl Ball / Gem Grab Turf)
      const stripeHeight = 160;
      for (let y = 0; y <= ARENA_HEIGHT; y += stripeHeight) {
        const isOdd = Math.floor(y / stripeHeight) % 2 === 1;
        ctx.fillStyle = isOdd ? '#090e24' : '#0d1536';
        ctx.fillRect(0, y, ARENA_WIDTH, stripeHeight);
      }

      // Stylized Hex / Diagonal Grid Lines with Cyan & Magenta Neon Accents
      const tileSize = 75;
      for (let x = 0; x <= ARENA_WIDTH; x += tileSize) {
        const isCyan = (x / tileSize) % 2 === 0;
        ctx.strokeStyle = isCyan ? 'rgba(56, 189, 248, 0.07)' : 'rgba(192, 38, 211, 0.06)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ARENA_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= ARENA_HEIGHT; y += tileSize) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ARENA_WIDTH, y);
        ctx.stroke();
      }

      // Dynamic Ambient Floating Sparks (Twinkling Stardust)
      for (const s of ambientSparks.current) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.y < 0) s.y = ARENA_HEIGHT;
        if (s.x < 0) s.x = ARENA_WIDTH;
        if (s.x > ARENA_WIDTH) s.x = 0;

        ctx.save();
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(time * 3 + s.x) * 0.4);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Arena Floor Decals & Markings (Centered at 1500, 1000)
      ctx.save();
      ctx.textAlign = 'center';
      
      // Top Floor Emblem
      ctx.font = '900 84px "Lilita One", sans-serif';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillText("SOA IEC BRAWL ARENA", 1500, 680);

      // Bottom Floor Emblem
      ctx.font = '900 64px "Lilita One", sans-serif';
      ctx.fillStyle = 'rgba(192, 38, 211, 0.08)';
      ctx.fillText("STARTUP SHOWDOWN: ZERO TO ONE", 1500, 1320);
      ctx.restore();

      // -------------------------------------------------------------
      // 2. STADIUM BOUNDARY LASER BARRIER & CORNER PYLONS
      // -------------------------------------------------------------
      // Outer Warning Hazard Zone
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
      ctx.lineWidth = 6;
      ctx.setLineDash([20, 15]);
      ctx.strokeRect(WORLD_MIN_X - 25, WORLD_MIN_Y - 25, WORLD_MAX_X - WORLD_MIN_X + 50, WORLD_MAX_Y - WORLD_MIN_Y + 50);
      ctx.setLineDash([]);

      // Primary Laser Perimeter Fence
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.strokeRect(WORLD_MIN_X - 10, WORLD_MIN_Y - 10, WORLD_MAX_X - WORLD_MIN_X + 20, WORLD_MAX_Y - WORLD_MIN_Y + 20);
      ctx.shadowBlur = 0;

      // Perimeter Neon Pylons
      for (let px = WORLD_MIN_X; px <= WORLD_MAX_X; px += 200) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, WORLD_MIN_Y - 10, 4.5, 0, Math.PI * 2);
        ctx.arc(px, WORLD_MAX_Y + 10, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let py = WORLD_MIN_Y; py <= WORLD_MAX_Y; py += 200) {
        ctx.fillStyle = '#c026d3';
        ctx.beginPath();
        ctx.arc(WORLD_MIN_X - 10, py, 4.5, 0, Math.PI * 2);
        ctx.arc(WORLD_MAX_X + 10, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // 3. HIGH-SPEED CONNECTING TRACKS WITH ANIMATED CHEVRONS
      // -------------------------------------------------------------
      const pts = ecellConfig.buildingLocations.map((b) => ({ 
        x: b.doorX ?? b.x, 
        y: b.doorY ?? (b.y + 65) 
      }));

      // Track Base (Dark Cyber Asphalt)
      ctx.strokeStyle = '#0d1630';
      ctx.lineWidth = 84;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.lineTo(pts[0].x, pts[0].y);
      ctx.stroke();

      // Dual Neon Borders (Electric Blue & Magenta)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Animated Glowing Chevrons flowing along the track
      ctx.save();
      const chevronOffset = (time * 65) % 90;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([14, 45]);
      ctx.lineDashOffset = -chevronOffset;
      ctx.stroke();
      ctx.restore();

      // -------------------------------------------------------------
      // 4. CENTER SHOWDOWN CRATER & ENERGY ARENA (1500, 1000)
      // -------------------------------------------------------------
      ctx.save();
      ctx.fillStyle = '#0b132b';
      ctx.beginPath();
      ctx.arc(1500, 1000, 145, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner Magenta Energy Ring
      ctx.strokeStyle = '#c026d3';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(1500, 1000, 105, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating Concentric Pulse Waves
      const pulseRadius = (time * 35) % 115;
      ctx.strokeStyle = `rgba(56, 189, 248, ${1 - pulseRadius / 115})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(1500, 1000, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Center Star Crest
      ctx.fillStyle = '#facc15';
      ctx.font = '42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 1500, 1000);
      ctx.restore();

      // -------------------------------------------------------------
      // 5. DYNAMIC SWEEPING STADIUM SEARCHLIGHTS
      // -------------------------------------------------------------
      ctx.save();
      const sweepAngle1 = Math.sin(time * 0.7) * 0.8 + 0.8;
      const sweepAngle2 = Math.cos(time * 0.6) * 0.8 - 0.8;

      // Spotlight 1 (Top Left -> Sweeping)
      const grad1 = ctx.createRadialGradient(450, 250, 20, 450 + Math.cos(sweepAngle1) * 900, 250 + Math.sin(sweepAngle1) * 900, 450);
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.moveTo(450, 250);
      ctx.arc(450, 250, 1200, sweepAngle1 - 0.35, sweepAngle1 + 0.35);
      ctx.closePath();
      ctx.fill();

      // Spotlight 2 (Bottom Right -> Sweeping)
      const grad2 = ctx.createRadialGradient(2550, 1750, 20, 2550 + Math.cos(sweepAngle2) * 900, 1750 + Math.sin(sweepAngle2) * 900, 450);
      grad2.addColorStop(0, 'rgba(192, 38, 211, 0.16)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(2550, 1750);
      ctx.arc(2550, 1750, 1200, sweepAngle2 - 0.35, sweepAngle2 + 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Neon Cyber Energy Nodes across the arena
      const nodeLocs = [
        { x: 750, y: 380 }, { x: 1500, y: 320 }, { x: 2200, y: 380 },
        { x: 2750, y: 950 }, { x: 2200, y: 1600 }, { x: 1500, y: 1650 },
        { x: 750, y: 1600 }, { x: 250, y: 950 }, { x: 1050, y: 700 },
        { x: 1950, y: 700 }, { x: 1050, y: 1300 }, { x: 1950, y: 1300 }
      ];
      nodeLocs.forEach((nd) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(nd.x, nd.y + 15, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Buildings
      ecellConfig.buildingLocations.forEach((b, idx) => {
        const isCurrent = idx === currentStageIndex;
        const isCompleted = idx < currentStageIndex;
        const isCrisis = b.id === 'stage-pr' && phase === 'crisis_active';
        const doorX = b.doorX ?? b.x;
        const doorY = b.doorY ?? (b.y + 65);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y + 40, 65, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // OBJECTIVE BEACON FOR CURRENT TARGET
        if (isCurrent) {
          const pulse = Math.sin(time * 5) * 14;

          // Towering Vertical Light Beam shooting up from entrance
          const beamGrad = ctx.createLinearGradient(doorX, doorY, doorX, doorY - 320);
          beamGrad.addColorStop(0, isCrisis ? 'rgba(244, 63, 94, 0.45)' : 'rgba(56, 189, 248, 0.45)');
          beamGrad.addColorStop(0.5, isCrisis ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)');
          beamGrad.addColorStop(1, 'transparent');

          ctx.save();
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(doorX - 35, doorY);
          ctx.lineTo(doorX + 35, doorY);
          ctx.lineTo(doorX + 65, doorY - 320);
          ctx.lineTo(doorX - 65, doorY - 320);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Pulsing Beacon Ground Ring with Shadow Glow
          ctx.strokeStyle = isCrisis ? '#F43F5E' : '#38bdf8';
          ctx.lineWidth = 4;
          ctx.shadowColor = isCrisis ? '#F43F5E' : '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.ellipse(doorX, doorY, 52 + pulse, 26 + pulse / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Target Bouncing Badge
          const bounce = Math.sin(time * 6) * 6;
          ctx.save();
          ctx.font = '900 13px "Lilita One", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = isCrisis ? '#F43F5E' : '#FACC15';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 6;
          ctx.fillText('★ NEXT OBJECTIVE ★', doorX, b.y - 65 + bounce);
          ctx.restore();
        }

        // Special render for Pitch Arena (Open Colosseum Stage)
        if (b.id === 'stage-pitch') {
          ctx.save();
          ctx.fillStyle = isCurrent ? '#1e1b4b' : '#0f172a';
          ctx.strokeStyle = isCurrent ? '#00F0FF' : '#4f46e5';
          ctx.lineWidth = isCurrent ? 3.5 : 2.5;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 65, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = '28px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.icon, b.x, b.y - 10);

          ctx.fillStyle = isCurrent ? '#00F0FF' : '#E2E8F0';
          ctx.font = 'bold 12px "Outfit"';
          ctx.fillText(b.name.toUpperCase(), b.x, b.y + 35);
          ctx.restore();
          return;
        }

        // Standard Building Body
        ctx.fillStyle = isCrisis ? '#2E0F1A' : '#0F172A';
        ctx.strokeStyle = isCrisis ? '#F43F5E' : isCurrent ? '#00F0FF' : isCompleted ? '#10B981' : '#334155';
        ctx.lineWidth = isCurrent ? 3 : 2;

        ctx.beginPath();
        ctx.roundRect(b.x - 55, b.y - 45, 110, 85, 14);
        ctx.fill();
        ctx.stroke();

        // Center-facing Door Placement
        let doorRect = { x: b.x - 16, y: b.y + 14, w: 32, h: 26 };
        if (b.doorY && b.doorY < b.y) {
          doorRect = { x: b.x - 16, y: b.y - 42, w: 32, h: 26 }; // North side
        } else if (b.doorX && b.doorX < b.x) {
          doorRect = { x: b.x - 53, y: b.y - 14, w: 26, h: 32 }; // West side
        } else if (b.doorX && b.doorX > b.x) {
          doorRect = { x: b.x + 27, y: b.y - 14, w: 26, h: 32 }; // East side
        }

        ctx.fillStyle = isCurrent ? '#00F0FF' : '#1E293B';
        ctx.fillRect(doorRect.x, doorRect.y, doorRect.w, doorRect.h);

        // Windows
        ctx.fillStyle = isCurrent ? 'rgba(0, 240, 255, 0.7)' : 'rgba(251, 191, 36, 0.5)';
        ctx.fillRect(b.x - 42, b.y - 25, 18, 18);
        ctx.fillRect(b.x + 24, b.y - 25, 18, 18);

        // Roof Icon
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.icon, b.x, b.y - 22);

        // Name
        ctx.fillStyle = isCurrent ? '#00F0FF' : isCompleted ? '#10B981' : '#E2E8F0';
        ctx.font = 'bold 12px "Outfit"';
        ctx.fillText(b.name.toUpperCase(), b.x, b.y + 55);

        // Completed Checkmark
        if (isCompleted) {
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 13px "JetBrains Mono"';
          ctx.fillText('✓ CLEARED', b.x, b.y - 50);
        }
      });

      // Click Target Ripple Marker
      if (clickMarker.current) {
        clickMarker.current.radius += 1.2;
        clickMarker.current.alpha -= 0.035;
        if (clickMarker.current.alpha <= 0) {
          clickMarker.current = null;
        } else {
          ctx.strokeStyle = `rgba(0, 240, 255, ${clickMarker.current.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(clickMarker.current.x, clickMarker.current.y, clickMarker.current.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // 6. DRAW BRAWLER AVATAR & DIRECTION OF NEXT TARGET
      // -------------------------------------------------------------
      const avX = avatarPos.current.x;
      const avY = avatarPos.current.y;
      const legOffset = Math.sin(walkCycle.current * 8) * 6;
      const hop = isCelebrating.current ? Math.abs(Math.sin(time * 12)) * 14 : 0;

      // Brawl Stars Glowing Pedestal / Player Ring Under Feet
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(avX, avY + 12, 20, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.restore();

      // Continuous Directional Ground Radar Chevron Under Feet Pointing to Target
      const navAngle = Math.atan2(targetDoor.y - avY, targetDoor.x - avX);
      ctx.save();
      ctx.translate(avX, avY + 12);
      ctx.rotate(navAngle);

      const chevronPulse = Math.sin(time * 8) * 4;
      ctx.fillStyle = '#FACC15';
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 12;

      // Primary golden radar arrow
      ctx.beginPath();
      ctx.moveTo(34 + chevronPulse, 0);
      ctx.lineTo(20 + chevronPulse, -10);
      ctx.lineTo(25 + chevronPulse, 0);
      ctx.lineTo(20 + chevronPulse, 10);
      ctx.closePath();
      ctx.fill();

      // Secondary trailing cyan chevron
      ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.beginPath();
      ctx.moveTo(22 + chevronPulse * 0.7, 0);
      ctx.lineTo(12 + chevronPulse * 0.7, -7);
      ctx.lineTo(16 + chevronPulse * 0.7, 0);
      ctx.lineTo(12 + chevronPulse * 0.7, 7);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Avatar Body
      ctx.save();
      ctx.translate(avX, avY - hop);

      if (avatarDir.current === 'left') {
        ctx.scale(-1, 1);
      }

      // Legs
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(-3 - legOffset, 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(3, 0);
      ctx.lineTo(3 + legOffset, 12);
      ctx.stroke();

      // Backpack
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-12, -14, 6, 14, 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-8, -16, 16, 18, 4);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(0, -22, 8, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, -24, 8, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Overhead Brawl Stars Name & Dynamic Success Rate Bar
      ctx.save();
      ctx.textAlign = 'center';

      const successPct = Math.max(0, Math.min(100, stats.score));
      const barColor = successPct >= 70 ? '#22c55e' : successPct >= 40 ? '#facc15' : '#ef4444';

      // Name & Live Success Rate
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "Lilita One", sans-serif';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(`${chosenStartup?.name.toUpperCase() || 'FOUNDER'} • ${successPct}% SUCCESS`, avX, avY - 44 - hop);

      // 3D Success Rate Bar
      const hpWidth = 58;
      const hpHeight = 7;
      ctx.fillStyle = '#000000';
      ctx.fillRect(avX - hpWidth / 2 - 1.5, avY - 40 - hop, hpWidth + 3, hpHeight + 3);

      // Empty Track
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(avX - hpWidth / 2, avY - 39 - hop, hpWidth, hpHeight);

      // Dynamic Success Fill
      ctx.fillStyle = barColor;
      ctx.fillRect(avX - hpWidth / 2, avY - 39 - hop, (hpWidth * successPct) / 100, hpHeight);

      // 3 Ammo Segments
      const ammoWidth = 16;
      const ammoGap = 3;
      const ammoStartX = avX - (ammoWidth * 3 + ammoGap * 2) / 2;
      for (let a = 0; a < 3; a++) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(ammoStartX + a * (ammoWidth + ammoGap) - 0.5, avY - 30 - hop, ammoWidth + 1, 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ammoStartX + a * (ammoWidth + ammoGap), avY - 29.5 - hop, ammoWidth, 3);
      }
      ctx.restore();

      // Particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Floating Texts
      for (let i = floatingTexts.current.length - 1; i >= 0; i--) {
        const ft = floatingTexts.current[i];
        ft.y += ft.vy;
        ft.alpha -= 0.015;
        if (ft.alpha <= 0) {
          floatingTexts.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'black 14px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentStageIndex, chosenStartup, phase, targetDoor.x, targetDoor.y]);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden bg-[#050711] select-none">

      {/* 2D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-full block touch-none ${isGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Floating Re-center Button when camera is panned away */}
      {showRecenter && (
        <button
          onClick={() => {
            sound.playClick();
            isManualCamera.current = false;
            setShowRecenter(false);
          }}
          className="absolute top-16 right-6 z-30 brawl-btn brawl-btn-yellow text-xs px-3.5 py-2 shadow-xl flex items-center gap-1.5 animate-bounce pointer-events-auto"
          title="Snap camera back to founder"
        >
          <span>🎯 RE-CENTER FOUNDER</span>
        </button>
      )}

      {/* Floating Arena Zoom Controls Dock */}
      <div className="absolute top-28 right-6 z-30 pointer-events-auto flex flex-col items-center bg-[#080d1f]/95 border-2 border-yellow-400/80 rounded-2xl p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.65)] backdrop-blur-md gap-1.5">
        {/* Zoom In Button */}
        <button
          onClick={zoomIn}
          disabled={zoomDisplay >= 2.8}
          className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-yellow-400 hover:text-black text-yellow-400 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          title="Zoom In (Key + / Scroll Up)"
          aria-label="Zoom In"
        >
          <ZoomIn size={16} strokeWidth={2.5} />
        </button>

        {/* Current Zoom Percentage / Reset Button */}
        <button
          onClick={resetZoom}
          className="px-1.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono font-bold text-yellow-300 transition-colors border border-yellow-400/30"
          title="Reset Zoom to 1.5x (Key 0)"
        >
          {zoomDisplay.toFixed(1)}x
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={zoomOut}
          disabled={zoomDisplay <= 1.0}
          className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-yellow-400 hover:text-black text-yellow-400 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          title="Zoom Out (Key - / Scroll Down)"
          aria-label="Zoom Out"
        >
          <ZoomOut size={16} strokeWidth={2.5} />
        </button>

        {/* Arena Fit Button */}
        <button
          onClick={fitArena}
          className={`w-8 h-8 rounded-xl ${zoomDisplay === 1.0 ? 'bg-cyan-500 text-black font-black' : 'bg-slate-800/90 hover:bg-cyan-500 hover:text-black text-cyan-400'} flex items-center justify-center transition-all active:scale-95 shadow-sm`}
          title="Fit Whole Arena / Bird's Eye View"
          aria-label="Fit Whole Arena"
        >
          <Maximize2 size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Target Objective & Continuous 360° Rotating Radar Compass (Top Center) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#080d1f]/95 border-2 border-yellow-400 border-b-4 border-b-amber-600 shadow-[0_0_30px_rgba(250,204,21,0.45)] backdrop-blur-md">
        {/* 360° Real-time Rotating Compass Radar Needle */}
        <div className="relative w-9 h-9 rounded-full bg-slate-900 border-2 border-yellow-400 flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-spin [animation-duration:6s]" />
          <div ref={needleRef} className="w-7 h-7 flex items-center justify-center transition-transform duration-75">
            <svg viewBox="0 0 24 24" className="w-6 h-6 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]">
              {/* Needle pointing Right (0 deg) */}
              <path d="M22 12L5 5l4 7-4 7z" fill="#FACC15" stroke="#78350F" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            <span className="text-xs font-black tracking-wider text-yellow-400 uppercase font-brawl">
              TARGET: {currentTargetBuilding.icon} {currentTargetBuilding.name.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold">
            DISTANCE: <span ref={distanceRef} className="text-yellow-300 font-black">0m</span> • FOLLOW RADAR ARROW
          </span>
        </div>
      </div>

      {/* BRAWL STARS ARCADE VIRTUAL CONTROLS OVERLAY */}
      
      {/* Bottom Left: Virtual Joystick */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
        <div 
          onClick={() => {
            // Mini walk nudge
            targetPos.current.x = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, avatarPos.current.x - 60));
          }}
          className="brawl-joystick-ring cursor-pointer"
          title="Virtual Movement Joystick (or use WASD / Click to move)"
        >
          <div className="brawl-joystick-knob flex items-center justify-center text-xs font-brawl text-black">
            MOVE
          </div>
        </div>
        <span className="text-[10px] font-brawl text-sky-400 uppercase tracking-wider">
          JOYSTICK / WASD
        </span>
      </div>

      {/* Bottom Right: Super Ability & Dash Button */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-end gap-3 opacity-90 hover:opacity-100 transition-opacity">
        
        {/* Dash to Target Button */}
        <button
          onClick={() => {
            sound.playPositive();
            targetPos.current.x = targetDoor.x;
            targetPos.current.y = targetDoor.y;
          }}
          className="brawl-btn brawl-btn-blue text-xs px-3.5 py-2.5 shadow-lg"
          title="Auto-dash directly to the objective building"
        >
          <span>AUTO-WALK ➔</span>
        </button>

        {/* Super Charge Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              sound.playSuccessFanfare();
              // Super speed dash
              const dx = targetDoor.x - avatarPos.current.x;
              const dy = targetDoor.y - avatarPos.current.y;
              const dist = Math.hypot(dx, dy);
              if (dist > 10) {
                avatarPos.current.x += (dx / dist) * 110;
                avatarPos.current.y += (dy / dist) * 110;
              }
            }}
            className="brawl-super-btn animate-pulse"
            title="SUPER DASH: Burst 110m towards the objective!"
          >
            ⚡
          </button>
          <span className="text-[10px] font-brawl text-yellow-400 uppercase tracking-wider">
            SUPER DASH
          </span>
        </div>
      </div>

    </div>
  );
};
