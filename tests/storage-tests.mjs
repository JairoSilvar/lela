import assert from 'node:assert/strict';
import {storage} from '../src/storage.js';
import {SaveV35} from '../src/save-v35.js';
import {SaveValidationV40} from '../src/save-validation-v40.js';
import {ProgressionSystem} from '../src/progression.js';
import {MissionSystem} from '../src/missions.js';
let data=new Map();globalThis.window={localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
let count=0;function test(name,fn){fn();console.log('PASS '+name);count++}
test('JSON inválido não impede carregar save',()=>{data.set('lelinha-save','{');assert.equal(new SaveV35().load(),null)});
test('Save inválido é saneado e zero MP preservado',()=>{const d=new SaveValidationV40().validate({phase:'invalid',position:{x:NaN,y:0,z:0},vitals:{magic:0,health:999}});assert.equal(d.phase,'floresta');assert.equal(d.vitals.magic,0);assert.equal(d.vitals.health,100);assert.ok(Number.isFinite(d.position.x));assert.equal(new SaveValidationV40().validate([]),null)});
test('Progresso e grimório com estrutura corrompida recuperam defaults',()=>{data.set('lelinha-progression-v8','{"regions":null,"unlocks":null}');data.set('lelinha-grimorio-v7','null');assert.equal(new ProgressionSystem().region('floresta').stars,0);assert.equal(new MissionSystem('floresta').step,0)});
test('Armazenamento negado usa memória sem alegar persistência',()=>{window.localStorage={getItem(){throw Error('denied')},setItem(){throw Error('denied')},removeItem(){throw Error('denied')}};storage.setItem('test','ok');assert.equal(storage.getItem('test'),'ok');assert.equal(storage.persistent,false);assert.equal(new SaveV35().save({phase:'floresta',position:{x:0,y:7,z:90},vitals:{health:100,magic:0}}),false)});
console.log(JSON.stringify({passed:count,total:count}));
