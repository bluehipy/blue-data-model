module.exports = class {
  constructor(props) {
    this.defineLocal('prefix', props ? props.prefix || '_' : '_');
    if(props) {
      delete props.prefix;
    }
  }
  setProp(name, value, cfg = false) {
    this.defineLocal(this.prefix+name, value, cfg)
  }
  getProp(name) {
    return this[this.prefix+name];
  }
  defineLocal(name, value, cfg = false){
    if(cfg) {
      delete this[name];
    }
    Object.defineProperty(this, name, {
      enumerable: false,
      configurable: cfg,
      writable: true,
      value: value
    });
  }
}
