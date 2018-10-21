const Base = require('./../Base.js');

class HasOne  extends Base{
  constructor(props) {
    super(props);
    for(let p in props) {
      if(props.hasOwnProperty(p)) {
          this.setProp(p, props[p], true);
      }
    }

    const model = this.getProp('model');

    this.defineLocal('record', new model, true);
    // if(!this.checkConstraints()) {
    //   this.applyConstraints();
    // }
  }

  get () {
    return this.record;
  }

  set (value) {
    const model = this.getProp('model');

    if(value instanceof model) {
      this.defineLocal('record', value, true);
    }else{
      Object.assign(this.record, value);
    }
    // if(!this.checkConstraints()) {
    //   this.applyConstraints();
    // }
  }


}

module.exports = HasOne;
