import * as T from 'three';

/**
 * SkyCompanions v48 — outras bruxas voando sentadas na vassoura,
 * com paletas distintas da Lelinha (rosa) e da rival (teal).
 * Popula o céu sem competir visualmente com a heroína.
 */
export class SkyCompanionsV48 {
  constructor(scene) {
    this.scene = scene;
    this.root = new T.Group();
    this.root.name = 'SkyCompanions-v48';
    scene.add(this.root);
    this.t = 0;
    this.actors = [];
    this._build();
  }

  /** Modelo procedural sentado — mesma linguagem da rival, cores diferentes. */
  _witch(palette) {
    const g = new T.Group();
    const cloth = new T.MeshStandardMaterial({ color: palette.cloth, roughness: .7, emissive: palette.emissive, emissiveIntensity: .22 });
    const skin = new T.MeshStandardMaterial({ color: 0xe0b090, roughness: .85 });
    const dark = new T.MeshStandardMaterial({ color: palette.dark || 0x1a2030, roughness: .8 });
    const wood = new T.MeshStandardMaterial({ color: 0x5c3a1e, roughness: .92 });
    const hatMat = new T.MeshStandardMaterial({ color: palette.hat, roughness: .55, emissive: palette.hatEmissive || 0x000000, emissiveIntensity: .2 });

    const torso = new T.Mesh(new T.CapsuleGeometry(.24, .48, 4, 8), cloth);
    torso.position.set(0, .55, .04);
    torso.rotation.x = .55;
    g.add(torso);

    const head = new T.Mesh(new T.SphereGeometry(.22, 10, 8), skin);
    head.position.set(0, 1.0, .1);
    g.add(head);

    const brim = new T.Mesh(new T.CylinderGeometry(.32, .32, .035, 14), hatMat);
    brim.position.set(0, 1.18, .1);
    g.add(brim);
    const cone = new T.Mesh(new T.ConeGeometry(.2, .5, 12), hatMat);
    cone.position.set(.02, 1.42, .1);
    cone.rotation.z = -.1;
    g.add(cone);

    const broom = new T.Mesh(new T.CylinderGeometry(.035, .045, 2.2, 6), wood);
    broom.rotation.z = Math.PI / 2;
    broom.position.set(0, .3, 0);
    g.add(broom);
    const bristles = new T.Mesh(new T.ConeGeometry(.12, .4, 7), new T.MeshStandardMaterial({ color: 0xb89858, roughness: .9 }));
    bristles.rotation.z = -Math.PI / 2;
    bristles.position.set(1.05, .3, 0);
    g.add(bristles);

    for (const side of [-1, 1]) {
      const leg = new T.Mesh(new T.CapsuleGeometry(.055, .3, 3, 5), dark);
      leg.position.set(side * .13, .38, .2);
      leg.rotation.x = 1.38;
      leg.rotation.z = side * .1;
      g.add(leg);
      const shin = new T.Mesh(new T.CapsuleGeometry(.045, .24, 3, 5), dark);
      shin.position.set(side * .14, .26, .5);
      shin.rotation.x = 1.45;
      g.add(shin);
      const arm = new T.Mesh(new T.CapsuleGeometry(.045, .24, 3, 5), cloth);
      arm.position.set(side * .28, .58, .02);
      arm.rotation.z = side * .8;
      arm.rotation.x = .35;
      g.add(arm);
    }

    g.scale.setScalar(.92);
    return g;
  }

  _build() {
    // Paletas: âmbar, índigo, vinho — nenhuma rosa/magenta da Lelinha
    const palettes = [
      { cloth: 0xc47a2a, emissive: 0x3a2008, hat: 0x2a1a40, dark: 0x2a1830 }, // âmbar
      { cloth: 0x3a4a8a, emissive: 0x12183a, hat: 0x8a6a20, hatEmissive: 0x3a2a08, dark: 0x1a2038 }, // índigo
      { cloth: 0x6a2040, emissive: 0x2a0a18, hat: 0x1a3040, dark: 0x201018 }, // vinho profundo
    ];
    const seeds = [
      { r: 48, y: 22, spd: .22, phase: 0 },
      { r: 62, y: 28, spd: .16, phase: 2.1 },
      { r: 55, y: 18, spd: .19, phase: 4.2 },
    ];
    for (let i = 0; i < 3; i++) {
      const w = this._witch(palettes[i]);
      w.userData = { ...seeds[i], bank: 0 };
      this.root.add(w);
      this.actors.push(w);
    }
  }

  update(dt, playerPos) {
    this.t += dt;
    const cx = playerPos?.x ?? 90;
    const cz = playerPos?.z ?? 0;
    for (const a of this.actors) {
      const u = a.userData;
      const ang = this.t * u.spd + u.phase;
      // órbita larga em torno da área de jogo, altura fixa relativa
      a.position.set(
        cx + Math.cos(ang) * u.r,
        u.y + Math.sin(ang * 1.3) * 1.8,
        cz + Math.sin(ang) * u.r * .85
      );
      // orienta na tangente do voo
      const tx = -Math.sin(ang);
      const tz = Math.cos(ang);
      a.rotation.y = Math.atan2(tx, tz);
      u.bank = Math.sin(ang * 1.1) * .2;
      a.rotation.z = u.bank;
      a.rotation.x = -.06;
    }
  }

  dispose() {
    this.scene.remove(this.root);
    this.root.traverse(o => {
      o.geometry?.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material.dispose?.();
      }
    });
    this.actors = [];
  }
}
