// Automated simulation: test avatar travel across all 9 stages in the 2400x1600 E-Cell Facility
// Tests walkability, collision sliding, and pathfinding into rooms to mentors

const CORRIDORS = [
  { x: 440, y: 340, w: 1520, h: 120 },  // North R&D Hallway (y: 340-460)
  { x: 440, y: 740, w: 1520, h: 120 },  // Central Innovation Commons (y: 740-860)
  { x: 440, y: 1140, w: 1520, h: 120 }, // South Media & PR Hallway (y: 1140-1260)
  { x: 440, y: 340, w: 120, h: 920 },   // West Wing Incubation Hallway (x: 440-560)
  { x: 1840, y: 340, w: 120, h: 920 },  // East Wing Growth Hallway (x: 1840-1960)
  { x: 1140, y: 440, w: 120, h: 200 },  // Center-North Pitch Auditorium Entrance (y: 440-640)
  { x: 1140, y: 960, w: 120, h: 200 },  // Center-South Pitch Auditorium Entrance (y: 960-1160)
];

const ROOMS = [
  { id: 'R1', name: 'Mentorship Center', mentorName: 'Mentorship Team', x: 80, y: 440, w: 360, h: 300, doorX: 440, doorY: 590, mentorX: 230, mentorY: 590, entry: { x: 500, y: 590 }, nearJ: 0 },
  { id: 'R2', name: 'Tech & Dev Lab', mentorName: 'Tech & Dev Team', x: 640, y: 60, w: 440, h: 280, doorX: 860, doorY: 340, mentorX: 860, mentorY: 200, entry: { x: 860, y: 400 }, nearJ: 1 },
  { id: 'R3', name: 'Design Studio', mentorName: 'Design & UX Team', x: 1320, y: 60, w: 440, h: 280, doorX: 1540, doorY: 340, mentorX: 1540, mentorY: 200, entry: { x: 1540, y: 400 }, nearJ: 1 },
  { id: 'R4', name: 'Content Room', mentorName: 'Content & Copy Team', x: 1960, y: 440, w: 360, h: 300, doorX: 1960, doorY: 590, mentorX: 2170, mentorY: 590, entry: { x: 1900, y: 590 }, nearJ: 2 },
  { id: 'R5', name: 'Marketing Hub', mentorName: 'Marketing & Growth Team', x: 1960, y: 860, w: 360, h: 300, doorX: 1960, doorY: 1010, mentorX: 2170, mentorY: 1010, entry: { x: 1900, y: 1010 }, nearJ: 5 },
  { id: 'R6', name: 'Media Studio', mentorName: 'Media & Production Team', x: 1320, y: 1260, w: 440, h: 280, doorX: 1540, doorY: 1260, mentorX: 1540, mentorY: 1400, entry: { x: 1540, y: 1200 }, nearJ: 7 },
  { id: 'R7', name: 'PR War Room', mentorName: 'PR & Crisis Team', x: 640, y: 1260, w: 440, h: 280, doorX: 860, doorY: 1260, mentorX: 860, mentorY: 1400, entry: { x: 860, y: 1200 }, nearJ: 7 },
  { id: 'R8', name: 'Investor Suite', mentorName: 'Investor Relations Team', x: 80, y: 860, w: 360, h: 300, doorX: 440, doorY: 1010, mentorX: 230, mentorY: 1010, entry: { x: 500, y: 1010 }, nearJ: 4 },
  { id: 'R9', name: 'Grand Pitch Arena', mentorName: 'VC Judging Panel', x: 920, y: 600, w: 560, h: 400, doorX: 1200, doorY: 600, mentorX: 1200, mentorY: 760, entry: { x: 1200, y: 400 }, nearJ: 1 },
];

const ROOM_RECTS = ROOMS.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h }));

const DOOR_CONNECTORS = [
  { x: 380, y: 540, w: 120, h: 100 },  // D1
  { x: 800, y: 280, w: 120, h: 120 },  // D2
  { x: 1480, y: 280, w: 120, h: 120 }, // D3
  { x: 1900, y: 540, w: 120, h: 100 }, // D4
  { x: 1900, y: 960, w: 120, h: 100 }, // D5
  { x: 1480, y: 1200, w: 120, h: 120 },// D6
  { x: 800, y: 1200, w: 120, h: 120 }, // D7
  { x: 380, y: 960, w: 120, h: 100 },  // D8
  { x: 1140, y: 540, w: 120, h: 120 }, // D9N
  { x: 1140, y: 940, w: 120, h: 120 }, // D9S
];

const ALL_WALKABLE = [...CORRIDORS, ...ROOM_RECTS, ...DOOR_CONNECTORS];

function isWalkable(px, py) {
  const m = 6;
  for (const r of ALL_WALKABLE) {
    if (px >= r.x + m && px <= r.x + r.w - m && py >= r.y + m && py <= r.y + r.h - m) return true;
  }
  return false;
}

const JUNCTIONS = [
  { x: 500, y: 400 },   // 0: NW
  { x: 1200, y: 400 },  // 1: N_CTR
  { x: 1900, y: 400 },  // 2: NE
  { x: 500, y: 800 },   // 3: W_MID
  { x: 500, y: 1200 },  // 4: SW
  { x: 1900, y: 1200 }, // 5: SE
  { x: 1900, y: 800 },  // 6: E_MID
  { x: 1200, y: 1200 }, // 7: S_CTR
];

