const MongoDb = require('./database/mongodb');

class DbFactory {
    constructor() {

    }

    static InitDbService(dbType, connectionString, database) {
        switch (dbType) {
            case 'mongodb':
                return new MongoDb(connectionString, database);
                break;
        }
    }
}

module.exports = DbFactory;