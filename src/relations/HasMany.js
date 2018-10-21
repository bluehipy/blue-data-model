const Base = require('./../Base.js');

class HasMany extends Base {
  constructor(props) {
    super(props);
    for(let p in props) {
      if(props.hasOwnProperty(p)) {
          this.setProp(p, props[p], true);
      }
    }
    this.defineLocal('records', []);

    // route the push on the records to local  _push
    this.setProp('push', this.records.push);
    this.records.add = this.add.bind(this);
  }

  get() {
    return this.records;
  }
  set (records) {
    // TODO: destroy each record
    this.records.length = 0;
    this.records.add(records);
  }
  push(obj) {
    let record,
    model = this.getProp('model'),
    originalPush = this.getProp('push');

    if(obj instanceof model) {
      record = obj;
    }else{
      record = new model(obj);
    }
    if(!this.checkConstraints(record)) {
      this.applyConstraints([record]);
    }
    originalPush.apply(this.records, [record]);
    return record;
  }
  add(records) {
    if(!(records instanceof Array)) {
      records = [records];
    }
    records.forEach(r => this.push(r));
    return this.records[this.records.length-1];
  }
  updateKey (value){
    const foreignKey = this.getProp('foreignKey');

    this.setProp('keyValue', value, true);
    this.applyConstraints(this.records);
  }
  applyConstraints (records) {
    let foreignKey = this.getProp('foreignKey'),
        keyValue = this.getProp('keyValue'),
        foreignKeyValue = foreignKey.reduce((acc, crt, index) => {
          acc[crt] = keyValue[index];
          return acc;
        }, {});
    records.forEach(record => Object.assign(record, foreignKeyValue));
  }
  checkConstraints (record) {
    let foreignKey = this.getProp('foreignKey'),
        keyValue = this.getProp('keyValue'),
        foreignKeyValue = foreignKey.map(key => record[key]);

      return foreignKeyValue.filter((value, index) => value === keyValue[index]).length === foreignKeyValue.length;
  }
}

module.exports = HasMany;
