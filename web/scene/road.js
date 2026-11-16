// A street in front of the open floor: two lanes of CSS cars, positioned from the camera each frame so the
// road stays next to the building (not on the desks). pointer-events stay off, so it never takes a click.
// prefers-reduced-motion parks the cars (scene.css).
import * as THREE from 'three';

const VEHICLES = [
  { dir: 1, kind: 'sedan', color: '#2F6BFF', delay: '-1.4s', dur: '16s' },
  { dir: 1, kind: 'van', color: '#FF9F0A', delay: '-7.5s', dur: '21s' },
  { dir: 1, kind: 'hatch', color: '#34C759', delay: '-12s', dur: '13s' },
  { dir: -1, kind: 'sedan', color: '#FF4FA0', delay: '-3.2s', dur: '15s' },
  { dir: -1, kind: 'wagon', color: '#1D1D1F', delay: '-9s', dur: '18s' },
  { dir: -1, kind: 'hatch', color: '#F7F4EE', delay: '-5.5s', dur: '12.5s' },
];

// In front of the slab (interior z ≤ 6), wide enough to read as a street beside the tower.
const ENDS = [{ x: -20, z: 11.4 }, { x: 20, z: 11.4 }];
const tmp = new THREE.Vector3();

function vehicle(spec) {
  const el = document.createElement('i');
  el.className = `hq-vehicle hq-vehicle-${spec.kind}`;
  el.style.setProperty('--c', spec.color);
  el.style.setProperty('--d', spec.delay);
  el.style.setProperty('--dur', spec.dur);
  el.setAttribute('aria-hidden', 'true');
  return el;
}

export function createRoad(container) {
  const go = document.createElement('div');
  go.className = 'hq-lane hq-lane-go';
  const back = document.createElement('div');
  back.className = 'hq-lane hq-lane-back';
  for (const spec of VEHICLES) (spec.dir > 0 ? go : back).append(vehicle(spec));
  const surface = document.createElement('div');
  surface.className = 'hq-road-surface';
  surface.append(go, back);
  const root = document.createElement('div');
  root.className = 'hq-road';
  root.hidden = true;
  root.setAttribute('aria-hidden', 'true');
  root.append(surface);
  container.append(root);

  return {
    root,
    update(camera, groundY, width, height) {
      if (!camera || !(width > 0) || !(height > 0)) { root.hidden = true; return; }
      const p = (x, z) => {
        tmp.set(x, groundY + 0.02, z).project(camera);
        return {
          x: (tmp.x * 0.5 + 0.5) * width,
          y: (-tmp.y * 0.5 + 0.5) * height,
          z: tmp.z,
        };
      };
      const a = p(ENDS[0].x, ENDS[0].z);
      const b = p(ENDS[1].x, ENDS[1].z);
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      // Off the frustum, or so short it would sit on top of the building: hide it.
      if (a.z < -1 || a.z > 1 || b.z < -1 || b.z > 1 || len < 80) { root.hidden = true; return; }
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      root.hidden = false;
      root.style.left = `${a.x}px`;
      root.style.top = `${a.y - 18}px`;
      root.style.width = `${len}px`;
      root.style.transform = `rotate(${ang}deg)`;
      root.style.setProperty('--travel', `${len + 72}px`);
    },
  };
}
