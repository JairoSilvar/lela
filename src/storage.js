// A storage denial must not prevent the game from opening. The fallback lasts only
// for this tab; SaveV35 reports false when persistence is unavailable.
const memory=new Map();
export const storage={persistent:true,keys(){try{return Object.keys(window.localStorage)}catch{this.persistent=false;return [...memory.keys()]}},getItem(key){try{return window.localStorage.getItem(key)}catch{this.persistent=false;return memory.get(key)??null}},setItem(key,value){memory.set(key,String(value));try{window.localStorage.setItem(key,String(value))}catch{this.persistent=false}},removeItem(key){memory.delete(key);try{window.localStorage.removeItem(key)}catch{this.persistent=false}}};
