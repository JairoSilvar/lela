import * as T from 'three';

// v46: o figurino da Lelinha usa uma textura escura/oliva (RGB médio ~66,65,37).
// Multiplicar essa textura por roxo (como na v45) resultava em quase preto.
// Em vez de tingir, remapeamos a LUMINÂNCIA da textura para uma paleta
// violeta -> rosa -> rosa claro. Dobras, costuras e detalhes são preservados.

const cache = new WeakMap();
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

export function recolorOutfitTexture(tex, opts = {}) {
  if (!tex?.image) return null;
  if (cache.has(tex)) return cache.get(tex);
  const {shadow = '#240a45', mid = '#8a2fb8', light = '#ffa8e0', gain = 1.5} = opts;
  const img = tex.image;
  const w = img.width || img.naturalWidth, h = img.height || img.naturalHeight;
  if (!w || !h || typeof document === 'undefined') return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, w, h), px = data.data;
    const A = hex(shadow), B = hex(mid), C = hex(light);
    for (let i = 0; i < px.length; i += 4) {
      const l = (px[i] * .2126 + px[i + 1] * .7152 + px[i + 2] * .0722) / 255;
      const t = Math.min(1, Math.pow(l, .8) * gain);
      const lo = t < .5, k = lo ? t * 2 : (t - .5) * 2, P = lo ? A : B, Q = lo ? B : C;
      px[i] = P[0] + (Q[0] - P[0]) * k;
      px[i + 1] = P[1] + (Q[1] - P[1]) * k;
      px[i + 2] = P[2] + (Q[2] - P[2]) * k;
    }
    ctx.putImageData(data, 0, 0);
    const out = new T.CanvasTexture(canvas);
    out.colorSpace = T.SRGBColorSpace;
    out.flipY = tex.flipY;            // glTF usa flipY=false; manter a mesma orientação
    out.wrapS = tex.wrapS; out.wrapT = tex.wrapT;
    out.anisotropy = tex.anisotropy || 4;
    out.userData.v46Recolor = true;
    cache.set(tex, out);
    return out;
  } catch (e) {
    console.warn('Recolor do figurino indisponível; usando tinta simples.', e);
    return null;
  }
}

// Aplica ao material do figurino. Retorna true se o remapeamento foi aplicado.
export function applyHeroOutfit(material) {
  const out = recolorOutfitTexture(material.map);
  if (!out) return false;
  material.map = out;
  material.color.set('#ffffff');
  // Leve auto-iluminação a partir da própria textura: a silhueta lê bem mesmo em sombra.
  material.emissive.set('#ffffff');
  material.emissiveMap = out;
  material.emissiveIntensity = .15;
  material.needsUpdate = true;
  return true;
}
