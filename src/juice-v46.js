// v46: sensação de velocidade e acabamento de câmera, só com CSS (compositor, sem custo de render 3D).
// - vinheta suave para enquadrar a cena e dar profundidade
// - linhas de velocidade radiais que crescem com a velocidade/turbo
// - pulso rosa curto ao ligar o turbo
// Respeita acessibilidade: prefers-reduced-motion, ajuste de movimento do jogador e "reduzir flashes".

const CSS = `
#fx-v46{position:fixed;inset:0;pointer-events:none;z-index:4;overflow:hidden;contain:strict}
#fx-v46 .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,transparent 54%,rgba(26,4,44,.36) 100%)}
#fx-v46 .lines{position:absolute;inset:-12%;opacity:0;will-change:opacity,transform;
 background:repeating-conic-gradient(from 0deg at 50% 46%,rgba(255,228,247,0) 0deg 3.1deg,rgba(255,228,247,.5) 3.1deg 3.6deg,rgba(255,228,247,0) 3.6deg 7.3deg);
 -webkit-mask-image:radial-gradient(ellipse at 50% 46%,transparent 36%,#000 80%);mask-image:radial-gradient(ellipse at 50% 46%,transparent 36%,#000 80%)}
#fx-v46 .pulse{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 46%,transparent 40%,rgba(255,120,200,.42) 100%)}
#fx-v46 .pulse.go{animation:fx46pulse .45s ease-out}
@keyframes fx46pulse{0%{opacity:.9}100%{opacity:0}}
body[data-state="menu"] #fx-v46 .lines,body[data-state="menu"] #fx-v46 .pulse{opacity:0!important}
body.photo-mode #fx-v46{opacity:0}
@media (prefers-reduced-motion:reduce){#fx-v46 .lines,#fx-v46 .pulse{display:none}}
`;

export class JuiceV46 {
  constructor() {
    if (typeof document === 'undefined') return;
    const style = document.createElement('style'); style.id = 'fx-v46-style'; style.textContent = CSS;
    document.head.appendChild(style);
    const el = this.el = document.createElement('div'); el.id = 'fx-v46'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="vig"></div><div class="lines"></div><div class="pulse"></div>';
    document.body.appendChild(el);
    this.lines = el.querySelector('.lines'); this.pulse = el.querySelector('.pulse');
    this.k = 0; this.last = -1; this.wasBoost = false;
  }

  update(dt, flight, active, opts = {}) {
    if (!this.el) return;
    const motion = Math.max(0, Math.min(1, opts.motion ?? .55));
    let target = 0;
    if (active && flight && !flight.grounded) {
      target = Math.max(0, Math.min(1, ((flight.speed || 0) - 12) / 12));
      if (flight.boosting) target = Math.max(target, .75);
    }
    this.k += (target - this.k) * (1 - Math.exp(-6 * dt));
    const o = this.k * motion * 1.1;
    if (Math.abs(o - this.last) > .01) {
      this.last = o;
      this.lines.style.opacity = o.toFixed(3);
      this.lines.style.transform = `scale(${(1 + this.k * .06).toFixed(3)})`;
    }
    const boosting = !!(active && flight?.boosting);
    if (boosting && !this.wasBoost && !opts.calm && motion > 0) {
      this.pulse.classList.remove('go'); void this.pulse.offsetWidth; this.pulse.classList.add('go');
    }
    this.wasBoost = boosting;
  }
}
