export class Input {
  constructor() {
    this.keys = new Set();
    this.actions = {};
    this.axis = {x: 0, y: 0};
    this.tilt = {x: 0, y: 0};
    this.tiltEnabled = false;
    this.tiltCalibrated = false;
    this.tiltCenter = {beta: 0, gamma: 0};
    this.magicPressed = false;
    this.touch =
      matchMedia('(pointer:coarse)').matches ||
      navigator.maxTouchPoints > 0 ||
      innerWidth < 760;
    this.enabled = false;
    this.sensitivity = 1.15; // touch stick gain

    window.addEventListener('keydown', e => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && this.enabled)
        e.preventDefault();
      if (e.code === 'Space' && !e.repeat) this.magicPressed = true;
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.clear();
    });

    if (this.touch) document.body.classList.add('touch-mode');

    // Action buttons (turbo, magic, up, down)
    document.querySelectorAll('[data-action]').forEach(b => {
      const action = b.dataset.action;
      const on = e => {
        e.preventDefault();
        try { b.setPointerCapture(e.pointerId); } catch (_) {}
        this.actions[action] = true;
        if (action === 'magic') this.magicPressed = true;
      };
      const off = () => { this.actions[action] = false; };
      b.addEventListener('pointerdown', on);
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'])
        b.addEventListener(name, off);
    });

    // Virtual stick — larger deadzone, smoother radial clamp
    const stick = document.querySelector('#stick');
    const thumb = document.querySelector('#stick-thumb');
    let active = null;
    const radius = 48;

    const move = e => {
      if (active !== e.pointerId) return;
      const r = stick.getBoundingClientRect();
      let x = (e.clientX - r.left - r.width / 2) / radius;
      let y = (e.clientY - r.top - r.height / 2) / radius;
      const mag = Math.hypot(x, y);
      if (mag > 1) { x /= mag; y /= mag; }
      // Soft deadzone
      const dead = 0.12;
      const m = Math.hypot(x, y);
      if (m < dead) {
        this.axis = {x: 0, y: 0};
        thumb.style.transform = 'translate(0px,0px)';
        return;
      }
      const scaled = (m - dead) / (1 - dead);
      x = (x / m) * scaled;
      y = (y / m) * scaled;
      this.axis = {x, y};
      thumb.style.transform = `translate(${x * 40}px,${y * 40}px)`;
    };

    stick.addEventListener('pointerdown', e => {
      active = e.pointerId;
      try { stick.setPointerCapture(active); } catch (_) {}
      move(e);
    });
    stick.addEventListener('pointermove', move);
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      stick.addEventListener(name, () => {
        active = null;
        this.axis = {x: 0, y: 0};
        thumb.style.transform = '';
      });
    }

    // Device orientation (tilt) — optional, requires user gesture on iOS
    this._onOrientation = e => {
      if (!this.tiltEnabled || !this.enabled) return;
      let beta = e.beta ?? 0;   // front-back (-180..180)
      let gamma = e.gamma ?? 0; // left-right (-90..90)
      if (!this.tiltCalibrated) {
        this.tiltCenter = {beta, gamma};
        this.tiltCalibrated = true;
      }
      const db = (beta - this.tiltCenter.beta) / 28;
      const dg = (gamma - this.tiltCenter.gamma) / 28;
      this.tilt = {
        x: Math.max(-1, Math.min(1, dg)),
        y: Math.max(-1, Math.min(1, db)),
      };
    };
  }

  async enableTilt() {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm !== 'granted') return false;
      }
      window.addEventListener('deviceorientation', this._onOrientation);
      this.tiltEnabled = true;
      this.tiltCalibrated = false;
      return true;
    } catch {
      return false;
    }
  }

  disableTilt() {
    this.tiltEnabled = false;
    this.tilt = {x: 0, y: 0};
    window.removeEventListener('deviceorientation', this._onOrientation);
  }

  clear() {
    this.keys.clear();
    this.actions = {};
    this.axis = {x: 0, y: 0};
    this.tilt = {x: 0, y: 0};
    this.magicPressed = false;
  }

  get state() {
    const k = this.keys, a = this.actions;
    const turn =
      (+k.has('KeyD') - k.has('KeyA')) +
      this.axis.x * this.sensitivity +
      (this.tiltEnabled ? this.tilt.x * 0.95 : 0);
    const throttle =
      (+k.has('KeyW') - k.has('KeyS')) -
      this.axis.y * this.sensitivity +
      (this.tiltEnabled ? -this.tilt.y * 0.7 : 0);
    const lift =
      Number(!!(k.has('ArrowUp') || k.has('KeyE') || a.up)) -
      Number(!!(k.has('ArrowDown') || k.has('KeyQ') || a.down));
    const boost = k.has('ShiftLeft') || k.has('ShiftRight') || !!a.boost;
    return {
      turn: Math.max(-1.4, Math.min(1.4, turn)),
      throttle: Math.max(-1.2, Math.min(1.2, throttle)),
      lift,
      boost,
    };
  }

  consumeMagic() {
    const v = this.magicPressed;
    this.magicPressed = false;
    return v;
  }
}
