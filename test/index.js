SimpleDataModel = require('../src/index.js');
let p=0, n=0;
const fail = (msg) => {
  n++;
  console.log("\x1b[31m", `${msg} Fail`, "\x1b[0m");
},
success = (msg) => {
  p++;
  console.log("\x1b[32m", `${msg} Success`, "\x1b[0m");
}
test = (label) => {
  console.log("\x1b[1m", label, "\x1b[0m");
  let k =0, o = {
    assert: (v) => {
    if(v instanceof Promise) {
      v.then(() => success(`${label} ${++k}`))
      .catch(() => fail("\x1b[31m", `${label} ${++k}`))
    }else{
      if(v === true) {
        success(`${label} ${++k}`);
      }else{
        fail(`${label} ${++k}`);
      }
    }
    return o;
  }
};
return o;
};

test("Module loaded")
  .assert(SimpleDataModel !== undefined);


SimpleDataModel.define('Item', {
  fields:['id', 'name']
});

test("Model creation")
  .assert(SimpleDataModel.Item != undefined)
  .assert(typeof SimpleDataModel.Item === 'function');

test("Model fields go in the prototype")
  .assert(SimpleDataModel.Item.prototype.hasOwnProperty('fields'))
  .assert(SimpleDataModel.Item.prototype.fields instanceof Array)
  .assert(SimpleDataModel.Item.prototype.fields.length === 2)

var i1 = new SimpleDataModel.Item();
test("Instance creation trough new")
  .assert(i1!==undefined)
  .assert(i1 instanceof SimpleDataModel.Item)
  .assert(i1.id === undefined)
  .assert(i1.name === undefined);

i1 = SimpleDataModel.Item.create();
test("Static instance create")
  .assert(i1!==undefined)
  .assert(i1 instanceof SimpleDataModel.Item)
  .assert(i1.id === undefined)
  .assert(i1.name === undefined);

i1 = SimpleDataModel.Item.create({id:1, name:"Test"});
test("Create with initial data")
  .assert(i1!==undefined)
  .assert(i1 instanceof SimpleDataModel.Item)
  .assert(i1.id === 1)
  .assert(i1.name === "Test")
  .assert(i1.isValid() === true)
  .assert(i1.isDirty() === false);

  SimpleDataModel.define('TypedFieldsItem', {
    fields:[{
        name: 'string',
        type: 'string'
    }, {
      name: 'date',
      type: 'date'
    }, {
      name: 'boolean',
      type: 'boolean'
    }, {
      name: 'integer',
      type: 'integer'
    }, {
      name: 'item',
      type: SimpleDataModel.Item
    }]
  });

  var i2 = new SimpleDataModel.TypedFieldsItem({
    string: 'string',
    date: new Date(),
    boolean: true,
    integer: 1,
    item: i1
  })
test("Instance validates field types")
  .assert(i2.isValid());

i2.string = 1;
test("Instance invalidates field type string")
  .assert(!i2.isValid());
  i2.string = 'string';
test("Instance validates field type string")
    .assert(i2.isValid());

i2.item = 1;
test("Instance invalidates field type custom")
    .assert(!i2.isValid());
i1 = i2 = null;

console.log("\x1b[1m", `Finished. ${p} successful, ${n} failures!`, "\x1b[0m");
