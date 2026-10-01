export class InputRouterV41{
 constructor(){this.map={cast:['Space','KeyF'],pause:['Escape'],interact:['KeyE']};this.enabled=true}
 matches(action,code){return this.enabled&&(this.map[action]||[]).includes(code)}
 remap(action,codes){if(Array.isArray(codes)&&codes.length)this.map[action]=[...new Set(codes)]}
}