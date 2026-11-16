// The block around the tower: one grass plane, a handful of trees, and a few dull neighbours.
// Nothing here animates. The tower's own red glow lives on the building, so these stay quiet.
import * as THREE from 'three';

const TREE_AT = [
  [-16, -8], [-18, 2], [-14, -16], [16, -14], [20, -6], [6, -20], [-6, -18], [24, 8], [-22, 10], [14, 18],
];
const BLOCKS = [
  { x: -24, z: -2, w: 7, d: 6, h: 9, c: '#8d93a0' },
  { x: -14, z: -22, w: 9, d: 7, h: 13, c: '#9aa0ab' },
  { x: 10, z: -24, w: 8, d: 6, h: 11, c: '#7e868f' },
  { x: 26, z: -1, w: 6, d: 8, h: 15, c: '#a3a8b2' },
];

function windowTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#6e7580';
  g.fillRect(0, 0, 32, 64);
  for (let y = 4; y < 64; y += 8) {
    for (let x = 3; x < 32; x += 7) {
      g.fillStyle = (x + y) % 11 === 0 ? '#f0d7a2' : '#c5d0dc';
      g.fillRect(x, y, 3, 4);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function tree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.7, 5),
    new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.9 }),
  );
  trunk.position.y = 0.35;
  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 1.5, 6),
    new THREE.MeshStandardMaterial({ color: '#3f8f4e', roughness: 0.85 }),
  );
  crown.position.y = 1.35;
  g.add(trunk, crown);
  return g;
}

export function createCity(scene) {
  const root = new THREE.Group();
  root.name = 'city';

  const grass = new THREE.Mesh(
    new THREE.CircleGeometry(42, 28),
    new THREE.MeshStandardMaterial({ color: '#7fbf62', roughness: 1 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.04;
  root.add(grass);

  const proto = tree();
  for (const [x, z] of TREE_AT) {
    const t = proto.clone(true);
    t.position.set(x, 0, z);
    t.scale.setScalar(0.85 + ((x * 13 + z) % 5) * 0.08);
    root.add(t);
  }

  const windows = windowTexture();
  for (const b of BLOCKS) {
    const map = windows.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(b.w / 4, b.h / 3);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(b.w, b.h, b.d),
      new THREE.MeshStandardMaterial({ color: b.c, map, roughness: 0.82, metalness: 0.02 }),
    );
    mesh.position.set(b.x, b.h / 2, b.z);
    root.add(mesh);
  }

  scene.add(root);
  return root;
}

/** A small cutaway room for an empty storey or the roof. One copy, moved onto the open floor. */
export function createSimpleRoom() {
  const root = new THREE.Group();
  root.name = 'simple-room';
  root.visible = false;

  const floorMat = new THREE.MeshStandardMaterial({ color: '#e7e1d6', roughness: 0.9 });
  const wallMat = new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.85 });
  const deskMat = new THREE.MeshStandardMaterial({ color: '#c4a574', roughness: 0.7 });
  const plantMat = new THREE.MeshStandardMaterial({ color: '#3c8f55', roughness: 0.8 });
  const potMat = new THREE.MeshStandardMaterial({ color: '#f7f4ee', roughness: 0.6 });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.08, 7.4), floorMat);
  floor.position.y = 0.04;
  const back = new THREE.Mesh(new THREE.BoxGeometry(9.2, 2.3, 0.08), wallMat);
  back.position.set(0, 1.15, -3.66);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 7.4), wallMat);
  left.position.set(-4.56, 1.15, 0);
  const right = left.clone();
  right.position.x = 4.56;
  const partX = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.05, 0.06), wallMat);
  partX.position.set(0, 0.55, 0);
  const partZ = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 7.4), wallMat);
  partZ.position.set(0, 0.55, 0);

  const desks = [];
  for (const [x, z] of [[-2.2, -1.7], [2.2, -1.7], [-2.2, 1.6], [2.2, 1.6]]) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.7), deskMat);
    d.position.set(x, 0.72, z);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.64, 0.08), deskMat);
    leg.position.set(x, 0.36, z - 0.28);
    desks.push(d, leg);
  }

  function plant(x, z) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.22, 6), potMat);
    pot.position.set(x, 0.14, z);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.28, 7, 6), plantMat);
    leaf.position.set(x, 0.42, z);
    return [pot, leaf];
  }

  const walls = [back, left, right];
  const parts = [partX, partZ];
  root.add(floor, ...walls, ...parts, ...desks, ...plant(-3.6, 2.8), ...plant(3.6, -2.8));

  return {
    root,
    /** Roof is a terrace: low parapet, no room dividers. */
    setRoof(on) {
      const h = on ? 0.45 : 2.3;
      const y = h / 2;
      for (const w of walls) { w.scale.y = h / 2.3; w.position.y = y; }
      for (const p of parts) p.visible = !on;
      floor.material.color.set(on ? '#d5d8de' : '#e7e1d6');
    },
  };
}
