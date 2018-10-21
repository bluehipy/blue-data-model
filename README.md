# simple-data-model
A simple relational data model in javascript


# Usage

```javascript
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
```
# Output
s
```json
   {  
      "id":1,
      "name":"Team A",
      "id_coach":333,
      "coach":{  
         "id":333,
         "name":"Boss",
         "role":"coach"
      },
      "players":[  
         {  
            "id":1,
            "name":"Johny",
            "id_team":1,
            "role":"player"
         },
         {  
            "id":2,
            "name":"Billy",
            "id_team":1,
            "role":"player"
         },
         {  
            "id":3,
            "name":"Hans",
            "id_team":1,
            "role":"player"
         },
         {  
            "id":4,
            "name":"Karl",
            "id_team":1,
            "role":"player"
         }
      ]
   }
   ```
   ```json
   {  
      "id":2,
      "name":"Team B",
      "id_coach":222,
      "coach":{  
         "id":222,
         "name":"The Boss",
         "role":"coach"
      },
      "players":[  
         {  
            "id":1,
            "name":"Johny",
            "id_team":2,
            "role":"player"
         },
         {  
            "id":2,
            "name":"Billy",
            "id_team":2,
            "role":"player"
         },
         {  
            "id":3,
            "name":"Hans",
            "id_team":2,
            "role":"player"
         },
         {  
            "id":4,
            "name":"Karl",
            "id_team":2,
            "role":"player"
         }
      ]
   }
```
