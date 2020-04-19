const MongoDb = require('./database/mongodb');

class DbFactory {
    constructor() {

    }

    static InitDbService(dbType, dbConnection) {
        switch (dbType) {
            case 'mongodb':
                return new MongoDb(dbConnection);
                break;
        }
    }
}

module.exports = DbFactory;