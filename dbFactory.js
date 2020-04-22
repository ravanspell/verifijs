const MongoDb = require('./database/mongodb');
const MySql = require("./database/mysql");
class DbFactory {
    static InitDbService(dbConnectionSettings, dbType) {
        switch (dbType) {
            case 'mongodb':
                return new MongoDb(dbConnectionSettings);
            case 'mysql':
                return new MySql(dbConnectionSettings);
        }
    }
}

module.exports = DbFactory;