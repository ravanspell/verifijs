const MongoDb = require('./database/mongodb');
const MySql = require("./database/mysql");
class DbFactory {
    constructor() {

    }

    static InitDbService(dbConnectionSettings, dbType) {
        switch (dbType) {
            case 'mongodb':
                return new MongoDb(dbConnectionSettings);
                break;
            case 'mysql':
                return new MySql(dbConnectionSettings);
        }
    }
}

module.exports = DbFactory;