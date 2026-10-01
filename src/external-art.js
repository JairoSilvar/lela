export class ExternalArtLoader {
 constructor(){this.available={character:false,environment:false}}
 async probe(assets={}){this.available={character:!!assets.lelinha,environment:!!assets.environment};return this.available}
}
