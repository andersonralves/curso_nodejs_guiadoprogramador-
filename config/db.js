const mongoose = require('mongoose');

/* OLD SETTINGS 
const mongoHost = "mongo";
const mongoPort = 27017;
const mongoUser = "root";
const mongoPass = "mongoadmin";
const mongoDb = "admin";

const mongoUri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDb}`;
*/

const mongoHost = "mongodb";
const mongoDb = "curso_nodejs";

const mongoUri = `mongodb://${mongoHost}/${mongoDb}`;

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Conectado ao banco de dados com sucesso"))
  .catch(error=>console.log(error));

module.exports = mongoose