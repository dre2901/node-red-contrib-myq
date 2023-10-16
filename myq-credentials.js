module.exports = function (RED) {
    const myQApi = require('@brbeaird/myq');
    const util = require('util');
    function MyqCredentialsNode(config) {
        RED.nodes.createNode(this, config);
        this.description = config.description;
        this.username = this.credentials.username;
        this.password = this.credentials.password;
        const logger = this;
        this.api = new myQApi.myQApi({
            debug: (message, ...parameters) => logger.debug(util.format(message, ...parameters)),
            error: (message, ...parameters) => logger.error(util.format(message, ...parameters)),
            info: (message, ...parameters) => logger.log(util.format(message, ...parameters)),
            warn: (message, ...parameters) => logger.warn(util.format(message, ...parameters))
        });
    }
    RED.nodes.registerType("myq-credentials", MyqCredentialsNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}