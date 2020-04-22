const MongoClient = require('mongodb').MongoClient;
const Util = require('../util');
class MongoDb {
    constructor(connectionSettings) {
        this.connectionSettings = connectionSettings;
        this.dbConnection = null;
        this.uniqueValidation = this.uniqueValidation.bind(this);
        this.existsValidation = this.existsValidation.bind(this);
    }
    async connection() {
        try {
            const Client = new MongoClient(this.connectionSettings.url, { useUnifiedTopology: true });
            // Use connect method to connect to the Server
            const client = await Client.connect();
            console.info("mongo db connected");
            return client.db();
        } catch (error) {
            console.log(error.message);
        }
    }
    async uniqueValidation(dbCollection, userInputValue, customMessage, columnName) {
        try {
            if (this.dbConnection == null)
                this.dbConnection = await this.connection();
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

    async existsValidation(dbCollection, userInputValue, customMessage, columnName) {
        try {
            if (this.dbConnection == null)
                this.dbConnection = await this.connection();
            const collection = this.dbConnection.collection(dbCollection);
            let findings = await collection.find({ [columnName]: userInputValue }).toArray();
            if (!findings.length > 0) {
                let defaultErrorMessage = `Error: ${userInputValue} is not exists`;
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