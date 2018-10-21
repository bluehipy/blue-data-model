SimpleDataModel = require('./src/index.js');

SimpleDataModel.define('Person', {
  fields: ['id', 'name', 'id_team', 'role']
});

SimpleDataModel.define('Team', {
  fields:['id', 'name', 'id_coach'],
  hasOne:[{
    model: SimpleDataModel.Person,
    key: 'coach',
    foreignKey: ['id'],
    sourceKey: ['id_coach']
  }],
  hasMany:[{
    model: SimpleDataModel.Person,
    key: 'players',
    foreignKey: ['id_team'],
    sourceKey: ['id']
  }]
});

let playersCfg = [{
  id: 1,
  name: 'Johny',
  role: "player"
}, {
  id:2,
  name: 'Billy',
  role: "player"
}, {
  id:3,
  name: 'Hans',
  role: "player"
}, {
  id:4,
  name: 'Karl',
  role: "player"
}];

let teamA = SimpleDataModel.Team.create({
  id:1,
  name: 'Team A',
  coach: {
      'id': '999',
      name: 'A',
      role: 'cocach'
    },
    players: playersCfg
  });
let teamB = new SimpleDataModel.Team({id:2, name: 'Team B'});
let coachA = new SimpleDataModel.Person({id: 100, name: 'Boss', role: 'coach'});
let coachB = new SimpleDataModel.Person({id: 200, name: 'The Boss', role: 'coach'});

teamA.coach = coachA;
coachA.id= 333;
teamB.coach = coachB;
coachB.id = 222;

teamB.players = playersCfg;


console.log(JSON.stringify(teamA));

console.log(JSON.stringify(teamB));
