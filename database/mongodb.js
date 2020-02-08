const MongoClient = require('mongodb').MongoClient;
class MongoDb {
    constructor(connectionString, database) {
        this.connectionString = connectionString;
        this.database = database;
        this.dbConnection = null;
        this.uniqueValidation = this.uniqueValidation.bind(this);
    }
    async connection(url, database) {
        const Client = new MongoClient(url);
        // Use connect method to connect to the Server
        return new Promise((resolve, reject) => {
            Client.connect((err, client) => {
                const dbcon = client.db(database);
                if (err) reject(err);
                console.info("mongo db connected");
                resolve(dbcon)
            });
        });
    }
    async uniqueValidation() {
        if (this.dbConnection == null) {
            try {
                this.dbConnection = await this.connection(this.connectionString, this.database);
            } catch (error) {
                console.log(error.message);
            }
            return { status: true };
        }
        // return new Promise((resolve, reject) => {
        //     this.dbConnection.find({ a: 1 }).limit(2).toArray((err, docs) => {
        //         resolve(docs);
        //     });
        // }).then(resolve => {
        //     console.log(resolve);
        // });
    }
}

module.exports = MongoDb;