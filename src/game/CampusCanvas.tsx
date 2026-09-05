import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/soundEffects';
import { ZoomIn, ZoomOut, Maximize2, MessageSquare, Sparkles } from 'lucide-react';

// ============================================================
// INTERFACES
// ============================================================
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string;
}
interface FloatingText {
  id: string; x: number; y: number; text: string;
  color: string; alpha: number; vy: number;
}
interface ClickMarker {
  x: number; y: number; radius: number; alpha: number;
}
interface WalkRect {
  x: number; y: number; w: number; h: number;
}
interface DepartmentRoom {
  id: string;
  name: string;
  deptTitle: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  code: string;
  x: number; y: number; w: number; h: number;
  doorX: number; doorY: number;
  doorSide: 'north' | 'south' | 'east' | 'west';
  mentorX: number; mentorY: number;
  color: string;
  secondaryColor: string;
  floorColor: string;
  corridorEntry: { x: number; y: number };
  nearJunctionIdx: number;
}

interface WrongMentorGuidance {
  mentorName: string;
  mentorAvatar: string;
  deptTitle: string;
  deptCode: string;
  targetName: string;
  targetCode: string;
  targetAvatar: string;
  message: string;
  targetIdx: number;
}

// ============================================================
// E-CELL FACILITY GEOMETRY (2400 × 1600 Incubation Complex)
// ============================================================
const ARENA_W = 2400;
const ARENA_H = 1600;

function getWrongMentorAdvice(visitedIdx: number, activeIdx: number): WrongMentorGuidance {
  const visited = ROOMS[visitedIdx] || ROOMS[0];
  const active = ROOMS[activeIdx] || ROOMS[0];
  let msg = '';
  if (visitedIdx < activeIdx) {
    msg = `Hello Founder! We've already completed the ${visited.deptTitle} phase. Your team's current priority is [${active.code}] ${active.name.toUpperCase()} with ${active.mentorName}!`;
  } else {
    msg = `Hold on, Founder! Before we can review ${visited.deptTitle}, you must first clear [${active.code}] ${active.name.toUpperCase()} with ${active.mentorName}!`;
  }
  return {
    mentorName: visited.mentorName,
    mentorAvatar: visited.mentorAvatar,
    deptTitle: visited.deptTitle,
    deptCode: visited.code,
    targetName: active.name,
    targetCode: active.code,
    targetAvatar: active.mentorAvatar,
    message: msg,
    targetIdx: activeIdx,
  };
}


// Deterministic Starfield Data for Sci-Fi Starship Orbital Deck Background
interface StarNode {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  phase: number;
  hasSpikes: boolean;
}

const STAR_PALETTE = ['#FFFFFF', '#38BDF8', '#FDE047', '#C084FC', '#93C5FD', '#FFFFFF', '#67E8F9'];
const STARS: StarNode[] = Array.from({ length: 180 }, (_, i) => {
  const s1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  const r1 = s1 - Math.floor(s1);
  const s2 = Math.sin((i + 31) * 93.9898 + 67.345) * 24634.6345;
  const r2 = s2 - Math.floor(s2);
  const s3 = Math.sin((i + 77) * 45.1234 + 12.987) * 58923.1234;
  const r3 = s3 - Math.floor(s3);
  return {
    x: Math.round(r1 * ARENA_W),
    y: Math.round(r2 * ARENA_H),
    r: Math.round((0.7 + r3 * 1.8) * 10) / 10,
    color: STAR_PALETTE[i % STAR_PALETTE.length],
    speed: 1.2 + r1 * 3.2,
    phase: r2 * Math.PI * 2,
    hasSpikes: i % 14 === 0,
  };
});


// Corridors & Hallways forming authentic interconnected pathways
const CORRIDORS: WalkRect[] = [
  { x: 440, y: 340, w: 1520, h: 120 },  // North R&D Hallway (y: 340-460)
  { x: 440, y: 740, w: 1520, h: 120 },  // Central Innovation Commons (y: 740-860)
  { x: 440, y: 1140, w: 1520, h: 120 }, // South Media & PR Hallway (y: 1140-1260)
  { x: 440, y: 340, w: 120, h: 920 },   // West Wing Incubation Hallway (x: 440-560)
  { x: 1840, y: 340, w: 120, h: 920 },  // East Wing Growth Hallway (x: 1840-1960)
  { x: 1140, y: 440, w: 120, h: 200 },  // Center-North Pitch Auditorium Entrance (y: 440-640)
  { x: 1140, y: 960, w: 120, h: 200 },  // Center-South Pitch Auditorium Entrance (y: 960-1160)
];

// 9 Authentic Department Rooms of E-Cell (Balanced across all 4 corridors: 2 West, 2 North, 2 East, 2 South, 1 Center)
const ROOMS: DepartmentRoom[] = [
  {
    id: 'stage-mentorship',
    name: 'Mentorship Center',
    deptTitle: 'RESEARCH & MENTORSHIP',
    mentorName: 'Mentorship Team',
    mentorRole: 'E-Cell Mentorship Team',
    mentorAvatar: '👩‍💼',
    code: 'ROOM 01',
    x: 80, y: 440, w: 360, h: 300,
    doorX: 440, doorY: 590, doorSide: 'east',
    mentorX: 230, mentorY: 590,
    color: '#3B82F6', secondaryColor: '#60A5FA', floorColor: '#0c1a38',
    corridorEntry: { x: 500, y: 590 },
    nearJunctionIdx: 0, // NW
  },
  {
    id: 'stage-technical',
    name: 'Tech & Dev Lab',
    deptTitle: 'DEV & ARCHITECTURE',
    mentorName: 'Tech & Dev Team',
    mentorRole: 'E-Cell Technical Team',
    mentorAvatar: '👨‍💻',
    code: 'ROOM 02',
    x: 640, y: 60, w: 440, h: 280,
    doorX: 860, doorY: 340, doorSide: 'south',
    mentorX: 860, mentorY: 200,
    color: '#06B6D4', secondaryColor: '#22D3EE', floorColor: '#071e2e',
    corridorEntry: { x: 860, y: 400 },
    nearJunctionIdx: 1, // N_CTR
  },
  {
    id: 'stage-design',
    name: 'Design Studio',
    deptTitle: 'UI & BRAND STUDIO',
    mentorName: 'Design & UX Team',
    mentorRole: 'E-Cell Design Team',
    mentorAvatar: '🎨',
    code: 'ROOM 03',
    x: 1320, y: 60, w: 440, h: 280,
    doorX: 1540, doorY: 340, doorSide: 'south',
    mentorX: 1540, mentorY: 200,
    color: '#A855F7', secondaryColor: '#C084FC', floorColor: '#1a0d30',
    corridorEntry: { x: 1540, y: 400 },
    nearJunctionIdx: 1, // N_CTR
  },
  {
    id: 'stage-content',
    name: 'Content Room',
    deptTitle: 'COPY & MESSAGING',
    mentorName: 'Content & Copy Team',
    mentorRole: 'E-Cell Content Team',
    mentorAvatar: '✍️',
    code: 'ROOM 04',
    x: 1960, y: 440, w: 360, h: 300,
    doorX: 1960, doorY: 590, doorSide: 'west',
    mentorX: 2170, mentorY: 590,
    color: '#F59E0B', secondaryColor: '#FBBF24', floorColor: '#261705',
    corridorEntry: { x: 1900, y: 590 },
    nearJunctionIdx: 2, // NE
  },
  {
    id: 'stage-marketing',
    name: 'Marketing Hub',
    deptTitle: 'GROWTH & TRACTION',
    mentorName: 'Marketing & Growth Team',
    mentorRole: 'E-Cell Marketing Team',
    mentorAvatar: '📈',
    code: 'ROOM 05',
    x: 1960, y: 860, w: 360, h: 300,
    doorX: 1960, doorY: 1010, doorSide: 'west',
    mentorX: 2170, mentorY: 1010,
    color: '#10B981', secondaryColor: '#34D399', floorColor: '#062419',
    corridorEntry: { x: 1900, y: 1010 },
    nearJunctionIdx: 5, // SE
  },
  {
    id: 'stage-media',
    name: 'Media Studio',
    deptTitle: 'VIDEO & PODCAST PRODUCTION',
    mentorName: 'Media & Production Team',
    mentorRole: 'E-Cell Media Team',
    mentorAvatar: '🎬',
    code: 'ROOM 06',
    x: 1320, y: 1260, w: 440, h: 280,
    doorX: 1540, doorY: 1260, doorSide: 'north',
    mentorX: 1540, mentorY: 1400,
    color: '#EC4899', secondaryColor: '#F472B6', floorColor: '#290c1f',
    corridorEntry: { x: 1540, y: 1200 },
    nearJunctionIdx: 7, // S_CTR
  },
  {
    id: 'stage-pr',
    name: 'PR War Room',
    deptTitle: 'CRISIS PR & DEFENSE',
    mentorName: 'PR & Crisis Team',
    mentorRole: 'E-Cell PR Team',
    mentorAvatar: '🚨',
    code: 'ROOM 07',
    x: 640, y: 1260, w: 440, h: 280,
    doorX: 860, doorY: 1260, doorSide: 'north',
    mentorX: 860, mentorY: 1400,
    color: '#F43F5E', secondaryColor: '#FB7185', floorColor: '#2b0c13',
    corridorEntry: { x: 860, y: 1200 },
    nearJunctionIdx: 7, // S_CTR
  },
  {
    id: 'stage-sponsorship',
    name: 'Investor Suite',
    deptTitle: 'VENTURE TREASURY & SYNDICATE',
    mentorName: 'Investor Relations Team',
    mentorRole: 'E-Cell Venture Syndicate',
    mentorAvatar: '🤝',
    code: 'ROOM 08',
    x: 80, y: 860, w: 360, h: 300,
    doorX: 440, doorY: 1010, doorSide: 'east',
    mentorX: 230, mentorY: 1010,
    color: '#EAB308', secondaryColor: '#FDE047', floorColor: '#262007',
    corridorEntry: { x: 500, y: 1010 },
    nearJunctionIdx: 4, // SW
  },
  {
    id: 'stage-pitch',
    name: 'Grand Pitch Arena',
    deptTitle: 'MAIN AUDITORIUM & DEMO STAGE',
    mentorName: 'VC Judging Panel',
    mentorRole: 'Angel & VC Syndicate',
    mentorAvatar: '🏛️',
    code: 'MAIN HALL',
    x: 920, y: 600, w: 560, h: 400,
    doorX: 1200, doorY: 600, doorSide: 'north',
    mentorX: 1200, mentorY: 760,
    color: '#00F0FF', secondaryColor: '#38BDF8', floorColor: '#09152b',
    corridorEntry: { x: 1200, y: 400 },
    nearJunctionIdx: 1, // N_CTR
  },
];

const ROOM_RECTS: WalkRect[] = ROOMS.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h }));

// Doorway connectors bridge rooms to corridors (walkable transition zones with generous overlap)
const DOOR_CONNECTORS: WalkRect[] = [
  { x: 380, y: 540, w: 120, h: 100 },  // D1: R1 (Mentorship) -> West corridor
  { x: 800, y: 280, w: 120, h: 120 },  // D2: R2 (Tech Lab) -> North corridor
  { x: 1480, y: 280, w: 120, h: 120 }, // D3: R3 (Design) -> North corridor
  { x: 1900, y: 540, w: 120, h: 100 }, // D4: R4 (Content) -> East corridor
  { x: 1900, y: 960, w: 120, h: 100 }, // D5: R5 (Marketing) -> East corridor
  { x: 1480, y: 1200, w: 120, h: 120 },// D6: R6 (Media) -> South corridor
  { x: 800, y: 1200, w: 120, h: 120 }, // D7: R7 (PR) -> South corridor
  { x: 380, y: 960, w: 120, h: 100 },  // D8: R8 (Investor) -> West corridor
  { x: 1140, y: 540, w: 120, h: 120 }, // D9N: R9 (Pitch Arena) -> North connector
  { x: 1140, y: 940, w: 120, h: 120 }, // D9S: R9 (Pitch Arena) -> South connector
];

const ALL_WALKABLE: WalkRect[] = [...CORRIDORS, ...ROOM_RECTS, ...DOOR_CONNECTORS];

// Corridor junction graph nodes for waypoint routing
const JUNCTIONS = [
  { x: 500, y: 400 },   // 0: NW
  { x: 1200, y: 400 },  // 1: N_CTR
  { x: 1900, y: 400 },  // 2: NE
  { x: 500, y: 800 },   // 3: W_MID (Central concourse)
  { x: 500, y: 1200 },  // 4: SW
  { x: 1900, y: 1200 }, // 5: SE
  { x: 1900, y: 800 },  // 6: E_MID (Central concourse)
  { x: 1200, y: 1200 }, // 7: S_CTR
];

// Adjacency graph for corridor navigation
const GRAPH: { [key: number]: number[] } = {
  0: [1, 3],       // NW -> N_CTR, W_MID
  1: [0, 2],       // N_CTR -> NW, NE
  2: [1, 6],       // NE -> N_CTR, E_MID
  3: [0, 4, 6],    // W_MID -> NW, SW, E_MID (via Central Concourse)
  4: [3, 7],       // SW -> W_MID, S_CTR
  5: [6, 7],       // SE -> E_MID, S_CTR
  6: [2, 3, 5],    // E_MID -> NE, W_MID, SE
  7: [4, 5],       // S_CTR -> SW, SE
};

// ============================================================
// WALKABILITY & GRAPH PATHFINDING
// ============================================================
function isWalkable(px: number, py: number): boolean {
  const m = 6; // margin from walls
  for (const r of ALL_WALKABLE) {
    if (px >= r.x + m && px <= r.x + r.w - m && py >= r.y + m && py <= r.y + r.h - m) return true;
  }
  return false;
}

