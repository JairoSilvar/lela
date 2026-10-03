/** CombatFeedback v53 — números flutuantes + shake; compatível com assinatura antiga update(boss). */
export class CombatFeedbackV37 {
  constructor(hud, toast, audio, camera = null) {
    this.hud = hud;
    this.toast = toast;
    this.audio = audio;
    this.camera = camera;
    this.lastBossPhase = 0;
    this.floats = [];
    this.shake = 0;
    this.shakeMag = 0;
    this._layer = null;
  }
  setCamera(c) { this.camera = c; }
  _ensureLayer() {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('dmg-floats');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dmg-floats';
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden';
      document.body.appendChild(el);
    }
    this._layer = el;
  }
  onHit(result, worldPos, camera) {
    if (!result?.entity) return;
    const dmg = result.entity._lastDamage || 12;
    const isCrit = result.entity.boss && dmg >= 22;
    const isDeath = result.type === 'death';
    this.spawnFloat(worldPos, dmg, { crit: isCrit, death: isDeath, camera: camera || this.camera });
    const mag = isDeath ? 0.22 : result.entity.boss ? 0.14 : 0.07;
    this.shakeMag = Math.max(this.shakeMag, mag);
    this.shake = Math.max(this.shake, isDeath ? 0.35 : 0.22);
  }
  spawnFloat(worldPos, amount, { crit = false, death = false, camera } = {}) {
    this._ensureLayer();
    if (!this._layer || !camera || !worldPos?.clone) return;
    const v = worldPos.clone();
    if (!v.project) return;
    v.project(camera);
    if (v.z > 1 || v.z < -1) return;
    const x = (v.x * 0.5 + 0.5) * innerWidth;
    const y = (-v.y * 0.5 + 0.5) * innerHeight;
    const el = document.createElement('div');
    el.className = 'dmg-float' + (crit ? ' crit' : '') + (death ? ' death' : '');
    el.textContent = death ? '✦' : `-${Math.round(amount)}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    this._layer.appendChild(el);
    this.floats.push({ el, life: death ? 1.1 : 0.85, vy: -48 - Math.random() * 20, x, y });
  }
  /** Aceita update(boss) legado ou update(dt, boss). */
  update(a, b) {
    let dt = 1 / 60, boss = a;
    if (typeof a === 'number') { dt = a; boss = b; }
    const e = boss?.entity;
    this.hud?.boss?.(e);
    if (e && !e.dead && boss.phase !== this.lastBossPhase) {
      this.lastBossPhase = boss.phase;
      if (boss.phase > 1) {
        this.toast?.(`Cyclops entrou na Fase ${boss.phase}`);
        this.audio?.impact?.();
        this.shakeMag = Math.max(this.shakeMag, 0.18);
        this.shake = Math.max(this.shake, 0.4);
      }
    }
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.life -= dt;
      f.y += f.vy * dt;
      f.vy *= 0.98;
      f.el.style.top = f.y + 'px';
      f.el.style.opacity = String(Math.max(0, f.life * 1.4));
      f.el.style.transform = `translate(-50%,-50%) scale(${1 + (1 - Math.min(1, f.life)) * 0.35})`;
      if (f.life <= 0) { f.el.remove(); this.floats.splice(i, 1); }
    }
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      this.shakeMag *= Math.exp(-dt * 4);
    }
  }
  applyShake(camera) {
    if (!camera || this.shake <= 0 || this.shakeMag < 0.01) return;
    const m = this.shakeMag;
    camera.position.x += (Math.random() - 0.5) * m * 2.2;
    camera.position.y += (Math.random() - 0.5) * m * 1.4;
    camera.position.z += (Math.random() - 0.5) * m * 2.2;
  }
  dispose() {
    for (const f of this.floats) f.el?.remove();
    this.floats = [];
    this._layer?.remove();
    this._layer = null;
  }
}
