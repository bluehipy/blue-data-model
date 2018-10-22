# Blue Data Model
A simple relational data model in javascript.
It supports defining basic relations (one to one, one to many) and does simple task and checks on your defined fields (type check, value converts, composite fields).
The model accept composite keys and ensure constraints and keep a state of their dirtiness and validity based on the state of their fields.
Some effort was made so the model instances will JSON.stringify only the fields data.

# Installation

```bash
npm install blue-data-model
```

# Usage

```javascript
BlueDataModel = require('./src/index.js');

BlueDataModel.define('Person', {
  fields: ['id', 'name', 'id_team', 'role']
});

BlueDataModel.define('Team', {
  fields:['id', 'name', 'id_coach'],
  hasOne:[{
    model: BlueDataModel.Person,
    key: 'coach',
    foreignKey: ['id'],
    sourceKey: ['id_coach']
  }],
  hasMany:[{
    model: BlueDataModel.Person,
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

let teamA = BlueDataModel.Team.create({
  id:1,
  name: 'Team A',
  coach: {
      'id': '999',
      name: 'A',
      role: 'cocach'
    },
    players: playersCfg
  });
let teamB = new BlueDataModel.Team({id:2, name: 'Team B'});
let coachA = new BlueDataModel.Person({id: 100, name: 'Boss', role: 'coach'});
let coachB = new BlueDataModel.Person({id: 200, name: 'The Boss', role: 'coach'});

teamA.coach = coachA;
coachA.id= 333;
teamB.coach = coachB;
coachB.id = 222;

teamB.players = playersCfg;


console.log(JSON.stringify(teamA));

console.log(JSON.stringify(teamB));
```
# Output

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