function getCurrentRoomIdx(x: number, y: number): number {
  for (let i = 0; i < ROOM_RECTS.length; i++) {
    const rr = ROOM_RECTS[i];
    if (x >= rr.x && x <= rr.x + rr.w && y >= rr.y && y <= rr.y + rr.h) return i;
  }
  return -1;
}

function getNearestJunction(x: number, y: number): number {
  let best = 0, bestD = Infinity;
  JUNCTIONS.forEach((j, i) => {
    const d = Math.hypot(x - j.x, y - j.y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

// BFS shortest path across corridor junctions
function findJunctionPath(fromJ: number, toJ: number): number[] {
  if (fromJ === toJ) return [fromJ];
  const queue: { node: number; path: number[] }[] = [{ node: fromJ, path: [fromJ] }];
  const visited = new Set<number>([fromJ]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.node === toJ) return cur.path;

    const neighbors = GRAPH[cur.node] || [];
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push({ node: n, path: [...cur.path, n] });
      }
    }
  }
  return [toJ];
}

// Raycast line-of-sight test to check if direct diagonal traversal is unobstructed
function isLineWalkable(x1: number, y1: number, x2: number, y2: number, stepSize = 12): boolean {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  if (dist < 1) return true;
  const steps = Math.ceil(dist / stepSize);
  for (let s = 1; s <= steps; s++) {
    const t = s / steps;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    if (!isWalkable(px, py)) return false;
  }
  return true;
}

// String-pulling path smoother to enable smooth diagonal shortcuts across open hallways
function smoothPath(rawWp: { x: number; y: number }[]): { x: number; y: number }[] {
  if (rawWp.length <= 2) return rawWp;
  const smoothed: { x: number; y: number }[] = [rawWp[0]];
  let currentIdx = 0;

  while (currentIdx < rawWp.length - 1) {
    let furthestIdx = currentIdx + 1;
    for (let testIdx = rawWp.length - 1; testIdx > currentIdx + 1; testIdx--) {
      if (isLineWalkable(smoothed[smoothed.length - 1].x, smoothed[smoothed.length - 1].y, rawWp[testIdx].x, rawWp[testIdx].y)) {
        furthestIdx = testIdx;
        break;
      }
    }
    smoothed.push(rawWp[furthestIdx]);
    currentIdx = furthestIdx;
  }
  return smoothed;
}

// Full path computation: avatar walks from current position -> door -> corridors -> target door -> INSIDE to mentor!
function computeAutoPath(fromX: number, fromY: number, targetIdx: number): { x: number; y: number }[] {
  const target = ROOMS[targetIdx];
  const wp: { x: number; y: number }[] = [];
  const inRoom = getCurrentRoomIdx(fromX, fromY);

  // If already in target room, walk directly to mentor
  if (inRoom === targetIdx) {
    wp.push({ x: target.mentorX, y: target.mentorY });
    return wp;
  }

  // Step 1: If in another room, walk to that room's door, then corridor entry
  let startJ: number;
  if (inRoom >= 0) {
    if (inRoom === 8) {
      wp.push({ x: 1200, y: 600 });
      wp.push({ x: 1200, y: 540 });
      wp.push({ x: 1200, y: 400 });
      startJ = 1;
    } else {
      wp.push({ x: ROOMS[inRoom].doorX, y: ROOMS[inRoom].doorY });
      wp.push(ROOMS[inRoom].corridorEntry);
      startJ = ROOMS[inRoom].nearJunctionIdx;
    }
  } else {
    startJ = getNearestJunction(fromX, fromY);
  }

  // Step 2: Route through corridor graph to target room's near junction
  const targetJ = target.nearJunctionIdx;
  const jPath = findJunctionPath(startJ, targetJ);
  jPath.forEach(jIdx => wp.push(JUNCTIONS[jIdx]));

  // Step 3: Walk to target corridor entry, door, then inside to mentor
  if (targetIdx === 8) {
    wp.push({ x: 1200, y: 400 });
    wp.push({ x: 1200, y: 540 });
    wp.push({ x: 1200, y: 600 });
    wp.push({ x: 1200, y: 760 });
  } else {
    wp.push(target.corridorEntry);
    wp.push({ x: target.doorX, y: target.doorY });
    wp.push({ x: target.mentorX, y: target.mentorY });
  }

  const fullRaw = [{ x: fromX, y: fromY }, ...wp];
  const smoothed = smoothPath(fullRaw);
  if (smoothed.length > 1 && Math.hypot(smoothed[0].x - fromX, smoothed[0].y - fromY) < 5) {
    return smoothed.slice(1);
  }
  return smoothed;
}

// ============================================================
// COMPONENT
// ============================================================
export const CampusCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    currentStageIndex,
    chosenStartup,
    phase,
    floatingDeltas,
    proceedFromMapToStage,
    stats,
  } = useGame();

  // Player state — spawn at NW Reception corridor
  const avatarPos = useRef({ x: 500, y: 400 });
  const targetPos = useRef({ x: 500, y: 400 });
  const velocity = useRef({ x: 0, y: 0 });
  const facingScale = useRef(1);
  const keysDown = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const avatarDir = useRef<'left' | 'right'>('right');
  const walkCycle = useRef(0);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const clickMarker = useRef<ClickMarker | null>(null);
  const camera = useRef({ x: 500, y: 400 });

  // Auto-walk
  const autoWP = useRef<{ x: number; y: number }[]>([]);
  const autoIdx = useRef(0);

  // Interaction zone
  const [isNearActiveMentor, setIsNearActiveMentor] = useState(false);
  const [nearWrongMentorIdx, setNearWrongMentorIdx] = useState<number | null>(null);
  const [wrongMentorNotice, setWrongMentorNotice] = useState<WrongMentorGuidance | null>(null);

  // Animated sliding blast doors for all 9 rooms (0.0 = closed, 1.0 = fully open)
  const doorAnimRef = useRef<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Camera drag & zoom
  const isManualCamera = useRef(false);
  const [showRecenter, setShowRecenter] = useState(false);
  const dragStartClient = useRef({ x: 0, y: 0 });
  const cameraStartDrag = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  const hasDraggedMap = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [zoomDisplay, setZoomDisplay] = useState<number>(1.4);
  const zoomFactorRef = useRef<number>(1.4);
  const targetZoomFactor = useRef<number>(1.4);

  // HUD refs
  const needleRef = useRef<HTMLDivElement | null>(null);
  const distanceRef = useRef<HTMLSpanElement | null>(null);

  const currentRoom = ROOMS[currentStageIndex] || ROOMS[0];
  const targetMentorPos = { x: currentRoom.mentorX, y: currentRoom.mentorY };

  // -----------------------------------------------------------
  // Check proximity to mentor for interaction trigger (Active & Wrong mentors)
  // -----------------------------------------------------------
  useEffect(() => {
    const check = setInterval(() => {
      if (phase === 'map_journey') {
        const dActive = Math.hypot(avatarPos.current.x - targetMentorPos.x, avatarPos.current.y - targetMentorPos.y);
        const nearActive = dActive <= 80;
        setIsNearActiveMentor(nearActive);

        let nearWrong: number | null = null;
        if (!nearActive) {
          for (let i = 0; i < ROOMS.length; i++) {
            if (i === currentStageIndex) continue;
            const dw = Math.hypot(avatarPos.current.x - ROOMS[i].mentorX, avatarPos.current.y - ROOMS[i].mentorY);
            if (dw <= 80) {
              nearWrong = i;
              break;
            }
          }
        }
        setNearWrongMentorIdx(nearWrong);

        // If auto-walking and arrived at active mentor, initiate dialogue
        if (autoWP.current.length > 0 && autoIdx.current >= autoWP.current.length && dActive <= 70) {
          autoWP.current = [];
          autoIdx.current = 0;
          proceedFromMapToStage();
          sound.playPositive();
        }
      } else {
        setIsNearActiveMentor(false);
        setNearWrongMentorIdx(null);
      }
    }, 120);
    return () => clearInterval(check);
  }, [phase, currentStageIndex, targetMentorPos.x, targetMentorPos.y, proceedFromMapToStage]);


  // Floating stat popups
  useEffect(() => {
    if (floatingDeltas.length > 0) {
      const latest = floatingDeltas[floatingDeltas.length - 1];
      floatingTexts.current.push({
        id: Math.random().toString(),
        x: avatarPos.current.x,
        y: avatarPos.current.y - 48,
        text: latest.text,
        color: latest.type === 'positive' ? '#10B981' : latest.type === 'negative' ? '#F43F5E' : '#00F0FF',
        alpha: 1,
        vy: -1.2,
      });
    }
  }, [floatingDeltas]);

  // -----------------------------------------------------------
  // Zoom helpers
  // -----------------------------------------------------------
  const getEffectiveZoom = (w: number, h: number, factor: number = zoomFactorRef.current) => {
    return Math.max(w / ARENA_W, h / ARENA_H) * factor;
  };
  const zoomIn = () => {
    sound.playClick();
    const n = Math.min(2.8, Math.round((targetZoomFactor.current + 0.2) * 10) / 10);
    targetZoomFactor.current = n;
    setZoomDisplay(n);
  };
  const zoomOut = () => {
    sound.playClick();
    const n = Math.max(0.8, Math.round((targetZoomFactor.current - 0.2) * 10) / 10);
    targetZoomFactor.current = n;
    setZoomDisplay(n);
  };
  const resetZoom = () => {
    sound.playClick();
    targetZoomFactor.current = 1.4;
    setZoomDisplay(1.4);
    isManualCamera.current = false;
    setShowRecenter(false);
  };
  const fitArena = () => {
    sound.playClick();
    targetZoomFactor.current = 0.95;
    setZoomDisplay(0.95);
  };

  // Clamp camera with generous padding so rooms at top, bottom, and edges are fully in view
  const clampCam = (cx: number, cy: number, cw: number, ch: number, z: number) => {
    const hw = cw / z / 2, hh = ch / z / 2;
    const padX = 260;
    const padY = 260;
    const minX = hw - padX, maxX = ARENA_W - hw + padX;
    const minY = hh - padY, maxY = ARENA_H - hh + padY;
    return {
      x: minX <= maxX ? Math.max(minX, Math.min(maxX, cx)) : ARENA_W / 2,
      y: minY <= maxY ? Math.max(minY, Math.min(maxY, cy)) : ARENA_H / 2,
    };
  };

  // Mouse-wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const w = canvas.width, h = canvas.height;
      if (!w || !h) return;
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      const cur = targetZoomFactor.current;
      const next = Math.max(0.75, Math.min(2.4, Math.round((cur + delta) * 10) / 10));
      if (next === cur) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      const baseFit = Math.max(w / ARENA_W, h / ARENA_H);
      const oldEff = baseFit * zoomFactorRef.current;
      const wx = (sx - w / 2) / oldEff + camera.current.x;
      const wy = (sy - h / 2) / oldEff + camera.current.y;
      const newEff = baseFit * next;
      const c = clampCam(wx - (sx - w / 2) / newEff, wy - (sy - h / 2) / newEff, w, h, newEff);
      camera.current.x = c.x; camera.current.y = c.y;
      targetZoomFactor.current = next; setZoomDisplay(next);
      isManualCamera.current = true; setShowRecenter(true);
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  // -----------------------------------------------------------
  // Pointer handlers (drag + click-to-walk)
  // -----------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    hasDraggedMap.current = false;
    dragStartClient.current = { x: e.clientX, y: e.clientY };
    cameraStartDrag.current = { x: camera.current.x, y: camera.current.y };
    setIsGrabbing(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const mdx = e.clientX - dragStartClient.current.x;
    const mdy = e.clientY - dragStartClient.current.y;
    if (Math.abs(mdx) > 8 || Math.abs(mdy) > 8) hasDraggedMap.current = true;
    if (hasDraggedMap.current) {
      const canvas = canvasRef.current; if (!canvas) return;
      const w = canvas.width, h = canvas.height;
      const zoom = getEffectiveZoom(w, h);
      isManualCamera.current = true; setShowRecenter(true);
      const c = clampCam(
        cameraStartDrag.current.x - mdx / zoom,
        cameraStartDrag.current.y - mdy / zoom, w, h, zoom,
      );
      camera.current.x = c.x; camera.current.y = c.y;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    setIsGrabbing(false);
    if (!hasDraggedMap.current && phase === 'map_journey') {
      handleCanvasClick(e.clientX, e.clientY);
    }
  };

  const handlePointerLeave = () => {
    isPointerDown.current = false;
    setIsGrabbing(false);
  };

  const handleCanvasClick = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left, sy = clientY - rect.top;
    const zoom = getEffectiveZoom(canvas.width, canvas.height);
    const wx = (sx - canvas.width / 2) / zoom + camera.current.x;
    const wy = (sy - canvas.height / 2) / zoom + camera.current.y;

    // Check if clicked directly on a room mentor
    for (let i = 0; i < ROOMS.length; i++) {
      const r = ROOMS[i];
      if (Math.hypot(wx - r.mentorX, wy - r.mentorY) < 50) {
        if (i === currentStageIndex) {
          const d = Math.hypot(avatarPos.current.x - r.mentorX, avatarPos.current.y - r.mentorY);
          if (d <= 80) {
            proceedFromMapToStage();
            sound.playMentorGreet();
            return;
          } else {
            // Auto-walk to this mentor
            const path = computeAutoPath(avatarPos.current.x, avatarPos.current.y, i);
            autoWP.current = path;
            autoIdx.current = 0;
            sound.playAutoRoute();
            return;
          }
        } else {
          // Clicked on wrong/inactive mentor -> Provide direction!
          const advice = getWrongMentorAdvice(i, currentStageIndex);
          setWrongMentorNotice(advice);
          sound.playWrongMentorWarn();
          floatingTexts.current.push({
            id: Math.random().toString(),
            x: r.mentorX,
            y: r.mentorY - 48,
            text: `⚠️ REPORT TO ${ROOMS[currentStageIndex].code}!`,
            color: '#FACC15',
            alpha: 1,
            vy: -1.2,
          });
          return;
        }
      }
    }

    // Otherwise walk toward destination point
    targetPos.current = { x: wx, y: wy };
    clickMarker.current = { x: wx, y: wy, radius: 4, alpha: 1 };
    sound.playClick();
    autoWP.current = [];
    autoIdx.current = 0;
    isManualCamera.current = false;
    setShowRecenter(false);
  };

  // -----------------------------------------------------------
  // Keyboard navigation & interaction (Continuous multi-key tracking)
  // -----------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') { zoomIn(); return; }
      if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') { zoomOut(); return; }
      if (e.key === '0' || e.code === 'Numpad0') { resetZoom(); return; }

      if (phase !== 'map_journey') return;

      // 'E' or Space to interact with mentor if in range
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        const d = Math.hypot(avatarPos.current.x - targetMentorPos.x, avatarPos.current.y - targetMentorPos.y);
        if (d <= 80) {
          e.preventDefault();
          proceedFromMapToStage();
          sound.playMentorGreet();
          return;
        }

        // Check if interacting near wrong mentor
        if (nearWrongMentorIdx !== null) {
          e.preventDefault();
          const advice = getWrongMentorAdvice(nearWrongMentorIdx, currentStageIndex);
          setWrongMentorNotice(advice);
          sound.playWrongMentorWarn();
          floatingTexts.current.push({
            id: Math.random().toString(),
            x: ROOMS[nearWrongMentorIdx].mentorX,
            y: ROOMS[nearWrongMentorIdx].mentorY - 48,
            text: `⚠️ GO TO ${ROOMS[currentStageIndex].code}!`,
            color: '#FACC15',
            alpha: 1,
            vy: -1.2,
          });
          return;
        }
      }

      let handled = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { keysDown.current.up = true; handled = true; }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { keysDown.current.down = true; handled = true; }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { keysDown.current.left = true; handled = true; }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { keysDown.current.right = true; handled = true; }

      if (handled) {
        autoWP.current = [];
        autoIdx.current = 0;
        isManualCamera.current = false;
        setShowRecenter(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysDown.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysDown.current.down = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysDown.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysDown.current.right = false;
    };

    const handleBlur = () => {
      keysDown.current = { up: false, down: false, left: false, right: false };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, currentStageIndex, nearWrongMentorIdx, targetMentorPos.x, targetMentorPos.y, proceedFromMapToStage]);

  // ============================================================
  // MAIN 60 FPS RENDER LOOP
  // ============================================================
  useEffect(() => {
    let animId: number;
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
      const width = canvas.width, height = canvas.height;

      // ---- CONTINUOUS MOVEMENT & VELOCITY EASING ----
      const MAX_SPEED = 5.8;
      const ACCEL = 0.28;
      const FRICTION = 0.78;

      let targetVx = 0;
      let targetVy = 0;

      // 1. Continuous multi-key diagonal steering (normalized diagonal speed)
      const kx = (keysDown.current.right ? 1 : 0) - (keysDown.current.left ? 1 : 0);
      const ky = (keysDown.current.down ? 1 : 0) - (keysDown.current.up ? 1 : 0);
      const isKeyboardActive = kx !== 0 || ky !== 0;

      if (isKeyboardActive) {
        const kLen = Math.hypot(kx, ky);
        targetVx = (kx / kLen) * MAX_SPEED;
        targetVy = (ky / kLen) * MAX_SPEED;
        targetPos.current = { x: avatarPos.current.x, y: avatarPos.current.y };
      }
      // 2. Auto-walk waypoint pathfinding with lookahead diagonal corner blending
      else if (autoWP.current.length > 0 && autoIdx.current < autoWP.current.length) {
        const currentWp = autoWP.current[autoIdx.current];
        const nextWp = autoIdx.current + 1 < autoWP.current.length ? autoWP.current[autoIdx.current + 1] : null;

        const dToCurrent = Math.hypot(currentWp.x - avatarPos.current.x, currentWp.y - avatarPos.current.y);

        let dirX = (currentWp.x - avatarPos.current.x) / (dToCurrent || 1);
        let dirY = (currentWp.y - avatarPos.current.y) / (dToCurrent || 1);

        // Smooth curved corner easing when approaching waypoint with predictive lookahead
        if (nextWp && dToCurrent < 48) {
          const dNextX = nextWp.x - currentWp.x;
          const dNextY = nextWp.y - currentWp.y;
          const nextLen = Math.hypot(dNextX, dNextY) || 1;
          const blend = Math.max(0, (48 - dToCurrent) / 48) * 0.6;
          dirX = dirX * (1 - blend) + (dNextX / nextLen) * blend;
          dirY = dirY * (1 - blend) + (dNextY / nextLen) * blend;
          const blendedLen = Math.hypot(dirX, dirY) || 1;
          dirX /= blendedLen;
          dirY /= blendedLen;
        }

        const isLastWp = autoIdx.current === autoWP.current.length - 1;
        const arriveSpeed = isLastWp ? Math.min(MAX_SPEED, Math.max(1.8, dToCurrent * 0.14)) : MAX_SPEED;

        targetVx = dirX * arriveSpeed;
        targetVy = dirY * arriveSpeed;

        if (dToCurrent < 24) {
          autoIdx.current++;
          if (autoIdx.current >= autoWP.current.length) {
            autoWP.current = [];
            autoIdx.current = 0;
          }
        }
      }
      // 3. Click-to-move destination
      else {
        const dX = targetPos.current.x - avatarPos.current.x;
        const dY = targetPos.current.y - avatarPos.current.y;
        const distToTarget = Math.hypot(dX, dY);

        if (distToTarget > 3) {
          const moveSpeed = Math.min(MAX_SPEED, Math.max(1.4, distToTarget * 0.14));
          targetVx = (dX / distToTarget) * moveSpeed;
          targetVy = (dY / distToTarget) * moveSpeed;
        }
      }

      // Smooth acceleration / deceleration
      if (Math.hypot(targetVx, targetVy) > 0.1) {
        velocity.current.x += (targetVx - velocity.current.x) * ACCEL;
        velocity.current.y += (targetVy - velocity.current.y) * ACCEL;
      } else {
        velocity.current.x *= FRICTION;
        velocity.current.y *= FRICTION;
        if (Math.hypot(velocity.current.x, velocity.current.y) < 0.04) {
          velocity.current.x = 0;
          velocity.current.y = 0;
        }
      }

      const vx = velocity.current.x;
      const vy = velocity.current.y;
      const actualSpeed = Math.hypot(vx, vy);

      // Continuous sub-stepped displacement with diagonal momentum deflection & corner nudging
      if (actualSpeed > 0.01) {
        const subSteps = 2;
        const svx = vx / subSteps;
        const svy = vy / subSteps;

        for (let step = 0; step < subSteps; step++) {
          const cx = avatarPos.current.x;
          const cy = avatarPos.current.y;
          const stepNx = cx + svx;
          const stepNy = cy + svy;

          if (isWalkable(stepNx, stepNy)) {
            avatarPos.current.x = stepNx;
            avatarPos.current.y = stepNy;
          } else {
            const canX = isWalkable(stepNx, cy);
            const canY = isWalkable(cx, stepNy);

            if (canX && !canY) {
              // Blocked vertically, gliding horizontally (e.g. against top or bottom wall)
              avatarPos.current.x = stepNx;
              // Momentum deflection: transfer unblocked vector energy to maintain full glide speed
              if (isKeyboardActive && kx !== 0) {
                velocity.current.x = Math.sign(kx) * Math.min(MAX_SPEED, Math.abs(velocity.current.x) + 0.35);
              }
              velocity.current.y *= 0.15;
            } else if (canY && !canX) {
              // Blocked horizontally, gliding vertically (e.g. against left or right wall)
              avatarPos.current.y = stepNy;
              // Momentum deflection: transfer unblocked vector energy to maintain full glide speed
              if (isKeyboardActive && ky !== 0) {
                velocity.current.y = Math.sign(ky) * Math.min(MAX_SPEED, Math.abs(velocity.current.y) + 0.35);
              }
              velocity.current.x *= 0.15;
            } else if (canX && canY) {
              // Corner apex graze: pick dominant velocity component
              if (Math.abs(svx) >= Math.abs(svy)) {
                avatarPos.current.x = stepNx;
                if (isWalkable(stepNx, cy + svy * 0.5)) avatarPos.current.y += svy * 0.5;
              } else {
                avatarPos.current.y = stepNy;
                if (isWalkable(cx + svx * 0.5, stepNy)) avatarPos.current.x += svx * 0.5;
              }
            } else {
              // Corner nudging probe (±3, ±6) to slide around sharp corner junctions
              let nudged = false;
              if (Math.abs(svx) > 0.1) {
                for (const nudge of [-3, 3, -6, 6]) {
                  if (isWalkable(stepNx, cy + nudge)) {
                    avatarPos.current.x = stepNx;
                    avatarPos.current.y += nudge * 0.25;
                    nudged = true;
                    break;
                  }
                }
              }
              if (!nudged && Math.abs(svy) > 0.1) {
                for (const nudge of [-3, 3, -6, 6]) {
                  if (isWalkable(cx + nudge, stepNy)) {
                    avatarPos.current.y = stepNy;
                    avatarPos.current.x += nudge * 0.25;
                    nudged = true;
                    break;
                  }
                }
              }
              if (!nudged) {
                if (isWalkable(cx + svx * 0.4, cy)) avatarPos.current.x += svx * 0.4;
                if (isWalkable(cx, cy + svy * 0.4)) avatarPos.current.y += svy * 0.4;
                velocity.current.x *= 0.5;
                velocity.current.y *= 0.5;
              }
            }
          }
        }

        const prevCycle = walkCycle.current;
        walkCycle.current += actualSpeed * 0.038;
        if (actualSpeed > 0.6 && Math.floor(walkCycle.current * 2.2) !== Math.floor(prevCycle * 2.2)) {
          sound.playFootstep();
        }

        if (Math.abs(vx) > 0.2) {
          avatarDir.current = vx < 0 ? 'left' : 'right';
        }

        if (Math.random() < 0.22 && actualSpeed > 0.6) {
          const pAngle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.7;
          const pSpeed = Math.random() * 1.5 + 0.5;
          particles.current.push({
            x: avatarPos.current.x + (Math.random() - 0.5) * 6,
            y: avatarPos.current.y + 12,
            vx: Math.cos(pAngle) * pSpeed,
            vy: Math.sin(pAngle) * pSpeed,
            size: Math.random() * 2.2 + 1.2,
            alpha: 0.38,
            color: chosenStartup?.id === 'plantspeak' ? '#34D399' : chosenStartup?.id === 'campuseats' ? '#FB923C' : '#38BDF8'
          });
        }
      } else {
        walkCycle.current *= 0.85;
      }

      // Smooth facing transition
      const targetFacing = avatarDir.current === 'left' ? -1 : 1;
      facingScale.current += (targetFacing - facingScale.current) * 0.28;

      // Smooth camera follow with velocity lookahead
      if (!isManualCamera.current) {
        const lookX = avatarPos.current.x + vx * 12;
        const lookY = avatarPos.current.y + vy * 12;
        camera.current.x += (lookX - camera.current.x) * 0.085;
        camera.current.y += (lookY - camera.current.y) * 0.085;
      }
      zoomFactorRef.current += (targetZoomFactor.current - zoomFactorRef.current) * 0.12;
      const zoom = getEffectiveZoom(width, height, zoomFactorRef.current);
      const cc = clampCam(camera.current.x, camera.current.y, width, height, zoom);
      camera.current.x = cc.x;
      camera.current.y = cc.y;

      // ---- COMPASS HUD UPDATE ----
      const distToMentor = Math.hypot(targetMentorPos.x - avatarPos.current.x, targetMentorPos.y - avatarPos.current.y);
      const navAngle = Math.atan2(targetMentorPos.y - avatarPos.current.y, targetMentorPos.x - avatarPos.current.x);
      if (needleRef.current) needleRef.current.style.transform = `rotate(${Math.round((navAngle * 180) / Math.PI)}deg)`;
      if (distanceRef.current) distanceRef.current.innerText = `${Math.round(distToMentor)}m`;

      // ============================================================
      // DRAWING
      // ============================================================
      ctx.save();
      ctx.fillStyle = '#030610';
      ctx.fillRect(0, 0, width, height);

      // Camera transform
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camera.current.x, -camera.current.y);

      // ============================================================
      // SCI-FI STARSHIP ORBITAL DECK BACKGROUND
      // ============================================================
      // 1. Deep Space Cosmic Void
      ctx.fillStyle = '#010207';
      ctx.fillRect(0, 0, ARENA_W, ARENA_H);

      // 2. Cosmic Nebula Clouds (Multi-spectrum interstellar gas clouds)
      ctx.save();
      // NW Nebula (Orion Violet & Magenta Gas)
      const nebNW = ctx.createRadialGradient(480, 320, 40, 480, 320, 520);
      nebNW.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
      nebNW.addColorStop(0.5, 'rgba(236, 72, 153, 0.10)');
      nebNW.addColorStop(1, 'transparent');
      ctx.fillStyle = nebNW;
      ctx.fillRect(0, 0, 1100, 750);

      // NE Nebula (Cygnus Electric Cyan & Teal Gas)
      const nebNE = ctx.createRadialGradient(1920, 320, 40, 1920, 320, 560);
      nebNE.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      nebNE.addColorStop(0.5, 'rgba(14, 165, 233, 0.09)');
      nebNE.addColorStop(1, 'transparent');
      ctx.fillStyle = nebNE;
      ctx.fillRect(1300, 0, 1100, 750);

      // SW Nebula (Helios Golden Stellar Plasma)
      const nebSW = ctx.createRadialGradient(480, 1280, 40, 480, 1280, 500);
      nebSW.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
      nebSW.addColorStop(0.5, 'rgba(251, 191, 36, 0.06)');
      nebSW.addColorStop(1, 'transparent');
      ctx.fillStyle = nebSW;
      ctx.fillRect(0, 850, 1100, 750);

      // SE Nebula (Supernova Magenta & Purple Gas)
      const nebSE = ctx.createRadialGradient(1920, 1280, 40, 1920, 1280, 520);
      nebSE.addColorStop(0, 'rgba(236, 72, 153, 0.20)');
      nebSE.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      nebSE.addColorStop(1, 'transparent');
      ctx.fillStyle = nebSE;
      ctx.fillRect(1300, 850, 1100, 750);

      // Center Core Warp Field Nebula
      const nebCTR = ctx.createRadialGradient(1200, 800, 50, 1200, 800, 750);
      nebCTR.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
      nebCTR.addColorStop(0.6, 'rgba(0, 240, 255, 0.05)');
      nebCTR.addColorStop(1, 'transparent');
      ctx.fillStyle = nebCTR;
      ctx.fillRect(400, 200, 1600, 1200);
      ctx.restore();

      // 3. Twinkling Starfield & Diffraction Spikes
      ctx.save();
      STARS.forEach(st => {
        const twinkle = 0.35 + 0.65 * Math.sin(time * st.speed + st.phase);
        ctx.fillStyle = st.color;
        ctx.globalAlpha = Math.max(0.12, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();

        if (st.hasSpikes && twinkle > 0.55) {
          ctx.strokeStyle = st.color;
          ctx.lineWidth = 0.8;
          const spikeLen = st.r * 4.5 * twinkle;
          ctx.beginPath();
          ctx.moveTo(st.x - spikeLen, st.y); ctx.lineTo(st.x + spikeLen, st.y);
          ctx.moveTo(st.x, st.y - spikeLen); ctx.lineTo(st.x, st.y + spikeLen);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      ctx.restore();

      // 4. Solar Radiation Telemetry Grid & Starship Nav Coordinates
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < ARENA_W; gx += 280) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx + 360, ARENA_H); ctx.stroke();
      }
      for (let gy = 0; gy < ARENA_H; gy += 280) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(ARENA_W, gy - 360); ctx.stroke();
      }

      // Starship Orbital Flight Deck HUD Telemetry Watermarks
      ctx.font = '900 11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ ORBITAL STATION // SOA-INCUBATOR-01', 90, 110);
      ctx.fillText('🛰️ GEO-SYNC ORBIT: 35,786 KM  •  INCLINATION: 0.0°', 90, 126);
      ctx.fillText('📡 SUB-SPACE TELEMETRY: LINKED [99.9% OPTIMAL]', 90, 142);

      ctx.textAlign = 'right';
      ctx.fillText('WARP CONVERGENCE: STABLE 1.00c 🌌', ARENA_W - 90, 110);
      ctx.fillText('GRAV-FIELD DAMPENER: ACTIVE // 1.00G ⚙️', ARENA_W - 90, 126);
      ctx.fillText('DECK SECTION: STARSHIP INDUSTRIAL HULL 🛡️', ARENA_W - 90, 142);
      ctx.restore();

      // 5. Modular Starship Hull Armor Plating (Base under facility structure)
      ctx.save();
      ctx.fillStyle = '#060a16';
      ctx.beginPath();
      ctx.roundRect(60, 60, ARENA_W - 120, ARENA_H - 120, 24);
      ctx.fill();

      // Hull Seam Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1.5;
      for (let hx = 120; hx < ARENA_W - 100; hx += 160) {
        ctx.beginPath(); ctx.moveTo(hx, 60); ctx.lineTo(hx, ARENA_H - 60); ctx.stroke();
      }
      for (let hy = 120; hy < ARENA_H - 100; hy += 160) {
        ctx.beginPath(); ctx.moveTo(60, hy); ctx.lineTo(ARENA_W - 60, hy); ctx.stroke();
      }
      ctx.restore();

      // ---- LAYER 0: SUB-DECK PLASMA ENERGY CONDUITS & HYPER-DRIVE VENTS ----
      ctx.save();
      // North & South Sub-Deck Plasma Trench Chambers
      const plasmaNorthGrad = ctx.createLinearGradient(900, 520, 1500, 520);
      plasmaNorthGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      plasmaNorthGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)');
      plasmaNorthGrad.addColorStop(1, 'rgba(6, 182, 212, 0.45)');

      const plasmaSouthGrad = ctx.createLinearGradient(900, 1080, 1500, 1080);
      plasmaSouthGrad.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
      plasmaSouthGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.6)');
      plasmaSouthGrad.addColorStop(1, 'rgba(236, 72, 153, 0.45)');

      // Sub-Deck Trench Outer Recess
      ctx.fillStyle = '#030714';
      ctx.beginPath();
      ctx.ellipse(1200, 520, 270, 95, 0, 0, Math.PI * 2);
      ctx.ellipse(1200, 1080, 270, 95, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plasma Core Glow
      ctx.fillStyle = plasmaNorthGrad;
      ctx.beginPath(); ctx.ellipse(1200, 520, 240, 75, 0, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = plasmaSouthGrad;
      ctx.beginPath(); ctx.ellipse(1200, 1080, 240, 75, 0, 0, Math.PI * 2); ctx.fill();

      // West & East Auxiliary Fusion Pits
      ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.beginPath();
      ctx.ellipse(620, 500, 130, 70, -0.4, 0, Math.PI * 2);
      ctx.ellipse(620, 1100, 130, 70, 0.4, 0, Math.PI * 2);
      ctx.ellipse(1780, 500, 130, 70, 0.4, 0, Math.PI * 2);
      ctx.ellipse(1780, 1100, 130, 70, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Animated Flowing Plasma Discharge Waves
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      for (let w = 0; w < 5; w++) {
        const waveY1 = 485 + w * 18 + Math.sin(time * 3 + w) * 9;
        ctx.beginPath();
        ctx.moveTo(980, waveY1);
        ctx.bezierCurveTo(1100, waveY1 - 16, 1300, waveY1 + 16, 1420, waveY1);
        ctx.stroke();

        const waveY2 = 1045 + w * 18 + Math.sin(time * 3 + w + 1) * 9;
        ctx.beginPath();
        ctx.moveTo(980, waveY2);
        ctx.bezierCurveTo(1100, waveY2 + 16, 1300, waveY2 - 16, 1420, waveY2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Magnetic Containment Nodes & Plasma Induction Coils
      const magneticCoils = [
        { x: 1060, y: 510, r: 16 }, { x: 1140, y: 490, r: 22 }, { x: 1320, y: 530, r: 18 }, { x: 1260, y: 500, r: 14 },
        { x: 1080, y: 1090, r: 20 }, { x: 1160, y: 1110, r: 15 }, { x: 1300, y: 1070, r: 24 }, { x: 1340, y: 1100, r: 16 },
        { x: 600, y: 490, r: 18 }, { x: 650, y: 520, r: 14 }, { x: 610, y: 1090, r: 18 }, { x: 660, y: 1110, r: 14 },
        { x: 1770, y: 490, r: 18 }, { x: 1810, y: 520, r: 14 }, { x: 1760, y: 1090, r: 18 }, { x: 1820, y: 1110, r: 14 },
      ];
      magneticCoils.forEach(mc => {
        ctx.fillStyle = '#0a1426';
        ctx.beginPath(); ctx.arc(mc.x, mc.y, mc.r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 2; ctx.stroke();

        const pulse = Math.sin(time * 4 + mc.x) * 2.5;
        ctx.fillStyle = '#FACC15';
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(mc.x, mc.y, 4 + pulse * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // ---- LAYER 1: HEAVY PERIMETER FORTRESS WALLS ----
      ctx.save();
      // 1. Outer Dark Armored Base (36px thick)
      ctx.strokeStyle = '#090d1a';
      ctx.lineWidth = 36;
      ctx.beginPath();
      ctx.roundRect(36, 36, ARENA_W - 72, ARENA_H - 72, 34);
      ctx.stroke();

      // 2. Mid Illuminated Cyan Security Energy Band
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(36, 36, ARENA_W - 72, ARENA_H - 72, 34);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Inner Titanium Structural Coping (16px thick)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.roundRect(46, 46, ARENA_W - 92, ARENA_H - 92, 26);
      ctx.stroke();

      // Corner Tech Pilaster Beacons
      const cornerNodes = [
        { x: 46, y: 46 }, { x: ARENA_W - 46, y: 46 },
        { x: 46, y: ARENA_H - 46 }, { x: ARENA_W - 46, y: ARENA_H - 46 }
      ];
      cornerNodes.forEach(cn => {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cn.x, cn.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const pBlink = Math.sin(time * 5) > 0;
        ctx.fillStyle = pBlink ? '#00F0FF' : '#0284C7';
        ctx.beginPath(); ctx.arc(cn.x, cn.y, 10, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();

      // ---- LAYER 2: PROMENADES, SKYBRIDGES & ATRIUMS FLOOR BASE ----
      CORRIDORS.forEach(c => {
        // Floor tile base
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c.x, c.y, c.w, c.h);

        // Tile Grid Lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let gx = c.x + 40; gx < c.x + c.w; gx += 40) {
          ctx.beginPath(); ctx.moveTo(gx, c.y); ctx.lineTo(gx, c.y + c.h); ctx.stroke();
        }
        for (let gy = c.y + 40; gy < c.y + c.h; gy += 40) {
          ctx.beginPath(); ctx.moveTo(c.x, gy); ctx.lineTo(c.x + c.w, gy); ctx.stroke();
        }

        // Tactile neon guide strips
        ctx.fillStyle = 'rgba(56,189,248,0.12)';
        if (c.w > c.h) {
          ctx.fillRect(c.x, c.y + c.h / 2 - 2, c.w, 4);
        } else {
          ctx.fillRect(c.x + c.w / 2 - 2, c.y, 4, c.h);
        }
      });

      // Central Grand Skybridge Spine Deck & Illuminated Railings
      ctx.save();
      const skyX = 760, skyY = 740, skyW = 880, skyH = 120;
      const glassGrad = ctx.createLinearGradient(skyX, skyY, skyX, skyY + skyH);
      glassGrad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
      glassGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.95)');
      glassGrad.addColorStop(1, 'rgba(14, 165, 233, 0.25)');
      ctx.fillStyle = glassGrad;
      ctx.fillRect(skyX, skyY, skyW, skyH);

      // Overhead Suspension Arch Cables
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(skyX, skyY - 8);
      ctx.bezierCurveTo(skyX + skyW * 0.3, skyY - 60, skyX + skyW * 0.7, skyY - 60, skyX + skyW, skyY - 8);
      ctx.stroke();
      for (let sx = skyX + 80; sx < skyX + skyW; sx += 80) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, skyY); ctx.lineTo(sx, skyY + 12);
        ctx.moveTo(sx, skyY + skyH - 12); ctx.lineTo(sx, skyY + skyH);
        ctx.stroke();
      }
      ctx.restore();

      // Dual Infinity Core Atriums (Plaza Rings & Centerpieces)
      // --- WEST IDEATION ATRIUM PLAZA (center: 760, 800) ---
      ctx.save();
      const wPlazaX = 760, wPlazaY = 800;
      const wPlazaGrad = ctx.createRadialGradient(wPlazaX, wPlazaY, 20, wPlazaX, wPlazaY, 160);
      wPlazaGrad.addColorStop(0, '#0c1e3d');
      wPlazaGrad.addColorStop(0.7, '#081226');
      wPlazaGrad.addColorStop(1, '#050c1b');
      ctx.fillStyle = wPlazaGrad;
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 150, 0, Math.PI * 2); ctx.fill();

      // Thick Atrium Perimeter Wall Ring
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 150, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 145, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 95, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 50, 0, Math.PI * 2); ctx.stroke();

      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(wPlazaX + Math.cos(ang) * 50, wPlazaY + Math.sin(ang) * 50);
        ctx.lineTo(wPlazaX + Math.cos(ang) * 145, wPlazaY + Math.sin(ang) * 145);
        ctx.stroke();
      }

      // Cyber-Tree Centerpiece
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#0E7490';
      ctx.beginPath(); ctx.arc(wPlazaX, wPlazaY, 12, 0, Math.PI * 2); ctx.fill();

      const branches = [
        { dx: -24, dy: -20, col: '#38BDF8' }, { dx: 24, dy: -20, col: '#34D399' },
        { dx: -28, dy: 14, col: '#FACC15' }, { dx: 28, dy: 14, col: '#A855F7' },
        { dx: 0, dy: -28, col: '#00F0FF' }, { dx: 0, dy: 26, col: '#34D399' }
      ];
      branches.forEach(b => {
        ctx.strokeStyle = '#0891B2';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(wPlazaX, wPlazaY); ctx.lineTo(wPlazaX + b.dx, wPlazaY + b.dy); ctx.stroke();
        const pulse = Math.sin(time * 4 + b.dx) * 2;
        ctx.fillStyle = b.col;
        ctx.shadowColor = b.col;
        ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(wPlazaX + b.dx, wPlazaY + b.dy, 5 + pulse * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Atrium Floor Badge Plaque
      ctx.fillStyle = 'rgba(6, 12, 28, 0.95)';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(wPlazaX - 110, wPlazaY + 95, 220, 24, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00F0FF';
      ctx.font = '900 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ WEST IDEATION & LABS ATRIUM', wPlazaX, wPlazaY + 111);
      ctx.restore();

      // --- EAST VENTURE ATRIUM PLAZA (center: 1640, 800) ---
      ctx.save();
      const ePlazaX = 1640, ePlazaY = 800;
      const ePlazaGrad = ctx.createRadialGradient(ePlazaX, ePlazaY, 20, ePlazaX, ePlazaY, 160);
      ePlazaGrad.addColorStop(0, '#240d3a');
      ePlazaGrad.addColorStop(0.7, '#150824');
      ePlazaGrad.addColorStop(1, '#0c0517');
      ctx.fillStyle = ePlazaGrad;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 150, 0, Math.PI * 2); ctx.fill();

      // Thick Atrium Perimeter Wall Ring
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 150, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 145, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 95, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 50, 0, Math.PI * 2); ctx.stroke();

      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(ePlazaX + Math.cos(ang) * 50, ePlazaY + Math.sin(ang) * 50);
        ctx.lineTo(ePlazaX + Math.cos(ang) * 145, ePlazaY + Math.sin(ang) * 145);
        ctx.stroke();
      }

      // Venture Sphere Centerpiece
      ctx.fillStyle = '#1E1B4B';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      const rot1 = time * 1.5;
      const rot2 = -time * 1.2;
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(ePlazaX, ePlazaY, 22, 10, rot1, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#A855F7';
      ctx.beginPath(); ctx.ellipse(ePlazaX, ePlazaY, 22, 10, rot2, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = '#FACC15';
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(ePlazaX, ePlazaY, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Atrium Floor Badge Plaque
      ctx.fillStyle = 'rgba(6, 12, 28, 0.95)';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(ePlazaX - 110, ePlazaY + 95, 220, 24, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FEF08A';
      ctx.font = '900 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('💎 EAST VENTURE & CAPITAL ATRIUM', ePlazaX, ePlazaY + 111);
      ctx.restore();

      // Central Skybridge Branding Plaque (Center: 1200, 800)
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(1020, 765, 360, 70, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#00F0FF';
      ctx.font = '900 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ IEC SOA BIOMORPHIC CAMPUS', 1200, 792);
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.fillText('IDEATE  •  INNOVATE  •  INCUBATE  •  SCALE', 1200, 809);
      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillText('WEST: RESEARCH & TECH ⟷ EAST: GROWTH & VENTURE', 1200, 824);
      ctx.restore();

      // Hallway Potted Cyber Plants
      const plantNodes = [
        { x: 480, y: 350 }, { x: 1920, y: 350 },
        { x: 480, y: 1250 }, { x: 1920, y: 1250 },
        { x: 860, y: 750 }, { x: 1540, y: 750 }
      ];
      plantNodes.forEach(p => {
        ctx.fillStyle = '#0F172A';
        ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#059669';
        ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#34D399';
        ctx.beginPath(); ctx.arc(p.x - 2, p.y - 2, 4.5, 0, Math.PI * 2); ctx.fill();
      });

      // ============================================================
      // ARCHITECTURAL WALL RENDERING ENGINE
      // ============================================================
      // Multi-layered structural wall bulkhead helper
      const drawWallBulkhead = (
        x1: number, y1: number, x2: number, y2: number,
        thickness: number = 18,
        neonColor: string = '#00F0FF',
        glowBlur: number = 0,
        isParapet: boolean = false
      ) => {
        ctx.save();
        // 1. Ambient Occlusion / 2.5D Drop Shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.78)';
        ctx.lineWidth = thickness + 8;
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.moveTo(x1, y1 + 5);
        ctx.lineTo(x2, y2 + 5);
        ctx.stroke();

        // 2. Base Armored Titanium Bulkhead Casing
        ctx.strokeStyle = '#050a14';
        ctx.lineWidth = thickness;
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // 3. High-Intensity Neon Core Conduit
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = Math.max(4, Math.round(thickness * 0.38));
        if (glowBlur > 0) {
          ctx.shadowColor = neonColor;
          ctx.shadowBlur = glowBlur;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 4. Specular Top Coping Edge Bevel
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
          const offDist = thickness / 2 - 2;
          const nx = (-dy / len) * offDist;
          const ny = (dx / len) * offDist;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1 + nx, y1 + ny);
          ctx.lineTo(x2 + nx, y2 + ny);
          ctx.stroke();
        }

        // 5. Parapet vertical posts if facing canyon/courtyard
        if (isParapet && len > 40) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.5;
          const step = 40;
          const count = Math.floor(len / step);
          for (let p = 1; p < count; p++) {
            const px = x1 + (dx / len) * (p * step);
            const py = y1 + (dy / len) * (p * step);
            const perpX = (-dy / len) * (thickness / 2);
            const perpY = (dx / len) * (thickness / 2);
            ctx.beginPath();
            ctx.moveTo(px - perpX, py - perpY);
            ctx.lineTo(px + perpX, py + perpY);
            ctx.stroke();
          }
        }
        ctx.restore();
      };

      // Wall sconces helper along corridor walls
      const drawWallSconces = (
        x1: number, y1: number, x2: number, y2: number,
        spacing: number = 80,
        sconceColor: string = '#00F0FF'
      ) => {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len < spacing) return;
        const count = Math.floor(len / spacing);
        for (let i = 1; i <= count; i++) {
          const sx = x1 + (dx / len) * (i * spacing - spacing / 2);
          const sy = y1 + (dy / len) * (i * spacing - spacing / 2);
          ctx.save();
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = sconceColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = sconceColor;
          ctx.shadowColor = sconceColor;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      };

      // Corner pilaster node helper
      const drawCornerPilaster = (x: number, y: number, radius: number = 14, color: string = '#00F0FF') => {
        ctx.save();
        ctx.fillStyle = '#0a101f';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      };

      // Portal jamb pillar helper for doorway frame posts
      const drawPortalJamb = (x: number, y: number, color: string = '#FACC15') => {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(x - 9, y - 9, 18, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      };

      // Corner reinforcement bracket for rooms
      const drawCornerBracket = (x: number, y: number, color: string, isCur: boolean) => {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 10, 20, 20, 4);
        ctx.fill();
        ctx.stroke();

        // Center rivet bolt
        ctx.fillStyle = isCur ? '#FACC15' : '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // ---- LAYER 3A: ULTRA-THICK HIGH-VISIBILITY CORRIDOR & PATH WALLS ----
      // 1. North Promenade Outer Wall (y = 340, thickness = 18px)
      drawWallBulkhead(440, 340, 800, 340, 18, '#06B6D4', 6);
      drawWallBulkhead(920, 340, 1480, 340, 18, '#A855F7', 6);
      drawWallBulkhead(1600, 340, 1960, 340, 18, '#F59E0B', 6);
      drawWallSconces(440, 340, 800, 340, 70, '#06B6D4');
      drawWallSconces(920, 340, 1480, 340, 70, '#A855F7');
      drawWallSconces(1600, 340, 1960, 340, 70, '#F59E0B');

      // 2. North Promenade Inner Canyon Parapet (y = 460, thickness = 16px)
      drawWallBulkhead(560, 460, 1140, 460, 16, '#38BDF8', 8, true);
      drawWallBulkhead(1260, 460, 1840, 460, 16, '#38BDF8', 8, true);

      // 3. South Promenade Outer Wall (y = 1260, thickness = 18px)
      drawWallBulkhead(440, 1260, 800, 1260, 18, '#F43F5E', 6);
      drawWallBulkhead(920, 1260, 1480, 1260, 18, '#EC4899', 6);
      drawWallBulkhead(1600, 1260, 1960, 1260, 18, '#10B981', 6);
      drawWallSconces(440, 1260, 800, 1260, 70, '#F43F5E');
      drawWallSconces(920, 1260, 1480, 1260, 70, '#EC4899');
      drawWallSconces(1600, 1260, 1960, 1260, 70, '#10B981');

      // 4. South Promenade Inner Canyon Parapet (y = 1140, thickness = 16px)
      drawWallBulkhead(560, 1140, 1140, 1140, 16, '#FB7185', 8, true);
      drawWallBulkhead(1260, 1140, 1840, 1140, 16, '#F472B6', 8, true);

      // 5. West Wing Incubation Outer Wall (x = 440, thickness = 18px)
      drawWallBulkhead(440, 340, 440, 540, 18, '#3B82F6', 6);
      drawWallBulkhead(440, 640, 440, 960, 18, '#3B82F6', 6);
      drawWallBulkhead(440, 1060, 440, 1260, 18, '#EAB308', 6);
      drawWallSconces(440, 340, 440, 540, 60, '#3B82F6');
      drawWallSconces(440, 640, 440, 960, 60, '#3B82F6');
      drawWallSconces(440, 1060, 440, 1260, 60, '#EAB308');

      // 6. West Wing Incubation Inner Courtyard Parapet (x = 560, thickness = 16px)
      drawWallBulkhead(560, 460, 560, 740, 16, '#60A5FA', 8, true);
      drawWallBulkhead(560, 860, 560, 1140, 16, '#FDE047', 8, true);

      // 7. East Wing Growth Outer Wall (x = 1960, thickness = 18px)
      drawWallBulkhead(1960, 340, 1960, 540, 18, '#F59E0B', 6);
      drawWallBulkhead(1960, 640, 1960, 960, 18, '#10B981', 6);
      drawWallBulkhead(1960, 1060, 1960, 1260, 18, '#10B981', 6);
      drawWallSconces(1960, 340, 1960, 540, 60, '#F59E0B');
      drawWallSconces(1960, 640, 1960, 960, 60, '#10B981');
      drawWallSconces(1960, 1060, 1960, 1260, 60, '#10B981');

      // 8. East Wing Growth Inner Courtyard Parapet (x = 1840, thickness = 16px)
      drawWallBulkhead(1840, 460, 1840, 740, 16, '#FBBF24', 8, true);
      drawWallBulkhead(1840, 860, 1840, 1140, 16, '#34D399', 8, true);

      // 9. Pitch Arena North/South Bridge Barriers (x: 1140 & 1260, thickness = 16px)
      drawWallBulkhead(1140, 460, 1140, 600, 16, '#00F0FF', 8, true);
      drawWallBulkhead(1260, 460, 1260, 600, 16, '#00F0FF', 8, true);
      drawWallBulkhead(1140, 1000, 1140, 1140, 16, '#00F0FF', 8, true);
      drawWallBulkhead(1260, 1000, 1260, 1140, 16, '#00F0FF', 8, true);

      // 10. Central Grand Skybridge Balustrades (y = 740 & 860, thickness = 16px)
      drawWallBulkhead(760, 740, 1640, 740, 16, '#00F0FF', 10, true);
      drawWallBulkhead(760, 860, 1640, 860, 16, '#00F0FF', 10, true);

      // Corridor Major Corner Pilasters
      drawCornerPilaster(440, 340, 16, '#00F0FF');
      drawCornerPilaster(1960, 340, 16, '#00F0FF');
      drawCornerPilaster(440, 1260, 16, '#00F0FF');
      drawCornerPilaster(1960, 1260, 16, '#00F0FF');
      drawCornerPilaster(560, 460, 13, '#38BDF8');
      drawCornerPilaster(1840, 460, 13, '#38BDF8');
      drawCornerPilaster(560, 1140, 13, '#38BDF8');
      drawCornerPilaster(1840, 1140, 13, '#38BDF8');

      // ---- LAYER 3B: ULTRA-THICK, HIGHLY VISIBLE ROOM WALLS & CORNER BRACKETS ----
      ROOMS.forEach((r, idx) => {
        const isCurrent = idx === currentStageIndex;
        const isCompleted = idx < currentStageIndex;
        const isCrisis = r.id === 'stage-pr' && phase === 'crisis_active';
        const wallColor = isCrisis ? '#EF4444' : isCurrent ? '#FACC15' : isCompleted ? '#10B981' : r.color;
        const glowBlur = isCurrent ? 18 : 6;

        ctx.save();
        // 1. Heavy Outer Drop Shadow under Room
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(r.x - 10, r.y - 10, r.w + 20, r.h + 20, 18);
        ctx.fill();

        // 2. Room Floor Tile Fill
        ctx.fillStyle = isCrisis ? '#260810' : r.floorColor;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y, r.w, r.h, 12);
        ctx.fill();

        // Floor Grid Lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let gx = r.x + 35; gx < r.x + r.w; gx += 35) {
          ctx.beginPath(); ctx.moveTo(gx, r.y); ctx.lineTo(gx, r.y + r.h); ctx.stroke();
        }
        for (let gy = r.y + 35; gy < r.y + r.h; gy += 35) {
          ctx.beginPath(); ctx.moveTo(r.x, gy); ctx.lineTo(r.x + r.w, gy); ctx.stroke();
        }

        // Interior Baseboard Neon Track (Runs along inner room edge)
        ctx.strokeStyle = isCurrent ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(r.x + 10, r.y + 10, r.w - 20, r.h - 20, 6);
        ctx.stroke();

        // 3. ULTRA-THICK 20px WALL BULKHEADS WITH DOOR CUTOUTS
        if (r.id === 'stage-pitch') {
          // Grand Pitch Arena: North & South entrances
          drawWallBulkhead(r.x, r.y, r.x, r.y + r.h, 20, wallColor, glowBlur); // Left
          drawWallBulkhead(r.x + r.w, r.y, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Right
          drawWallBulkhead(r.x, r.y, 1140, r.y, 20, wallColor, glowBlur); // North Left
          drawWallBulkhead(1260, r.y, r.x + r.w, r.y, 20, wallColor, glowBlur); // North Right
          drawWallBulkhead(r.x, r.y + r.h, 1140, r.y + r.h, 20, wallColor, glowBlur); // South Left
          drawWallBulkhead(1260, r.y + r.h, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // South Right

          drawPortalJamb(1140, r.y, wallColor);
          drawPortalJamb(1260, r.y, wallColor);
          drawPortalJamb(1140, r.y + r.h, wallColor);
          drawPortalJamb(1260, r.y + r.h, wallColor);
        } else if (r.doorSide === 'south') {
          drawWallBulkhead(r.x, r.y, r.x + r.w, r.y, 20, wallColor, glowBlur); // Top
          drawWallBulkhead(r.x, r.y, r.x, r.y + r.h, 20, wallColor, glowBlur); // Left
          drawWallBulkhead(r.x + r.w, r.y, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Right
          drawWallBulkhead(r.x, r.y + r.h, r.doorX - 60, r.y + r.h, 20, wallColor, glowBlur); // South Left
          drawWallBulkhead(r.doorX + 60, r.y + r.h, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // South Right
          drawPortalJamb(r.doorX - 60, r.y + r.h, wallColor);
          drawPortalJamb(r.doorX + 60, r.y + r.h, wallColor);
        } else if (r.doorSide === 'north') {
          drawWallBulkhead(r.x, r.y + r.h, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Bottom
          drawWallBulkhead(r.x, r.y, r.x, r.y + r.h, 20, wallColor, glowBlur); // Left
          drawWallBulkhead(r.x + r.w, r.y, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Right
          drawWallBulkhead(r.x, r.y, r.doorX - 60, r.y, 20, wallColor, glowBlur); // North Left
          drawWallBulkhead(r.doorX + 60, r.y, r.x + r.w, r.y, 20, wallColor, glowBlur); // North Right
          drawPortalJamb(r.doorX - 60, r.y, wallColor);
          drawPortalJamb(r.doorX + 60, r.y, wallColor);
        } else if (r.doorSide === 'east') {
          drawWallBulkhead(r.x, r.y, r.x + r.w, r.y, 20, wallColor, glowBlur); // Top
          drawWallBulkhead(r.x, r.y + r.h, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Bottom
          drawWallBulkhead(r.x, r.y, r.x, r.y + r.h, 20, wallColor, glowBlur); // Left
          drawWallBulkhead(r.x + r.w, r.y, r.x + r.w, r.doorY - 50, 20, wallColor, glowBlur); // East Top
          drawWallBulkhead(r.x + r.w, r.doorY + 50, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // East Bottom
          drawPortalJamb(r.x + r.w, r.doorY - 50, wallColor);
          drawPortalJamb(r.x + r.w, r.doorY + 50, wallColor);
        } else if (r.doorSide === 'west') {
          drawWallBulkhead(r.x, r.y, r.x + r.w, r.y, 20, wallColor, glowBlur); // Top
          drawWallBulkhead(r.x, r.y + r.h, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Bottom
          drawWallBulkhead(r.x + r.w, r.y, r.x + r.w, r.y + r.h, 20, wallColor, glowBlur); // Right
          drawWallBulkhead(r.x, r.y, r.x, r.doorY - 50, 20, wallColor, glowBlur); // West Top
          drawWallBulkhead(r.x, r.doorY + 50, r.x, r.y + r.h, 20, wallColor, glowBlur); // West Bottom
          drawPortalJamb(r.x, r.doorY - 50, wallColor);
          drawPortalJamb(r.x, r.doorY + 50, wallColor);
        }

        // 4. SOLID CORNER REINFORCEMENT BRACKETS (Reinforced corner nodes)
        drawCornerBracket(r.x, r.y, wallColor, isCurrent);
        drawCornerBracket(r.x + r.w, r.y, wallColor, isCurrent);
        drawCornerBracket(r.x, r.y + r.h, wallColor, isCurrent);
        drawCornerBracket(r.x + r.w, r.y + r.h, wallColor, isCurrent);

        ctx.restore();
      });

      // ---- LAYER 4: DOORWAY CONNECTORS & ANIMATED PNEUMATIC BLAST DOORS ----
      // 1. Draw Clean Doorway Threshold Base
      DOOR_CONNECTORS.forEach(d => {
        // Clear doorway opening through the thick wall with clean floor plating
        ctx.fillStyle = '#0c1426';
        ctx.fillRect(d.x, d.y, d.w, d.h);

        // Subtle bulkhead threshold trim on doorway borders (clean, no dotted lines)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(d.x, d.y, d.w, d.h);
      });

      // 2. Animated Sliding Mechanical Blast Doors for Every Room
      ROOMS.forEach((r, idx) => {
        const dToDoor = Math.hypot(avatarPos.current.x - r.doorX, avatarPos.current.y - r.doorY);
        const isInside = avatarPos.current.x >= r.x && avatarPos.current.x <= r.x + r.w &&
                         avatarPos.current.y >= r.y && avatarPos.current.y <= r.y + r.h;
        const isCur = idx === currentStageIndex;
        const isDone = idx < currentStageIndex;

        // Proximity detection: door slides open when player approaches within 135px or is inside room
        const shouldOpen = dToDoor <= 135 || isInside || (isCur && dToDoor <= 180);
        const targetOpen = shouldOpen ? 1 : 0;

        doorAnimRef.current[idx] += (targetOpen - doorAnimRef.current[idx]) * 0.12;
        const openAmt = Math.max(0, Math.min(1, doorAnimRef.current[idx]));
        const doorColor = isCur ? '#FACC15' : isDone ? '#10B981' : '#38BDF8';

        ctx.save();
        if (r.doorSide === 'south' || r.doorSide === 'north') {
          const doorW = 120;
          const halfW = 60;
          const doorH = 20;
          const slideOffset = openAmt * 48; // Max slide 48px apart

          // Recessed Floor Track
          ctx.fillStyle = '#050a14';
          ctx.fillRect(r.doorX - halfW, r.doorY - doorH / 2, doorW, doorH);

          // Guide rail lines
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(r.doorX - halfW, r.doorY - doorH / 2 + 2); ctx.lineTo(r.doorX + halfW, r.doorY - doorH / 2 + 2);
          ctx.moveTo(r.doorX - halfW, r.doorY + doorH / 2 - 2); ctx.lineTo(r.doorX + halfW, r.doorY + doorH / 2 - 2);
          ctx.stroke();

          // Left Sliding Door Leaf
          const leftX = r.doorX - halfW - slideOffset;
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = doorColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(leftX, r.doorY - doorH / 2, halfW, doorH, 4);
          ctx.fill();
          ctx.stroke();

          // Left Leaf Hazard Grip
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(leftX + halfW - 10, r.doorY - 6, 6, 12);
          ctx.fillStyle = isCur ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          for (let s = leftX + 8; s < leftX + halfW - 14; s += 10) {
            ctx.fillRect(s, r.doorY - 4, 4, 8);
          }

          // Right Sliding Door Leaf
          const rightX = r.doorX + slideOffset;
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = doorColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(rightX, r.doorY - doorH / 2, halfW, doorH, 4);
          ctx.fill();
          ctx.stroke();

          // Right Leaf Hazard Grip
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(rightX + 4, r.doorY - 6, 6, 12);
          ctx.fillStyle = isCur ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          for (let s = rightX + 16; s < rightX + halfW - 8; s += 10) {
            ctx.fillRect(s, r.doorY - 4, 4, 8);
          }

          // Center Magnetic Lock / Access Status LED
          if (openAmt < 0.25) {
            const ledCol = isDone ? '#10B981' : isCur ? '#FACC15' : '#EF4444';
            ctx.fillStyle = ledCol;
            ctx.shadowColor = ledCol;
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(r.doorX, r.doorY, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = '#10B981';
            ctx.shadowColor = '#10B981';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(leftX + halfW - 2, r.doorY, 3, 0, Math.PI * 2);
            ctx.arc(rightX + 2, r.doorY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        } else {
          // Vertical doorway (east / west)
          const doorH = 100;
          const halfH = 50;
          const doorW = 20;
          const slideOffset = openAmt * 40; // Max slide 40px apart

          // Recessed Floor Track
          ctx.fillStyle = '#050a14';
          ctx.fillRect(r.doorX - doorW / 2, r.doorY - halfH, doorW, doorH);

          // Guide rail lines
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(r.doorX - doorW / 2 + 2, r.doorY - halfH); ctx.lineTo(r.doorX - doorW / 2 + 2, r.doorY + halfH);
          ctx.moveTo(r.doorX + doorW / 2 - 2, r.doorY - halfH); ctx.lineTo(r.doorX + doorW / 2 - 2, r.doorY + halfH);
          ctx.stroke();

          // Top Sliding Door Leaf
          const topY = r.doorY - halfH - slideOffset;
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = doorColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(r.doorX - doorW / 2, topY, doorW, halfH, 4);
          ctx.fill();
          ctx.stroke();

          // Top Grip & Stripes
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(r.doorX - 6, topY + halfH - 10, 12, 6);
          ctx.fillStyle = isCur ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          for (let s = topY + 8; s < topY + halfH - 14; s += 10) {
            ctx.fillRect(r.doorX - 4, s, 8, 4);
          }

          // Bottom Sliding Door Leaf
          const bottomY = r.doorY + slideOffset;
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = doorColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(r.doorX - doorW / 2, bottomY, doorW, halfH, 4);
          ctx.fill();
          ctx.stroke();

          // Bottom Grip & Stripes
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(r.doorX - 6, bottomY + 4, 12, 6);
          ctx.fillStyle = isCur ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          for (let s = bottomY + 16; s < bottomY + halfH - 8; s += 10) {
            ctx.fillRect(r.doorX - 4, s, 8, 4);
          }

          // Central Magnetic Access LED
          if (openAmt < 0.25) {
            const ledCol = isDone ? '#10B981' : isCur ? '#FACC15' : '#EF4444';
            ctx.fillStyle = ledCol;
            ctx.shadowColor = ledCol;
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(r.doorX, r.doorY, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = '#10B981';
            ctx.shadowColor = '#10B981';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(r.doorX, topY + halfH - 2, 3, 0, Math.PI * 2);
            ctx.arc(r.doorX, bottomY + 2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        ctx.restore();
      });


      // ---- LAYER 5: DETAILED DEPARTMENT PROPS & FURNITURE ----
      ROOMS.forEach((r, idx) => {
        const isCurrent = idx === currentStageIndex;
        const isCompleted = idx < currentStageIndex;
        const midX = r.x + r.w / 2;

        // Calculate Entrance Marquee Sign Position in corridor right at room doorway
        let signX = r.doorX;
        let signY = r.doorY;

        if (r.doorSide === 'south') {
          signX = r.doorX;
          signY = r.doorY + 30;
        } else if (r.doorSide === 'north') {
          signX = r.doorX;
          signY = r.doorY - 30;
        } else if (r.doorSide === 'east') {
          signX = r.doorX + 60;
          signY = r.doorY - 60;
        } else if (r.doorSide === 'west') {
          signX = r.doorX - 60;
          signY = r.doorY - 60;
        }

        if (r.id === 'stage-pitch') {
          signX = 1200;
          signY = 550;
        }

        // Prominent High-Visibility Entrance Marquee Sign
        const marqueeW = 240;
        const marqueeH = 34;
        const marqueeX = signX - marqueeW / 2;
        const marqueeY = signY - marqueeH / 2;

        ctx.fillStyle = 'rgba(6, 12, 28, 0.98)';
        ctx.strokeStyle = isCurrent ? '#FACC15' : isCompleted ? '#10B981' : r.color;
        ctx.lineWidth = isCurrent ? 3 : 2;
        if (isCurrent) {
          ctx.shadowColor = '#FACC15';
          ctx.shadowBlur = 18;
        }
        ctx.beginPath();
        ctx.roundRect(marqueeX, marqueeY, marqueeW, marqueeH, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Room code mini-badge on left
        const badgeW = 72;
        ctx.fillStyle = isCurrent ? '#FACC15' : r.color;
        ctx.beginPath();
        ctx.roundRect(marqueeX + 3, marqueeY + 3, badgeW, marqueeH - 6, 6);
        ctx.fill();
        ctx.font = '900 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(r.code, marqueeX + 3 + badgeW / 2, marqueeY + 21);

        // Room Name Title in high contrast white / bright yellow
        ctx.font = '900 12px "Outfit", sans-serif';
        ctx.fillStyle = isCurrent ? '#FEF08A' : '#FFFFFF';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'left';
        ctx.fillText(r.name.toUpperCase(), marqueeX + badgeW + 8, marqueeY + 22);
        ctx.shadowBlur = 0;

        // Floor Interior Label Watermark
        ctx.font = '900 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isCurrent ? 'rgba(250,204,21,0.35)' : 'rgba(255,255,255,0.14)';
        ctx.fillText(`• ${r.name.toUpperCase()} •`, midX, r.y + r.h - 18);

        // ==========================================
        // PROPS PER DEPARTMENT:
        // ==========================================
        if (r.id === 'stage-mentorship') {
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(r.x + 35, r.y + 50, 110, 50, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#64748B'; ctx.fillRect(r.x + 50, r.y + 65, 18, 12);
          ctx.fillRect(r.x + 105, r.y + 65, 18, 12);
          ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 185, r.y + 45, 125, 45, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#38BDF8'; ctx.font = 'bold 7px monospace'; ctx.fillText('MARKET VALIDATION', r.x + 247, r.y + 63);
          ctx.fillStyle = '#FACC15'; ctx.fillText('FOUNDER JOURNEY', r.x + 247, r.y + 77);
          ctx.fillStyle = '#334155'; ctx.fillRect(r.x + 15, r.y + 200, 22, 60);
          ctx.fillStyle = '#93C5FD'; ctx.fillRect(r.x + 18, r.y + 205, 16, 8);
          ctx.fillStyle = '#FCD34D'; ctx.fillRect(r.x + 18, r.y + 217, 16, 8);
          ctx.fillStyle = '#F87171'; ctx.fillRect(r.x + 18, r.y + 229, 16, 8);
        }
        else if (r.id === 'stage-technical') {
          for (let s = 0; s < 3; s++) {
            const sx = r.x + 30 + s * 36;
            ctx.fillStyle = '#0B132B'; ctx.strokeStyle = '#06B6D4'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(sx, r.y + 45, 28, 60, 3); ctx.fill(); ctx.stroke();
            for (let led = 0; led < 4; led++) {
              const blink = Math.sin(time * 6 + s * 2 + led) > 0;
              ctx.fillStyle = blink ? '#22D3EE' : '#0E7490';
              ctx.beginPath(); ctx.arc(sx + 8, r.y + 55 + led * 12, 2.5, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = !blink ? '#10B981' : '#065F46';
              ctx.beginPath(); ctx.arc(sx + 19, r.y + 55 + led * 12, 2.5, 0, Math.PI * 2); ctx.fill();
            }
          }
          ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#06B6D4'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 245, r.y + 45, 140, 50, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#22D3EE'; ctx.font = 'bold 7px monospace'; ctx.fillText('MICROSERVICES & API', r.x + 315, r.y + 65);
          ctx.fillStyle = '#A7F3D0'; ctx.fillText('DB CLUSTER: 99.9% SLA', r.x + 315, r.y + 80);
        }
        else if (r.id === 'stage-design') {
          ctx.fillStyle = '#1E1B4B'; ctx.strokeStyle = '#A855F7'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 30, r.y + 45, 130, 55, 6); ctx.fill(); ctx.stroke();
          const swatches = ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899'];
          swatches.forEach((sw, si) => {
            ctx.fillStyle = sw;
            ctx.fillRect(r.x + 42 + si * 18, r.y + 60, 12, 12);
          });
          ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#C084FC'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 250, r.y + 45, 135, 55, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#C084FC'; ctx.font = 'bold 7px monospace'; ctx.fillText('FIGMA UI WIREFRAME', r.x + 317, r.y + 66);
          ctx.fillStyle = '#E9D5FF'; ctx.fillText('UX FRICTION: ZERO', r.x + 317, r.y + 82);
        }
        else if (r.id === 'stage-content') {
          ctx.fillStyle = '#1C1917'; ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1;
          for (let f = 0; f < 3; f++) {
            ctx.beginPath(); ctx.roundRect(r.x + 25 + f * 32, r.y + 45, 26, 26, 4); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#78350F'; ctx.fillRect(r.x + 28 + f * 32, r.y + 48, 20, 20);
          }
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath(); ctx.arc(r.x + 150, r.y + 60, 9, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#D97706'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(r.x + 150, r.y + 69); ctx.lineTo(r.x + 150, r.y + 88); ctx.stroke();
          ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(r.x + 195, r.y + 45, 120, 45, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FCD34D'; ctx.font = 'bold 7px monospace'; ctx.fillText('VIRAL HOOK MATRIX', r.x + 255, r.y + 70);
        }
        else if (r.id === 'stage-marketing') {
          ctx.fillStyle = '#022C22'; ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 40, r.y + 45, 240, 65, 6); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(r.x + 60, r.y + 95);
          ctx.lineTo(r.x + 100, r.y + 85);
          ctx.lineTo(r.x + 140, r.y + 88);
          ctx.lineTo(r.x + 180, r.y + 70);
          ctx.lineTo(r.x + 220, r.y + 60);
          ctx.lineTo(r.x + 260, r.y + 55);
          ctx.stroke();
          ctx.fillStyle = '#6EE7B7'; ctx.font = 'bold 8px monospace'; ctx.fillText('CAC:LTV 1:4.8  ▲ +140%', r.x + 160, r.y + 100);
        }
        else if (r.id === 'stage-media') {
          ctx.fillStyle = '#064E3B'; ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 35, r.y + 45, 140, 55, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#34D399'; ctx.font = 'bold 8px monospace'; ctx.fillText('GREEN SCREEN CYC', r.x + 105, r.y + 76);
          ctx.fillStyle = '#1E293B'; ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 265, r.y + 50, 36, 24, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#06B6D4'; ctx.beginPath(); ctx.arc(r.x + 260, r.y + 62, 6, 0, Math.PI * 2); ctx.fill();
          const recBlink = Math.sin(time * 8) > 0;
          ctx.fillStyle = recBlink ? '#EF4444' : '#7F1D1D';
          ctx.beginPath(); ctx.arc(r.x + 293, r.y + 56, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(236,72,153,0.15)';
          ctx.beginPath(); ctx.arc(r.x + 220, r.y + 50, 22, 0, Math.PI * 2); ctx.fill();
        }
        else if (r.id === 'stage-pr') {
          ctx.fillStyle = '#2B0C13'; ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 35, r.y + 45, 160, 55, 6); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FB7185'; ctx.font = 'bold 7px monospace'; ctx.fillText('MEDIA SENTIMENT: DEFENSE', r.x + 115, r.y + 68);
          ctx.fillStyle = '#FCA5A5'; ctx.fillText('PRESS DESK READY', r.x + 115, r.y + 86);
          ctx.fillStyle = '#991B1B'; ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 270, r.y + 50, 42, 42, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FEF2F2'; ctx.font = 'bold 16px serif'; ctx.fillText('☎️', r.x + 291, r.y + 77);
        }
        else if (r.id === 'stage-sponsorship') {
          ctx.fillStyle = '#3F220B'; ctx.strokeStyle = '#EAB308'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.roundRect(r.x + 35, r.y + 45, 150, 55, 10); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FEF08A'; ctx.fillRect(r.x + 65, r.y + 60, 20, 24);
          ctx.fillStyle = '#FEF08A'; ctx.fillRect(r.x + 120, r.y + 60, 20, 24);
          ctx.fillStyle = '#1C1917'; ctx.strokeStyle = '#FACC15'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(r.x + 215, r.y + 45, 95, 55, 4); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FDE047'; ctx.font = 'bold 7px monospace'; ctx.fillText('CAP TABLE: SAFE', r.x + 262, r.y + 68);
          ctx.fillStyle = '#86EFAC'; ctx.fillText('$500K SYNDICATE', r.x + 262, r.y + 84);
        }
        else if (r.id === 'stage-pitch') {
          const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
          ctx.strokeStyle = 'rgba(56,189,248,0.2)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(cx, cy + 30, 150, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy + 30, 120, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy + 30, 90, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
          ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(cx - 160, r.y + 40, 320, 65, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#0284C7'; ctx.font = '900 12px "JetBrains Mono", monospace';
          ctx.fillText('🏆 GRAND VC DEMO DAY ARENA', cx, r.y + 68);
          ctx.fillStyle = '#BAE6FD'; ctx.font = 'bold 9px "Outfit", sans-serif';
          ctx.fillText('LIVE VENTURE CAPITAL JUDGING PANEL', cx, r.y + 88);
        }

        // ==========================================
        // MENTOR WORKSTATION & DESK:
        // ==========================================
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(r.mentorX - 45, r.mentorY + 18, 90, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isCurrent ? r.color : '#475569';
        ctx.fillRect(r.mentorX - 22, r.mentorY + 21, 44, 10);

        // Mentor Interaction Glow Ring for Active Stage
        if (isCurrent) {
          const pulse = Math.sin(time * 5) * 4;
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#FACC15';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(r.mentorX, r.mentorY, 28 + pulse, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Animated Mentor Character
        const bob = Math.sin(time * 3 + idx) * 3;
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.fillText(r.mentorAvatar, r.mentorX, r.mentorY + bob);

        // Mentor Nameplate Pill (Large, High-Contrast & High-Visibility)
        const tagW = Math.max(160, r.mentorName.length * 9 + 30);
        const tagH = 24;
        ctx.fillStyle = 'rgba(6, 12, 28, 0.98)';
        ctx.strokeStyle = isCurrent ? '#FACC15' : isCompleted ? '#10B981' : r.color;
        ctx.lineWidth = isCurrent ? 2.5 : 1.5;
        if (isCurrent) {
          ctx.shadowColor = '#FACC15';
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.roundRect(r.mentorX - tagW / 2, r.mentorY + bob + 16, tagW, tagH, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = '900 12px "Outfit", sans-serif';
        ctx.fillStyle = isCurrent ? '#FEF08A' : '#FFFFFF';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(r.mentorName, r.mentorX, r.mentorY + bob + 32);
        ctx.shadowBlur = 0;

        // Speech Callout Bubble over Mentor (Active or Wrong Mentor Guidance)
        if (isCurrent) {
          const bb = Math.sin(time * 6) * 4;
          const bubbleW = 114, bubbleH = 26;
          ctx.fillStyle = '#FACC15';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#FACC15';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(r.mentorX - bubbleW / 2, r.mentorY - 40 + bb, bubbleW, bubbleH, 8);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.font = '900 11px "Lilita One", sans-serif';
          ctx.fillStyle = '#000';
          ctx.fillText('💬 TALK [E]', r.mentorX, r.mentorY - 23 + bb);
        } else if (idx === nearWrongMentorIdx) {
          const bb = Math.sin(time * 6) * 4;
          const bubbleW = 160, bubbleH = 26;
          ctx.fillStyle = '#F59E0B';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(r.mentorX - bubbleW / 2, r.mentorY - 40 + bb, bubbleW, bubbleH, 8);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.font = '900 10px "Lilita One", sans-serif';
          ctx.fillStyle = '#000';
          ctx.fillText(`⚠️ [E] GO TO ${currentRoom.code}!`, r.mentorX, r.mentorY - 23 + bb);

          // Pulsing warning ring around wrong mentor
          const pulse = Math.sin(time * 6) * 4;
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(r.mentorX, r.mentorY, 26 + pulse, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Cleared Badge
        if (isCompleted) {
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText('✓ CLEARED', midX, r.y + r.h - 14);
        }

        // Pulsing Doorway Beacon to guide player
        if (isCurrent) {
          const pulse = Math.sin(time * 6) * 5;
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#FACC15';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.ellipse(r.doorX, r.doorY, 26 + pulse, 13 + pulse / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // ---- LAYER 6: CLICK TARGET MARKER ----
      if (clickMarker.current) {
        clickMarker.current.radius += 1.2;
        clickMarker.current.alpha -= 0.03;
        if (clickMarker.current.alpha <= 0) clickMarker.current = null;
        else {
          ctx.strokeStyle = `rgba(0,240,255,${clickMarker.current.alpha})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(clickMarker.current.x, clickMarker.current.y, clickMarker.current.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ---- LAYER 7: DIRECTIONAL GUIDANCE CHEVRON TOWARDS ACTIVE MENTOR ----
      const avX = avatarPos.current.x, avY = avatarPos.current.y;
      {
        const angle = Math.atan2(targetMentorPos.y - avY, targetMentorPos.x - avX);
        ctx.save();
        ctx.translate(avX, avY + 14);
        ctx.rotate(angle);
        const p = Math.sin(time * 8) * 3;
        ctx.fillStyle = '#FACC15';
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(34 + p, 0); ctx.lineTo(22 + p, -8); ctx.lineTo(26 + p, 0); ctx.lineTo(22 + p, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(0,240,255,0.7)';
        ctx.beginPath();
        ctx.moveTo(20 + p * 0.7, 0); ctx.lineTo(12 + p * 0.7, -5); ctx.lineTo(15 + p * 0.7, 0); ctx.lineTo(12 + p * 0.7, 5);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // ---- LAYER 8: PLAYER FOUNDER AVATAR (TECH CYBER-ENTREPRENEUR & AI COMPANION) ----
      const AVATAR_SCALE = 1.45;
      const legStride = Math.sin(walkCycle.current * 8) * 6;
      const armSwing = Math.sin(walkCycle.current * 8) * 5;
      const isMoving = actualSpeed > 0.2;
      const runBob = isMoving ? Math.abs(Math.sin(walkCycle.current * 8)) * 3 : Math.sin(time * 3) * 1;
      const runTilt = (vx / MAX_SPEED) * 0.12 - (vy / MAX_SPEED) * 0.04 * facingScale.current;

      // 1. Dynamic Ground Shadow under Founder
      ctx.save();
      ctx.translate(avX, avY + 14);
      if (actualSpeed > 0.4) {
        const moveAngle = Math.atan2(vy, vx);
        ctx.rotate(moveAngle * 0.1);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 22 + (isMoving ? actualSpeed * 0.35 : 0), 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Floating AI Drone Companion ("Byte") Ground Shadow
      const droneBob = Math.sin(time * 4) * 4;
      const droneOffX = -26 * facingScale.current;
      const droneOffY = -34 + droneBob;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(avX + droneOffX, avY + 16, 7.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Founder Character Body Structure (Scaled 1.45x)
      ctx.save();
      ctx.translate(avX, avY - runBob);
      ctx.rotate(runTilt);
      ctx.scale(facingScale.current * AVATAR_SCALE, AVATAR_SCALE);

      // Startup Primary & Accent Colors
      const suitColor = chosenStartup?.id === 'plantspeak' ? '#10B981' : chosenStartup?.id === 'campuseats' ? '#F97316' : '#0284C7';
      const skinColor = '#FED7AA'; // Warm natural skin tone

      // A. Back Arm (Swinging in opposition to front leg)
      ctx.save();
      ctx.strokeStyle = '#0F172A'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-2, -6);
      ctx.lineTo(-4 - armSwing, 3);
      ctx.stroke();
      // Back Hand
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(-4 - armSwing, 4.5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // B. Tech Messenger / Backpack on back
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-12, -14, 7, 13, 3);
      ctx.fill();
      ctx.stroke();
      // Glowing Battery / Power Port on Bag
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(-10, -11, 3, 3);

      // C. Legs & Tech Sneakers (Articulating stride)
      // Left Leg (Back)
      ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-3 - legStride, 9); ctx.stroke();
      // Left Sneaker
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(-5 - legStride, 8, 7, 3.5, 1.5); ctx.fill();
      ctx.fillStyle = suitColor;
      ctx.beginPath(); ctx.roundRect(-4 - legStride, 6.5, 5, 2.5, 1); ctx.fill();

      // Right Leg (Front)
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(3 + legStride, 9); ctx.stroke();
      // Right Sneaker
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(1 + legStride, 8, 7, 3.5, 1.5); ctx.fill();
      ctx.fillStyle = suitColor;
      ctx.beginPath(); ctx.roundRect(2 + legStride, 6.5, 5, 2.5, 1); ctx.fill();

      // D. Founder Torso (Cyberpunk Startup Hoodie / Bomber Jacket)
      ctx.fillStyle = suitColor;
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-8, -15, 16, 16, 4);
      ctx.fill();
      ctx.stroke();

      // Jacket Inner Shirt & Zipper
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-2, -15, 4, 15);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -1); ctx.stroke();

      // Founder Badge Pin on chest
      ctx.fillStyle = '#FACC15';
      ctx.beginPath(); ctx.arc(4, -10, 1.8, 0, Math.PI * 2); ctx.fill();

      // E. Front Arm & Smart Holographic Wristband
      ctx.save();
      ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(3, -7);
      ctx.lineTo(5 + armSwing, 2);
      ctx.stroke();
      // Smart Watch / Holo Wristband
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(4 + armSwing, 0, 3, 2.5);
      // Front Hand
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(6 + armSwing, 3.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // F. Head & Face
      // Head base (Skin tone)
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, -21, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Stylish Tech Founder Hair (Spiky / Modern Swoop)
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, -23, 9, Math.PI * 0.7, Math.PI * 2.1);
      ctx.lineTo(8, -20);
      ctx.lineTo(4, -18);
      ctx.lineTo(0, -21);
      ctx.lineTo(-4, -18);
      ctx.closePath();
      ctx.fill();

      // Hair Highlight Strand
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(1, -25, 4, 0, Math.PI * 1.2);
      ctx.fill();

      // Cyber AR Smart Glasses / Cyber Shades
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(1, -23, 8, 4.5, 1.5);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Visor Glare Shine
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(3, -22.5, 3, 1.2);

      // Comms Earpiece on Head
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(-5, -20, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.arc(-5, -20, 0.9, 0, Math.PI * 2); ctx.fill();

      ctx.restore(); // Restore founder character transform

      // 4. Floating AI Co-Founder Companion ("Byte Drone" - Scaled 1.35x)
      ctx.save();
      ctx.translate(avX + droneOffX, avY + droneOffY);
      ctx.scale(1.35, 1.35);

      // Anti-grav Thrust Glow
      const thrustPulse = Math.sin(time * 12) * 1.5;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 7, 3.5 + thrustPulse, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Drone Spherical Chassis
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Drone Visor / Glowing Optic Eye
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(1.5 * facingScale.current, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Optic Pupil
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(2 * facingScale.current, -0.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Drone Antenna with blinking beacon
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -9); ctx.stroke();
      const droneBlink = Math.sin(time * 8) > 0;
      ctx.fillStyle = droneBlink ? '#FACC15' : '#10B981';
      ctx.beginPath(); ctx.arc(0, -9.5, 1.2, 0, Math.PI * 2); ctx.fill();

      ctx.restore();

      // Overhead Name & Startup Viability Bar
      ctx.save();
      ctx.textAlign = 'center';
      const pct = Math.max(0, Math.min(100, stats.score));
      const barCol = pct >= 70 ? '#22C55E' : pct >= 40 ? '#FACC15' : '#EF4444';
      ctx.font = '900 12px "Lilita One", sans-serif';
      ctx.fillStyle = '#FFF';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(`${chosenStartup?.name.toUpperCase() || 'FOUNDER'} • ${pct}%`, avX, avY - 50);
      ctx.shadowBlur = 0;

      const bw = 60, bh = 7;
      ctx.fillStyle = '#000'; ctx.fillRect(avX - bw / 2 - 1, avY - 44, bw + 2, bh + 2);
      ctx.fillStyle = '#1E293B'; ctx.fillRect(avX - bw / 2, avY - 43, bw, bh);
      ctx.fillStyle = barCol; ctx.fillRect(avX - bw / 2, avY - 43, (bw * pct) / 100, bh);
      ctx.restore();

      // ---- LAYER 9: PARTICLES ----
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
        if (p.alpha <= 0) { particles.current.splice(i, 1); continue; }
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ---- LAYER 10: FLOATING TEXTS ----
      for (let i = floatingTexts.current.length - 1; i >= 0; i--) {
        const ft = floatingTexts.current[i];
        ft.y += ft.vy; ft.alpha -= 0.015;
        if (ft.alpha <= 0) { floatingTexts.current.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = '900 13px "Lilita One", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore(); // Exit camera transform

      // ============================================================
      // SCREEN-SPACE MINI-MAP (BIOMORPHIC INFINITY-LOOP LAYOUT)
      // ============================================================
      ctx.save();
      const mmW = 150, mmH = 100, mmX = 14, mmY = 68;
      ctx.fillStyle = 'rgba(6,11,28,0.95)';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(mmX, mmY, mmW, mmH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Corridors & Promenades on mini-map
      ctx.fillStyle = '#1e293b';
      CORRIDORS.forEach(c => {
        ctx.fillRect(
          mmX + (c.x / ARENA_W) * mmW,
          mmY + (c.y / ARENA_H) * mmH,
          (c.w / ARENA_W) * mmW,
          (c.h / ARENA_H) * mmH
        );
      });

      // Dual Atriums on mini-map
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.beginPath();
      ctx.arc(mmX + (760 / ARENA_W) * mmW, mmY + (800 / ARENA_H) * mmH, (150 / ARENA_W) * mmW, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.beginPath();
      ctx.arc(mmX + (1640 / ARENA_W) * mmW, mmY + (800 / ARENA_H) * mmH, (150 / ARENA_W) * mmW, 0, Math.PI * 2);
      ctx.fill();

      // Central Skybridge Spine on mini-map
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.fillRect(
        mmX + (760 / ARENA_W) * mmW,
        mmY + (740 / ARENA_H) * mmH,
        (880 / ARENA_W) * mmW,
        (120 / ARENA_H) * mmH
      );

      // Thick Rooms on mini-map
      ROOMS.forEach((r, idx) => {
        const isCur = idx === currentStageIndex;
        ctx.fillStyle = isCur ? '#FACC15' : r.color;
        const rx = mmX + (r.x / ARENA_W) * mmW, ry = mmY + (r.y / ARENA_H) * mmH;
        const rw = (r.w / ARENA_W) * mmW, rh = (r.h / ARENA_H) * mmH;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = '#050a14';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx, ry, rw, rh);
        if (isCur) {
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rx + rw / 2, ry + rh / 2, 5 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Player dot on mini-map
      const pmx = mmX + (avatarPos.current.x / ARENA_W) * mmW;
      const pmy = mmY + (avatarPos.current.y / ARENA_H) * mmH;
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(pmx, pmy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '900 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText('ORBITAL DECK MAP', mmX + 8, mmY + 11);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentStageIndex, chosenStartup, phase, targetMentorPos.x, targetMentorPos.y, stats.score]);

  // ============================================================
  // JSX RENDER
  // ============================================================
  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden bg-[#030610] select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`w-full h-full block touch-none ${isGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Re-center Button */}
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
          <span>🎯 RE-CENTER</span>
        </button>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-28 right-6 z-30 pointer-events-auto flex flex-col items-center bg-[#080d1f]/95 border-2 border-yellow-400/80 rounded-2xl p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.65)] backdrop-blur-md gap-1.5">
        <button
          onClick={zoomIn}
          disabled={zoomDisplay >= 2.8}
          className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-yellow-400 hover:text-black text-yellow-400 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={resetZoom}
          className="px-1.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono font-bold text-yellow-300 transition-colors border border-yellow-400/30"
          title="Reset Zoom"
        >
          {zoomDisplay.toFixed(1)}x
        </button>
        <button
          onClick={zoomOut}
          disabled={zoomDisplay <= 1.0}
          className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-yellow-400 hover:text-black text-yellow-400 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={fitArena}
          className={`w-8 h-8 rounded-xl ${zoomDisplay === 1.0 ? 'bg-cyan-500 text-black' : 'bg-slate-800/90 hover:bg-cyan-500 hover:text-black text-cyan-400'} flex items-center justify-center transition-all active:scale-95`}
          title="Fit Complex"
          aria-label="Fit Complex"
        >
          <Maximize2 size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Top Compass HUD */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-4 px-6 py-3 rounded-2xl bg-[#080d1f]/95 border-2 border-yellow-400 border-b-4 border-b-amber-600 shadow-[0_0_40px_rgba(250,204,21,0.5)] backdrop-blur-md">
        <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-yellow-400 flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-spin [animation-duration:6s]" />
          <div ref={needleRef} className="w-8 h-8 flex items-center justify-center transition-transform duration-75">
            <svg viewBox="0 0 24 24" className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]">
              <path d="M22 12L5 5l4 7-4 7z" fill="#FACC15" stroke="#78350F" strokeWidth="1" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            <span className="text-xs font-black tracking-widest text-yellow-400 uppercase font-brawl">
              OBJECTIVE: {currentRoom.mentorAvatar} CONSULT {currentRoom.mentorName.toUpperCase()}
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-mono font-bold">
            DIST: <span ref={distanceRef} className="text-yellow-300 font-black text-xs">0m</span> • ENTER [{currentRoom.code}] {currentRoom.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Active Mentor Interaction Button when in proximity */}
      {isNearActiveMentor && phase === 'map_journey' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-bounce">
          <button
            onClick={() => {
              proceedFromMapToStage();
              sound.playMentorGreet();
            }}
            className="brawl-btn brawl-btn-yellow px-5 py-3 text-sm font-brawl shadow-[0_0_40px_rgba(250,204,21,0.6)] flex items-center gap-2 border-4 border-black ring-4 ring-yellow-400/60"
          >
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            <span>[E] TALK TO {currentRoom.mentorName.toUpperCase()}</span>
            <Sparkles className="w-4 h-4 fill-black text-black" />
          </button>
        </div>
      )}

      {/* Wrong Mentor Interaction Button when in proximity to an inactive mentor */}
      {!isNearActiveMentor && nearWrongMentorIdx !== null && phase === 'map_journey' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-bounce">
          <button
            onClick={() => {
              sound.playWrongMentorWarn();
              const advice = getWrongMentorAdvice(nearWrongMentorIdx, currentStageIndex);
              setWrongMentorNotice(advice);
              floatingTexts.current.push({
                id: Math.random().toString(),
                x: ROOMS[nearWrongMentorIdx].mentorX,
                y: ROOMS[nearWrongMentorIdx].mentorY - 48,
                text: `⚠️ GO TO ${ROOMS[currentStageIndex].code}!`,
                color: '#FACC15',
                alpha: 1,
                vy: -1.2,
              });
            }}
            className="brawl-btn brawl-btn-yellow px-5 py-3 text-sm font-brawl shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center gap-2 border-4 border-black ring-4 ring-amber-400/60"
          >
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            <span>[E] ASK {ROOMS[nearWrongMentorIdx].mentorName.toUpperCase()} FOR DIRECTIONS</span>
          </button>
        </div>
      )}

      {/* Wrong Mentor Guidance Modal Card with Auto-Route Button */}
      {wrongMentorNotice && phase === 'map_journey' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-lg w-[92%] bg-[#080d1f]/98 border-2 border-amber-400/90 rounded-2xl p-4 shadow-[0_0_50px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {wrongMentorNotice.mentorAvatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase font-brawl tracking-wider">
                    {wrongMentorNotice.mentorName} ({wrongMentorNotice.deptCode})
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-mono text-amber-300 font-bold">
                    CAMPUS GUIDE
                  </span>
                </div>
                <button
                  onClick={() => setWrongMentorNotice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-200 mt-1.5 font-medium leading-relaxed">
                {wrongMentorNotice.message}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playAutoRoute();
                    const path = computeAutoPath(avatarPos.current.x, avatarPos.current.y, wrongMentorNotice.targetIdx);
                    autoWP.current = path;
                    autoIdx.current = 0;
                    setWrongMentorNotice(null);
                    isManualCamera.current = false;
                    setShowRecenter(false);
                  }}
                  className="brawl-btn brawl-btn-yellow text-xs px-4 py-2 shadow-lg flex items-center gap-2"
                >
                  <span>🧭 AUTO-ROUTE TO {wrongMentorNotice.targetCode} ({wrongMentorNotice.targetName.toUpperCase()}) ➔</span>
                </button>
                <button
                  onClick={() => setWrongMentorNotice(null)}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Auto-Walk & Super Dash (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-end gap-3 opacity-90 hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            sound.playAutoRoute();
            const path = computeAutoPath(avatarPos.current.x, avatarPos.current.y, currentStageIndex);
            autoWP.current = path;
            autoIdx.current = 0;
            isManualCamera.current = false;
            setShowRecenter(false);
          }}
          className="brawl-btn brawl-btn-blue text-xs px-3.5 py-2.5 shadow-lg flex items-center gap-1.5"
          title="Auto-walk inside the department room to the mentor"
        >
          <span>WALK TO MENTOR ➔</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              sound.playSuperDash();
              const ddx = targetMentorPos.x - avatarPos.current.x;
              const ddy = targetMentorPos.y - avatarPos.current.y;
              const dd = Math.hypot(ddx, ddy);
              if (dd > 10) {
                let nx = avatarPos.current.x + (ddx / dd) * 110;
                let ny = avatarPos.current.y + (ddy / dd) * 110;
                if (!isWalkable(nx, ny)) {
                  if (isWalkable(nx, avatarPos.current.y)) ny = avatarPos.current.y;
                  else if (isWalkable(avatarPos.current.x, ny)) nx = avatarPos.current.x;
                  else { nx = avatarPos.current.x; ny = avatarPos.current.y; }
                }
                avatarPos.current.x = nx;
                avatarPos.current.y = ny;
                for (let p = 0; p < 12; p++) {
                  particles.current.push({
                    x: nx, y: ny,
                    vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                    size: Math.random() * 3 + 2, alpha: 1, color: '#00F0FF'
                  });
                }
              }
            }}
            className="brawl-super-btn animate-pulse"
            title="SUPER DASH toward mentor!"
          >
            ⚡
          </button>
          <span className="text-[10px] font-brawl text-yellow-400 uppercase tracking-wider">SUPER DASH</span>
        </div>
      </div>
    </div>
  );
};
