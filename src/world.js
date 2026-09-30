import * as T from 'three';
import {normalized,createWitch} from './assets.js';

export const PHASES = {
  floresta: {
    id: 'floresta',
    name: 'Floresta Encantada',
    short: '01 · FLORESTA',
    blurb: 'Runas, riacho luminoso e anéis entre as árvores.',
    duration: 90,
    bg: '#12082a', fog: '#2a1858', fogDensity: .0075,
    hemi: ['#c8b0ff', '#1a0a30'], moon: '#e8d0ff', fill: '#80c0ff', rim: '#ff80d0',
    groundH: .88, treeTints: ['#4a2a6e', '#6a3a7a', '#8a3a6a', '#5a4a8a'],
    water: {color: '#3060a0', emissive: '#40c0ff', intensity: .45},
    firefly: '#a0e8ff', orb: '#ffc0e8', orbGlow: '#ff6ec7',
    ring: '#ff9ec8', ringOuter: '#c070b0', rune: '#f0c96a',
    star: '#d0e8ff', grass: '#3a2a58', rock: '#5a3a58',
    mapLabel: 'FLORESTA ENCANTADA',
  },
  vila: {
    id: 'vila',
    name: 'Vila de Halloween',
    short: '02 · VILA',
    blurb: 'Telhados, abóboras e vielas sob a lua laranja.',
    duration: 90,
    bg: '#0c1018', fog: '#1a1520', fogDensity: .008,
    hemi: ['#ffd0a0', '#1a1010'], moon: '#ffe8c0', fill: '#ff8040', rim: '#c060ff',
    groundH: .08, treeTints: ['#c06020', '#a04010', '#804020', '#603010'],
    water: {color: '#2a3040', emissive: '#ff9020', intensity: .2},
    firefly: '#ffb040', orb: '#ffcc66', orbGlow: '#ff8020',
    ring: '#ffb040', ringOuter: '#c07020', rune: '#ffe080',
    star: '#ffe8c8', grass: '#2a2010', rock: '#3a3028',
    mapLabel: 'VILA DE HALLOWEEN',
  },
  castelo: {
    id: 'castelo',
    name: 'Castelo da Lua',
    short: '03 · CASTELO',
    blurb: 'Torres rosa, lago espelhado e voo entre penhascos.',
    duration: 90,
    bg: '#1a0620', fog: '#3a1040', fogDensity: .0065,
    hemi: ['#ffb0e0', '#200418'], moon: '#ffd0f0', fill: '#e040a0', rim: '#8060ff',
    groundH: .92, treeTints: ['#a04080', '#c060a0', '#803060', '#602050'],
    water: {color: '#501060', emissive: '#ff40c0', intensity: .55},
    firefly: '#ff80d0', orb: '#ffb0e8', orbGlow: '#ff40b0',
    ring: '#ff80d0', ringOuter: '#c04090', rune: '#f0c96a',
    star: '#ffd0f0', grass: '#3a1830', rock: '#4a2040',
    mapLabel: 'CASTELO DA LUA',
  },
};

export const ground = (x, z) =>
  Math.sin(x * .024) * 1.8 + Math.cos(z * .03) * 1.3 + Math.sin((x + z) * .018) * 1.2 - 3;

export const routePoint = t => {
  const x = 90 - 95 * Math.cos(t);
  const z = 90 - 100 * Math.sin(t);
  const region = Math.sin(t * 1.5);
  const y = 6.5 + Math.sin(t * 2.2) * 4.5 + Math.sin(t * 5) * 1.2 + (region > 0.4 ? 3 : 0);
  return new T.Vector3(x, y, z);
};

