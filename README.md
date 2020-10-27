- Criar uma API com as operações CREATE, READ, UPDATE e DELETE para as seguintes entidades
```js
const user: {
  login: String, //ex: "kapi"
  password: String, //ex: "k4p1c01ns"
  role: String //ex: "admin" | "user"
},
const wallet: {
  user: ObjectId,
  coin: Integer, //ex: 100
  origin: String, //ex: "Coding Dojo"
  created_by: ObjectId //ex: 54das75asd67
  created_at: Datetime
}
```

Etapa 2
- Usar Aggregation do Mongo para criar um método que calcula a quantidade de coins de um usuário

Etapa 3
- Criar uma rota de autenticação usando JWT

Etapa 4
- Criar uma rota protegida que informa o saldo total de Kapicoins apenas para a role user
- Criar uma rota protegida para criar uma transação na wallet restrita apenas para a role admin