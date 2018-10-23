const Base = require('./Base.js'),
      HasOne = require('./relations/HasOne.js'),
      HasMany = require('./relations/HasMany.js'),
      BaseField = require('./fields/BaseField.js');

class BaseModel extends Base{
    constructor(initialData) {
      super(initialData);

      const initField = this.initField.bind(this),
            relKeys = [];

      this.setProp('initialData', Object.assign({}, initialData));
      this.setProp('fields', []);
      this.getProp('fields').push(...this.fields.map(field => initField(field)));

      // pluck rel keys
      this.hasOne.forEach(relation => {
        relKeys.push(relation.key);
      })
      this.hasMany.forEach(relation => {
        relKeys.push(relation.key);
      })

      // init fields data
      if(initialData) {
        const fieldData = {};
        for (let p in initialData) {
          if(initialData.hasOwnProperty(p) && relKeys.indexOf(p) === -1){
            fieldData[p] = initialData[p];
          }
        }
        Object.assign(this, fieldData);
      }

      const initHasOne = this.initHasOne.bind(this);
      this.hasOne.forEach(relation => {
        relKeys.push(relation.key);
        initHasOne(relation)
      })

      const initHasMany = this.initHasMany.bind(this);
      this.hasMany.forEach(relation => {
        relKeys.push(relation.key);
        initHasMany(relation)
      })

      if(initialData){
        Object.assign(this, initialData);
      }
      this.instances.push(this);
    }

    initField(fieldName) {
        let field = this.applyField(fieldName);

        Object.defineProperty(this, field.name, {
          enumerable: true,
          configurable: false,
            get() {
                return field.get()
            },
            set(value) {
                field.set(value);
                this.initConverts(field.name);
            }
        });
        return field;
    }

    applyField (fieldName) {
      let field;

      if (fieldName instanceof BaseField) {
          field = fieldName;
      } else if (typeof fieldName === 'string') {
          field = new BaseField({
              name: fieldName,
              type: 'auto'
          });
      } else {
          field = new BaseField(fieldName);
      }
        let convert = field.getConvert();
      if (convert) {
          field.setConvert((v) => convert(v, this));
      }
      return field;
    }

    initHasOne(relation) {
        this.initRelation(relation, HasOne);
    }

    initHasMany(relation) {
        this.initRelation(relation, HasMany);
    }
    initRelation(relation, relationType) {
    let rel = this.applyRelation(relation, relationType);

    if (!this[relation.key]) {
      Object.defineProperty(this, relation.key, {
            enumerable: true,
              get () {
                return rel.get()
              },
              set (v) {
                rel.set(v);
                this.applyConstraints(rel);
              }
          });
      }
    }

    applyRelation(relation, relationType) {
      let props,
          rel = this.getProp(relation.key);

      if (!rel) {
        props = Object.assign({}, relation, {keyValue: relation.sourceKey.map(fieldName => this[fieldName])});
        this.setProp(relation.key, new relationType(props));
          rel = this.getProp(relation.key);
          this.applyConstraints(rel);
      }

      return rel;
    }
    applyConstraints(rel) {
      if(rel instanceof HasOne){
          this.applyHasOneConstraints(rel);
      }else if(rel instanceof HasMany){
          this.applyHasManyConstraints(rel);
      }
    }
    applyHasOneConstraints(rel) {
      // for HasOne we update this with the changes
      // of relation foreignKeys
      let foreignKey = rel.getProp('foreignKey'),
          sourceKey = rel.getProp('sourceKey');

      foreignKey.forEach((fieldName, index) => {
        let sourceKeyValue = this[sourceKey[index]],
            foreignKeyValue =  rel.get()[fieldName];

        rel.get()
          .getFieldByName(fieldName)
          .addListener(value => this[sourceKey[index]] = value)

        if(sourceKeyValue !== foreignKeyValue) {
          if(foreignKeyValue != null){
            this[sourceKey[index]] = foreignKeyValue;
          }else if (sourceKeyValue != null) {
            // the relation should load the appropriate records
            // rel.get().load(sourceKeyValue)
            rel.get()[fieldName] = sourceKeyValue;
          }
        }
      });


    }

    applyHasManyConstraints(rel) {
      // for HasMany we update the relation records foreignKeys
      // with the changes of this
      let foreignKey = rel.getProp('foreignKey'),
          sourceKey = rel.getProp('sourceKey');

      sourceKey.forEach((fieldName, index) => {
        this.getFieldByName(fieldName)
          .addListener(value => {
            let keyValue = sourceKey.map(fieldName => this[fieldName]);
            rel.updateKey(keyValue);
          })
      });
      // todo: fix this
      let keyValue = sourceKey.map(fieldName => this[fieldName]);
      rel.updateKey(keyValue);

    }
    isDirty() {
        return this.getProp('fields')
          .filter(field => field.isDirty()).length > 0;
    }
    isValid() {
        return this.getProp('fields').filter(field => !field.isValid()).length === 0;
    }
    getErrors() {
        return this.getProp('fields')
            .filter(field => !field.isValid())
            .reduce((acc, field) => {
                acc[field.name] = field.getErrors();
                return acc;
            }, {});
    }
    getErrorByField(fieldName) {
        this.getErrors()[fieldName];
    }
    getFieldByName(fieldName) {
      let fields = this.getProp('fields').filter(field => field.name===fieldName);
      return fields.length ? fields[0] : null;
    }
    initConverts(depend) {
        this.getProp('fields')
            .filter(field => field.hasConvert() && field.dependsOf(depend))
            .forEach(field => {
                this[field.name] = field.getOriginal();
            });
    }
    static create (data) {
      return new this(data);
    }
    static load () {
      // TODO
      // create a data provider abstract
      // return Promise
    }
    static save () {
      // TODO
      // return Promise
    }
    static count(remote = false) {
      if(remote) {
        //TODO
      }
      return this.prototype.instances.length;
    }
    static findById (remote = false) {
      // TODO:
      // return Promise
    }
}

const proto = {
    fields: [],
    hasOne: [],
    hasMany: [],
    instances:[]
};
Object.keys(proto).forEach(p => Object.defineProperty(BaseModel.prototype, p, {
  enumerable: false,
  writable: true,
  value: proto[p]
}));


module.exports = BaseModel;
