const BaseModel = require('./BaseModel.js'),
      BaseField = require('./fields/BaseField'),
      HasOne = require('./relations/HasOne'),
      HasMany = require('./relations/HasMany');


class SimpleDataModel {
  static define(modelName, options) {
    let s = modelName;
    //this is just a stupid ambition to keep the name
    // of the model instead of the anonymous
    let c = new Function("BaseModel", "return class "+modelName+" extends BaseModel {};")(SimpleDataModel.BaseModel);
    SimpleDataModel[s] = c;
    Object.assign(SimpleDataModel[s].prototype, options);
    SimpleDataModel[s].prototype.instances = [];
    return SimpleDataModel[s];
  }
}

SimpleDataModel.BaseModel = BaseModel;
SimpleDataModel.HasOne = HasOne;
SimpleDataModel.HasMany = HasMany;
SimpleDataModel.BaseField = BaseField;

module.exports = SimpleDataModel;
