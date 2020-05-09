try {
    MysqlClient = require('mysql');
    Util = require('../util');
} catch (error) { }
class MySql {
    constructor(dbConnectionSettings = null) {
        this.dbConnectionSettings = dbConnectionSettings;
        this.dbConnection = null;
        this.uniqueValidation = this.uniqueValidation.bind(this);
        this.existsValidation = this.existsValidation.bind(this);
    }
    async connection() {
        if (this.dbConnectionSettings != null) {
            var con = MysqlClient.createConnection(this.dbConnectionSettings);
            return new Promise((resolve, reject) => {
                con.connect((err) => {
                    if (err) reject(err);
                    console.log("mysql connected");
                    resolve(con);
                });
            });
        } else {
            throw 'db connection settings not found';
        }
    }
    async uniqueValidation(tableAndColumn, request, customMessage, property) {
        try {
            let [table, columnName] = tableAndColumn.split(',');
            if (columnName == undefined)
                columnName = property;
            const userInputValue = request[property];
            if (this.dbConnection == null)
                this.dbConnection = await this.connection();
            let findings = await this.query(`SELECT ${columnName} FROM ${table} WHERE ${columnName}="${userInputValue}"`);
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

    async existsValidation(tableAndColumn, request, customMessage, property) {
        try {
            let [table, columnName] = tableAndColumn.split(',');
            if (columnName == undefined)
                columnName = property;
            const userInputValue = request[property];
            if (this.dbConnection == null)
                this.dbConnection = await this.connection();
            let findings = await this.query(`SELECT ${columnName} FROM ${table} WHERE ${columnName}="${userInputValue}"`);
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

    async query(query) {
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (err, result, fields) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = MySql;