function randomGenerator() {
  let s = 12983;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#fff');
  g.addColorStop(.1, '#fff');
  g.addColorStop(.3, '#ffffff88');
  g.addColorStop(1, '#ffffff00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
}

export class World {
  constructor(scene, assets, phaseId = 'floresta') {
    this.scene = scene;
    this.assets = assets;
    this.phaseId = phaseId;
    this.phase = PHASES[phaseId] || PHASES.floresta;
    this.colliders = [];
    this.rings = [];
    this.orbs = [];
    this.npcs = [];
    this.decor = [];
    this.lights = [];
    this.glow = glowTexture();
    const rng = randomGenerator();
    this.rng = rng;
    const ph = this.phase;

    scene.background = new T.Color(ph.bg);
    scene.fog = new T.FogExp2(ph.fog, ph.fogDensity);

    const hemi = new T.HemisphereLight(ph.hemi[0], ph.hemi[1], 2.2);
    scene.add(hemi); this.lights.push(hemi);
    const moonlight = new T.DirectionalLight(ph.moon, 3.4);
    moonlight.position.set(-70, 150, -100);
    scene.add(moonlight); this.lights.push(moonlight);
    const fill = new T.DirectionalLight(ph.fill, 1.4);
    fill.position.set(90, 40, 90);
    scene.add(fill); this.lights.push(fill);
    const rim = new T.DirectionalLight(ph.rim, 0.9);
    rim.position.set(-40, 20, 60);
    scene.add(rim); this.lights.push(rim);

    // Terrain
    const terrain = new T.PlaneGeometry(700, 700, 110, 110);
    terrain.rotateX(-Math.PI / 2);
    const p = terrain.attributes.position;
    const colors = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + 90, z = p.getZ(i);
      p.setX(i, x);
      p.setY(i, ground(x, z));
      const c = new T.Color().setHSL(ph.groundH + rng() * .06, .28, .08 + rng() * .06);
      colors.push(c.r, c.g, c.b);
    }
    terrain.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    terrain.computeVertexNormals();
    const terrainMesh = new T.Mesh(terrain, new T.MeshStandardMaterial({vertexColors: true, roughness: 1}));
    scene.add(terrainMesh); this.decor.push(terrainMesh);

    // Water / river / lake
    const riverGeo = new T.PlaneGeometry(phaseId === 'castelo' ? 90 : 40, phaseId === 'castelo' ? 90 : 220, 1, 1);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new T.MeshStandardMaterial({
      color: ph.water.color, emissive: ph.water.emissive,
      emissiveIntensity: ph.water.intensity, roughness: .15, metalness: .5,
      transparent: true, opacity: .9,
    });
    const river = new T.Mesh(riverGeo, riverMat);
    if (phaseId === 'castelo') {
      river.position.set(90, .15, -20);
    } else {
      river.position.set(90, .2, 10);
      river.rotation.y = .35;
    }
    scene.add(river); this.decor.push(river);
    for (let i = 0; i < 14; i++) {
      const z = phaseId === 'castelo' ? -40 + (i % 7) * 12 : -90 + i * 16;
      const wx = phaseId === 'castelo' ? 90 + Math.sin(i) * 20 : 90 + Math.sin(i * .7) * 8;
      this.addGlow(new T.Vector3(wx, .6, z), ph.water.emissive, 5, .4);
      this.addGlow(new T.Vector3(wx, .4, z), ph.firefly, 2, .7);
    }

    this.regions = [
      {name: phaseId === 'vila' ? 'Praça Central' : phaseId === 'castelo' ? 'Pátio' : 'Floresta Profunda', x: 40, z: 120},
      {name: phaseId === 'vila' ? 'Vielas' : phaseId === 'castelo' ? 'Lago Rosa' : 'Rio da Lua', x: 90, z: 10},
      {name: phaseId === 'vila' ? 'Torre do Relógio' : phaseId === 'castelo' ? 'Torres' : 'Ruínas da Academia', x: 140, z: -40},
    ];

    // Moon
    const moon = new T.Mesh(new T.SphereGeometry(16, 32, 24), new T.MeshBasicMaterial({color: phaseId === 'vila' ? '#ffe8b0' : '#f0e8ff', fog: false}));
    moon.position.set(-100, 80, -180);
    scene.add(moon); this.decor.push(moon);
    const halo = new T.Sprite(new T.SpriteMaterial({map: this.glow, color: phaseId === 'vila' ? '#ffc070' : phaseId === 'castelo' ? '#ff80d0' : '#b0a0ff', transparent: true, opacity: .35, blending: T.AdditiveBlending, depthWrite: false, fog: false}));
    halo.position.copy(moon.position); halo.scale.set(110, 110, 1);
    scene.add(halo); this.decor.push(halo);

    // Stars
    const stars = [];
    for (let i = 0; i < 850; i++) {
      const a = rng() * 6.28, y = 70 + rng() * 250, r = 280 + rng() * 80;
      stars.push(90 + Math.cos(a) * r, y, Math.sin(a) * r);
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.Float32BufferAttribute(stars, 3));
    const starPts = new T.Points(sg, new T.PointsMaterial({size: .65, color: ph.star, sizeAttenuation: true, fog: false}));
    scene.add(starPts); this.decor.push(starPts);

    // Trees
    const treeNames = ['tree_pine_orange_large', 'tree_pine_yellow_large', 'tree_dead_large', 'tree_dead_medium'];
    const groups = [[], [], [], []];
    for (let i = 0; i < 220; i++) {
      const x = 90 + (rng() - .5) * 420, z = (rng() - .5) * 400;
      if (Math.hypot(x - 90, z) < 28) continue;
      const gi = Math.floor(rng() * 4);
      groups[gi].push({x, z, y: ground(x, z), s: .7 + rng() * .9, rot: rng() * 6.28});
      this.colliders.push({x, z, y: ground(x, z), height: 8 + rng() * 6, r: 1.2 + rng()});
    }
    treeNames.forEach((n, i) => this.instances(assets[n], groups[i], ph.treeTints[i]));

    // Halloween props denser in vila
    const propCount = phaseId === 'vila' ? 40 : 18;
    for (let i = 0; i < propCount; i++) {
      const t = rng() * 6.28, v = routePoint(t);
      const x = v.x + (rng() - .5) * 30, z = v.z + (rng() - .5) * 30;
      const y = ground(x, z);
      if (assets.pumpkin_orange_jackolantern && rng() > .3) {
        this.instances(assets.pumpkin_orange_jackolantern, [{x, z, y, s: .6 + rng() * .5, rot: rng() * 6}]);
        this.addGlow(new T.Vector3(x, y + .5, z), phaseId === 'vila' ? '#ff9020' : '#ff982f', 3, .6);
      }
    }
    if (assets.lantern_standing) {
      for (let i = 0; i < (phaseId === 'vila' ? 16 : 8); i++) {
        const t = rng() * 6.28, v = routePoint(t);
        const x = v.x + (rng() - .5) * 20, z = v.z + (rng() - .5) * 20;
        this.instances(assets.lantern_standing, [{x, z, y: ground(x, z), s: 1, rot: rng() * 6}]);
        this.addGlow(new T.Vector3(x, ground(x, z) + 1.5, z), '#ffc070', 2.5, .5);
      }
    }
    // Ruins / arch for floresta & castelo
    if (phaseId !== 'vila' && assets.arch) {
      for (let i = 0; i < (phaseId === 'castelo' ? 6 : 3); i++) {
        const t = .8 + i * .9, v = routePoint(t);
        this.instances(assets.arch, [{x: v.x, z: v.z, y: ground(v.x, v.z), s: phaseId === 'castelo' ? 2.2 : 1.4, rot: t}]);
        this.colliders.push({x: v.x, z: v.z, y: ground(v.x, v.z), height: 10, r: 3});
      }
    }
    if (assets.crypt && phaseId !== 'castelo') {
      const v = routePoint(2.5);
      this.instances(assets.crypt, [{x: v.x + 12, z: v.z - 8, y: ground(v.x + 12, v.z - 8), s: 1.2, rot: .4}]);
    }
    // Castle silhouette blocks
    if (phaseId === 'castelo') {
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * 6.28, r = 35 + (i % 3) * 8;
        const x = 90 + Math.cos(a) * r, z = -80 + Math.sin(a) * r * .4;
        const h = 14 + (i % 4) * 6;
        const tower = new T.Mesh(
          new T.CylinderGeometry(2.5 + (i % 3), 3.2, h, 6),
          new T.MeshStandardMaterial({color: '#c04090', emissive: '#ff40a0', emissiveIntensity: .15, roughness: .8})
        );
        tower.position.set(x, ground(x, z) + h / 2, z);
        scene.add(tower); this.decor.push(tower);
        this.colliders.push({x, z, y: ground(x, z), height: h, r: 3.5});
        this.addGlow(new T.Vector3(x, ground(x, z) + h * .7, z), '#ff60c0', 4, .4);
      }
    }
    // Village house blocks
    if (phaseId === 'vila') {
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * 6.28, r = 40 + rng() * 30;
        const x = 90 + Math.cos(a) * r, z = Math.sin(a) * r;
        const w = 4 + rng() * 3, h = 5 + rng() * 4, d = 4 + rng() * 3;
        const house = new T.Mesh(
          new T.BoxGeometry(w, h, d),
          new T.MeshStandardMaterial({color: '#3a2a28', roughness: .9})
        );
        house.position.set(x, ground(x, z) + h / 2, z);
        scene.add(house); this.decor.push(house);
        this.colliders.push({x, z, y: ground(x, z), height: h, r: Math.max(w, d) * .55});
        this.addGlow(new T.Vector3(x, ground(x, z) + h * .55, z), '#ff9020', 2.5, .55);
      }
    }

    // Rocks
    const rocks = [];
    for (let i = 0; i < 190; i++) {
      const x = 90 + (rng() - .5) * 450, z = (rng() - .5) * 400, s = 1 + rng() * 3;
      rocks.push({x, z, y: ground(x, z) - .3, s, rot: rng() * 6.28});
      this.colliders.push({x, z, y: ground(x, z), height: s, r: s * .65});
    }
    const rock = new T.Mesh(new T.IcosahedronGeometry(1, 1), new T.MeshStandardMaterial({color: ph.rock, roughness: 1, flatShading: true}));
    rock.scale.set(1, .65, .8);
    this.instances(rock, rocks);

    // Grass
    const blade = new T.BufferGeometry();
    blade.setAttribute('position', new T.Float32BufferAttribute([-.13, 0, 0, .13, 0, 0, .08, 1, 0, 0, 0, -.12, 0, 0, .12, 0, .8, .08], 3));
    blade.computeVertexNormals();
    const grass = new T.Mesh(blade, new T.MeshStandardMaterial({color: ph.grass, side: T.DoubleSide, roughness: 1}));
    const grassTransforms = [];
    for (let i = 0; i < 2800; i++) {
      const x = 90 + (rng() - .5) * 420, z = (rng() - .5) * 400;
      grassTransforms.push({x, z, y: ground(x, z), s: .5 + rng() * 1.2, rot: rng() * 6.28});
    }
    this.instances(grass, grassTransforms);

    // Fungi + flowers + runes
    const fungi = [];
    for (let i = 0; i < 120; i++) {
      const t = rng() * 6.28, v = routePoint(t);
      const x = v.x + (rng() - .5) * 28, z = v.z + (rng() - .5) * 28;
      fungi.push({x, z, y: ground(x, z) + .25, s: .2 + rng() * .35, rot: rng() * 6});
    }
    const mushroom = new T.Mesh(
      new T.SphereGeometry(1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2),
      new T.MeshStandardMaterial({color: phaseId === 'vila' ? '#ff9040' : '#a0f0e8', emissive: phaseId === 'vila' ? '#ff6020' : '#20e0c0', emissiveIntensity: .85})
    );
    this.instances(mushroom, fungi);
    for (let i = 0; i < 180; i++) {
      const x = 90 + (rng() - .5) * 380, z = (rng() - .5) * 360;
      const col = phaseId === 'vila' ? (rng() > .5 ? '#ff8020' : '#ffc040') : (rng() > .45 ? '#ff6ec7' : '#40e0ff');
      this.addGlow(new T.Vector3(x, ground(x, z) + .35, z), col, .55 + rng() * .5, .75);
    }
    if (phaseId !== 'vila') {
      for (let i = 0; i < 28; i++) {
        const t = rng() * 6.28, v = routePoint(t);
        const ang = rng() * 6.28, dist = 8 + rng() * 14;
        const x = v.x + Math.cos(ang) * dist, z = v.z + Math.sin(ang) * dist;
        const y = ground(x, z) + 2.5 + rng() * 4;
        this.addGlow(new T.Vector3(x, y, z), '#40d0ff', 1.8 + rng(), .55);
        this.addGlow(new T.Vector3(x, y, z), '#80f0ff', .7, .9);
      }
    }

    // Rings + orbs
    for (let i = 0; i < 18; i++) {
      const t = (i + 1) * Math.PI * 2 / 19;
      let pos = routePoint(t);
      if (i % 5 === 0) pos.y += 4.5;
      if (i % 5 === 2) pos.y = Math.max(3.5, pos.y - 3.2);
      if (i === 7 || i === 14) {
        pos.x = 90 + (pos.x - 90) * 0.72;
        pos.z = 90 + (pos.z - 90) * 0.72;
        pos.y += 1.5;
      }
      const g = new T.Group();
      g.position.copy(pos);
      const tangent = new T.Vector3(90 * Math.sin(t), 0, -95 * Math.cos(t)).normalize();
      g.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), tangent);
      g.add(new T.Mesh(new T.TorusGeometry(3.05, .065, 8, 64), new T.MeshBasicMaterial({color: ph.ring})));
      g.add(new T.Mesh(new T.TorusGeometry(3.34, .018, 4, 64), new T.MeshBasicMaterial({color: ph.ringOuter})));
      for (let j = 0; j < 8; j++) {
        const a = j / 8 * 6.28;
        const rune = new T.Mesh(new T.OctahedronGeometry(.12), new T.MeshBasicMaterial({color: ph.rune}));
        rune.position.set(Math.cos(a) * 3.35, Math.sin(a) * 3.35, 0);
        g.add(rune);
      }
      scene.add(g);
      this.rings.push({mesh: g, pos, collected: false});
      for (let j = 1; j <= 3; j++) this.addOrb(routePoint(t - j * .065));
    }

    // NPCs
    for (let i = 0; i < 4; i++) {
      const model = createWitch(assets);
      scene.add(model);
      this.npcs.push({model, phase: i * 1.6 + .9});
    }

    // Fireflies
    const positions = [];
    this.flyBase = [];
    for (let i = 0; i < 380; i++) {
      const v = new T.Vector3(90 + (rng() - .5) * 320, rng() * 14, (rng() - .5) * 300);
      positions.push(...v); this.flyBase.push(v);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    this.fireflies = new T.Points(geo, new T.PointsMaterial({size: .6, map: this.glow, color: ph.firefly, transparent: true, blending: T.AdditiveBlending, depthWrite: false}));
    scene.add(this.fireflies); this.decor.push(this.fireflies);
  }

  dispose() {
    for (const o of this.decor) {
      this.scene.remove(o);
      if (o.geometry) o.geometry.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose?.());
        else o.material.dispose?.();
      }
    }
    for (const r of this.rings) this.scene.remove(r.mesh);
    for (const o of this.orbs) { this.scene.remove(o.mesh); this.scene.remove(o.glow); }
    for (const n of this.npcs) this.scene.remove(n.model);
    for (const l of this.lights) this.scene.remove(l);
    this.decor = []; this.rings = []; this.orbs = []; this.npcs = []; this.colliders = []; this.lights = [];
  }

  instances(source, transforms, tint) {
    if (!source || !transforms.length) return;
    const model = normalized(source, 1);
    model.updateMatrixWorld(true);
    const dummy = new T.Object3D(), mat = new T.Matrix4();
    model.traverse(mesh => {
      if (!mesh.isMesh) return;
      const material = mesh.material.clone();
      if (tint) {
        material.color.set(tint);
        material.emissive.set(tint);
        material.emissiveIntensity = .035;
      }
      const batch = new T.InstancedMesh(mesh.geometry, material, transforms.length);
      transforms.forEach((v, i) => {
        dummy.position.set(v.x, v.y, v.z);
        dummy.rotation.y = v.rot;
        dummy.scale.setScalar(v.s);
        dummy.updateMatrix();
        mat.multiplyMatrices(dummy.matrix, mesh.matrixWorld);
        batch.setMatrixAt(i, mat);
      });
      batch.computeBoundingSphere();
      this.scene.add(batch);
      this.decor.push(batch);
    });
  }

  addGlow(pos, color, size, opacity) {
    const s = new T.Sprite(new T.SpriteMaterial({map: this.glow, color, transparent: true, opacity, blending: T.AdditiveBlending, depthWrite: false}));
    s.position.copy(pos);
    s.scale.set(size, size, 1);
    this.scene.add(s);
    this.decor.push(s);
    return s;
  }

  addOrb(pos) {
    const ph = this.phase;
    const mesh = new T.Mesh(new T.OctahedronGeometry(.22), new T.MeshBasicMaterial({color: ph.orb}));
    mesh.position.copy(pos);
    this.scene.add(mesh);
    const glow = this.addGlow(pos, ph.orbGlow, 1.6, .7);
    this.orbs.push({pos, mesh, glow, collected: false});
  }

  update(t, dt) {
    this.npcs.forEach((n, i) => {
      let a = t * .055 + n.phase;
      const p = routePoint(a);
      p.y += 7 + Math.sin(t * .8 + i) * 2;
      n.model.position.copy(p);
      n.model.rotation.set(.03, Math.atan2(-Math.sin(a), Math.cos(a)), Math.sin(a) * .16);
    });
    const p = this.fireflies.geometry.attributes.position;
    for (let i = 0; i < this.flyBase.length; i++) {
      const b = this.flyBase[i];
      p.setXYZ(i, b.x + Math.sin(t * .25 + i) * 2, b.y + Math.sin(t + i) * .55, b.z + Math.cos(t * .3 + i) * 2);
    }
    p.needsUpdate = true;
    this.orbs.forEach(o => { if (!o.collected) o.mesh.rotation.y += dt; });
  }

  reset() {
    this.rings.forEach(r => { r.collected = false; r.mesh.visible = true; });
    this.orbs.forEach(o => { o.collected = false; o.mesh.visible = o.glow.visible = true; });
  }
}
