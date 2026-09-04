// Automated simulation script to test avatar travel across all 9 stages in expanded 3000x2000 arena
const buildings = [
  { id: 'stage-mentorship', name: 'E-Cell HQ', x: 450, y: 550, doorX: 450, doorY: 625 },
  { id: 'stage-technical', name: 'Tech Lab', x: 1100, y: 380, doorX: 1100, doorY: 455 },
  { id: 'stage-design', name: 'Design Studio', x: 1900, y: 380, doorX: 1900, doorY: 455 },
  { id: 'stage-content', name: 'Content Room', x: 2500, y: 550, doorX: 2425, doorY: 550 },
  { id: 'stage-marketing', name: 'Marketing Hub', x: 2500, y: 1400, doorX: 2425, doorY: 1400 },
  { id: 'stage-media', name: 'Media Lab', x: 1900, y: 1600, doorX: 1900, doorY: 1525 },
  { id: 'stage-pr', name: 'PR War Room', x: 1100, y: 1600, doorX: 1100, doorY: 1525 },
  { id: 'stage-sponsorship', name: 'Investor Suite', x: 450, y: 1400, doorX: 525, doorY: 1400 },
  { id: 'stage-pitch', name: 'Pitch Arena', x: 1500, y: 1000, doorX: 1500, doorY: 1000 },
];

const WORLD_MIN_X = 60;
const WORLD_MAX_X = 2940;
const WORLD_MIN_Y = 60;
const WORLD_MAX_Y = 1940;

let currentPos = { x: 250, y: 625 };
let totalFailures = 0;

console.log("=== STARTING AVATAR PATH & SIMULATION VERIFICATION (EXPANDED ARENA 3000x2000) ===");

for (let i = 0; i < buildings.length; i++) {
  const target = buildings[i];
  const targetDoor = { x: target.doorX, y: target.doorY };
  console.log(`\nSimulating travel from (${Math.round(currentPos.x)}, ${Math.round(currentPos.y)}) -> ${target.name} door (${targetDoor.x}, ${targetDoor.y})...`);

  const waypoints = [targetDoor];

  let currentWpIdx = 0;
  let steps = 0;
  let reached = false;
  const maxSteps = 1000;

  while (steps < maxSteps) {
    steps++;
    const currentGoal = waypoints[currentWpIdx];
    const dx = currentGoal.x - currentPos.x;
    const dy = currentGoal.y - currentPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 45) {
      if (currentWpIdx < waypoints.length - 1) {
        currentWpIdx++;
        continue;
      } else {
        reached = true;
        break;
      }
    }

    const speed = 4.5;
    let nextX = currentPos.x + (dx / dist) * Math.min(dist, speed);
    let nextY = currentPos.y + (dy / dist) * Math.min(dist, speed);

    // Clamp
    nextX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, nextX));
    nextY = Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, nextY));

    // Collision check against all buildings
    for (const b of buildings) {
      if (b.id === 'stage-pitch') continue; // Open showdown arena
      // Solid roof bounding box
      const bLeft = b.x - 60;
      const bRight = b.x + 60;
      const bTop = b.y - 45;
      const bBottom = b.y + 35;

      if (nextX > bLeft && nextX < bRight && nextY > bTop && nextY < bBottom) {
        // If hitting horizontal wall (top or bottom), deflect around the nearest side corner
        if (currentPos.y <= bTop || currentPos.y >= bBottom) {
          nextY = currentPos.y; // Stop vertical movement
          // Deflect horizontally towards the closest edge to walk around the building
          const distToLeft = Math.abs(currentPos.x - bLeft);
          const distToRight = Math.abs(currentPos.x - bRight);
          const deflectDir = distToLeft < distToRight ? -1 : 1;
          nextX = currentPos.x + deflectDir * speed;
        } 
        // If hitting vertical wall (left or right), deflect around the nearest top/bottom corner
        else if (currentPos.x <= bLeft || currentPos.x >= bRight) {
          nextX = currentPos.x; // Stop horizontal movement
          const distToTop = Math.abs(currentPos.y - bTop);
          const distToBottom = Math.abs(currentPos.y - bBottom);
          const deflectDir = distToTop < distToBottom ? -1 : 1;
          nextY = currentPos.y + deflectDir * speed;
        }
      }
    }

    // Check if stuck (zero movement)
    if (Math.hypot(nextX - currentPos.x, nextY - currentPos.y) < 0.001 && dist > 65) {
      console.error(`❌ STUCK DETECTED at step ${steps} at position (${currentPos.x}, ${currentPos.y}) targeting ${target.name}`);
      totalFailures++;
      break;
    }

    currentPos.x = nextX;
    currentPos.y = nextY;
  }

  if (reached) {
    console.log(`✅ REACHED ${target.name} in ${steps} steps! Current pos: (${Math.round(currentPos.x)}, ${Math.round(currentPos.y)})`);
  } else {
    console.error(`❌ FAILED TO REACH ${target.name} within ${maxSteps} steps!`);
    totalFailures++;
  }
}

console.log("\n=======================================================");
if (totalFailures === 0) {
  console.log("🎉 ALL 9 BUILDING SIMULATIONS PASSED WITH 0 STUCK INCIDENTS!");
} else {
  console.error(`💥 SIMULATION FAILED WITH ${totalFailures} ERRORS`);
  process.exit(1);
}
