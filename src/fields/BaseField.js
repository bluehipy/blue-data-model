const Base = require('./../Base.js');

class BaseField  extends Base {
    constructor(props) {
      super(props);
      for(let p in props) {
        if(props.hasOwnProperty(p)) {
            this.setProp(p, props[p], true);
        }
      }
      // make name visible in JSOn.stringify
      this.name = props.name;

      if(!props.depends) {
          this.setProp('depends', [], true);
      }

      if(!props.type) {
          this.setProp('type', 'auto', true);
      }
      this.setProp('listeners', []);
      this.setProp('errors', []);
      this.setProp('dirty', false, true);
      this.setProp('invalid', false, true);
    }
    set(value) {
        const initial = !this.hasOwnProperty('value'),
            oldValue = this.value,
            convert = this.getProp('convert');
        let newValue;
        this.setProp('invalid', false, true);
        this.getProp('errors').length = 0;
        this.setProp('original', value, true);
        newValue = convert ? convert(value) : value;
        try {
            this.check(newValue)
        } catch (ex) {
            this.markAsInvalid(ex)
        }
        if (!initial && oldValue !== newValue) {
            this.setProp('dirty', true, true);
        }
        this.value = newValue;
        if(this.hasListeners()){
          this.getProp('listeners').forEach(f => f(newValue));
        }
    }
    markAsInvalid(err) {
        this.setProp( 'invalid', true, true);
        this.getProp('errors').push(err.message);
    }
    get() {
        return this.value;
    }
    isDirty() {
        if (this.hasConvert()) {
            return false;
        }
        return this.getProp('dirty');
    }
    isValid() {
        return !this.getProp('invalid');
    }
    check(value) {
        let valid = true;

        valid = valid && this.checkType(value);
        if (!valid) {
            throw (new Error('TypeError'));
        }
        if (this.hasValidate()) {
            valid = valid && this.getProp('validate')(value);
        }
        if (!valid) {
            throw (new Error('InvalidError'));
        }
        return valid;
    }
    checkType(value) {
        let valid = true,
        type = this.getProp('type');

        switch (type) {
            case 'string':
                valid = typeof value === 'string';
                break;
            case 'number':
            case 'float':
                valid = typeof value === 'number';
                break;
            case 'integer':
            case 'int':
                valid = typeof value === 'number' && value === parseInt(value, 10);
                break;
            case 'date':
                valid = value instanceof Date;
                break;
            case 'boolean':
                valid = typeof value === 'boolean'
                break;
            case 'auto':
                valid = true;
                break;
            default:
                valid = value instanceof type;
        }
        return valid;
    }

    addListener(fn){
      this.getProp('listeners').push(fn);
    }
    getErrors() {
        return this.getProp('errors');
    }
    getDepends() {
      return this.getProp('depends');
    }
    getOriginal() {
      return this.getProp('original');
    }
    getConvert() {
      return this.getProp('convert');
    }
    setConvert(fn) {
      this.setProp('convert', fn, true);
    }
    dependsOf(fieldName) {
      return this.getProp('depends').indexOf(fieldName) !== -1;
    }
    hasConvert() {
      return this.getProp('convert') != null;
    }
    hasListeners () {
      return this.getProp('listeners').length >0;
    }
    hasValidate() {
      return this.getProp('validate') != null;
    }
}

module.exports = BaseField;
