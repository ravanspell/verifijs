const MongoClient = require('mongodb').MongoClient;
const Util = require('../util');
class MongoDb {
    constructor(connectionString, database) {
        this.connectionString = connectionString;
        this.database = database;
        this.dbConnection = null;
        this.uniqueValidation = this.uniqueValidation.bind(this);
    }
    async connection(url, database) {
        if (this.dbConnection == null) {
            try {
                const Client = new MongoClient(url, { useUnifiedTopology: true });
                // Use connect method to connect to the Server
                const client = await Client.connect();
                console.info("mongo db connected");
                return client.db(database);
            } catch (error) {
                console.log(error.message);
            }
        }
        return this.dbConnection;
    }
    async uniqueValidation(dbCollection, userInputValue, customMessage, columnName) {
        try {
            this.dbConnection = await this.connection(this.connectionString, this.database);
            const collection = this.dbConnection.collection(dbCollection);
            let findings = await collection.find({ [columnName]: userInputValue }).toArray();
            if (findings.length > 0) {
                let defaultErrorMessage = `Error: ${userInputValue} is not unique`;
                return Util.validationErrorInjector(defaultErrorMessage, customMessage)
            }
            return { status: true };
        } catch (error) {
            console.log(error.message);
            return { status: true };
        }
    }
}

module.exports = MongoDb;