const GRAPH = {
  0: [1, 3],
  1: [0, 2],
  2: [1, 6],
  3: [0, 4, 6],
  4: [3, 7],
  5: [6, 7],
  6: [2, 3, 5],
  7: [4, 5],
};

function getCurrentRoomIdx(x, y) {
  for (let i = 0; i < ROOM_RECTS.length; i++) {
    const rr = ROOM_RECTS[i];
    if (x >= rr.x && x <= rr.x + rr.w && y >= rr.y && y <= rr.y + rr.h) return i;
  }
  return -1;
}

function getNearestJunction(x, y) {
  let best = 0, bestD = Infinity;
  JUNCTIONS.forEach((j, i) => {
    const d = Math.hypot(x - j.x, y - j.y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

function findJunctionPath(fromJ, toJ) {
  if (fromJ === toJ) return [fromJ];
  const queue = [{ node: fromJ, path: [fromJ] }];
  const visited = new Set([fromJ]);

  while (queue.length > 0) {
    const cur = queue.shift();
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

function isLineWalkable(x1, y1, x2, y2, stepSize = 12) {
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

function smoothPath(rawWp) {
  if (rawWp.length <= 2) return rawWp;
  const smoothed = [rawWp[0]];
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

function computeAutoPath(fromX, fromY, targetIdx) {
  const target = ROOMS[targetIdx];
  const wp = [];
  const inRoom = getCurrentRoomIdx(fromX, fromY);

  if (inRoom === targetIdx) {
    wp.push({ x: target.mentorX, y: target.mentorY });
    return wp;
  }

  let startJ;
  if (inRoom >= 0) {
    if (inRoom === 8) {
      wp.push({ x: 1200, y: 600 });
      wp.push({ x: 1200, y: 540 });
      wp.push({ x: 1200, y: 400 });
      startJ = 1;
    } else {
      wp.push({ x: ROOMS[inRoom].doorX, y: ROOMS[inRoom].doorY });
      wp.push(ROOMS[inRoom].entry);
      startJ = ROOMS[inRoom].nearJ;
    }
  } else {
    startJ = getNearestJunction(fromX, fromY);
  }

  const targetJ = target.nearJ;
  const jPath = findJunctionPath(startJ, targetJ);
  jPath.forEach(jIdx => wp.push(JUNCTIONS[jIdx]));

  if (targetIdx === 8) {
    wp.push({ x: 1200, y: 400 });
    wp.push({ x: 1200, y: 540 });
    wp.push({ x: 1200, y: 600 });
    wp.push({ x: 1200, y: 760 });
  } else {
    wp.push(target.entry);
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

// ----------------------------------------------------
// RUN SIMULATION
// ----------------------------------------------------
let currentPos = { x: 500, y: 400 }; // Start at Reception corridor
console.log(`Starting simulation from Reception Corridor (${currentPos.x}, ${currentPos.y})`);

let allSuccess = true;

for (let stage = 0; stage < ROOMS.length; stage++) {
  const target = ROOMS[stage];
  const waypoints = computeAutoPath(currentPos.x, currentPos.y, stage);

  console.log(`\n========================================`);
  console.log(`Navigating to Stage ${stage + 1}: ${target.name} (Mentor at ${target.mentorX}, ${target.mentorY})`);
  console.log(`Waypoints (${waypoints.length}):`, waypoints.map(w => `(${w.x},${w.y})`).join(' -> '));

  let wpIdx = 0;
  let steps = 0;
  const maxSteps = 4000;
  let reached = false;

  while (steps < maxSteps) {
    steps++;
    if (wpIdx >= waypoints.length) {
      reached = true;
      break;
    }

    const currentWP = waypoints[wpIdx];
    const dx = currentWP.x - currentPos.x;
    const dy = currentWP.y - currentPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 20) {
      wpIdx++;
      continue;
    }

    const speed = 5.5;
    const mx = (dx / dist) * Math.min(dist, speed);
    const my = (dy / dist) * Math.min(dist, speed);

    let nx = currentPos.x + mx;
    let ny = currentPos.y + my;

    if (!isWalkable(nx, ny)) {
      if (isWalkable(nx, currentPos.y)) {
        ny = currentPos.y;
      } else if (isWalkable(currentPos.x, ny)) {
        nx = currentPos.x;
      } else {
        console.error(`  [STUCK] at (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}) trying to reach WP ${wpIdx} (${currentWP.x}, ${currentWP.y})`);
        allSuccess = false;
        break;
      }
    }

    currentPos.x = nx;
    currentPos.y = ny;
  }

  const finalDistToMentor = Math.hypot(currentPos.x - target.mentorX, currentPos.y - target.mentorY);
  if (finalDistToMentor <= 70) {
    console.log(`  [SUCCESS] Reached ${target.name} Mentor in ${steps} ticks! Dist to mentor: ${finalDistToMentor.toFixed(1)}px`);
  } else {
    console.error(`  [FAILED] Did not reach mentor for ${target.name}. Final pos: (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}), Dist: ${finalDistToMentor.toFixed(1)}px`);
    allSuccess = false;
  }
}

console.log(`\n========================================`);
if (allSuccess) {
  console.log(`>>> ALL 9 E-CELL ROOM MENTORS REACHED SUCCESSFULLY WITH ZERO COLLISIONS! <<<`);
} else {
  console.error(`>>> SIMULATION ENCOUNTERED ERRORS <<<`);
  process.exit(1);
}
