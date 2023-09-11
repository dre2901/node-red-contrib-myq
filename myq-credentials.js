module.exports = function (RED) {
    const myQApi = require('@brbeaird/myq');
    function MyqCredentialsNode(config) {
        RED.nodes.createNode(this, config);
        this.description = config.description;
        this.region = config.region;
        this.username = this.credentials.username;
        this.password = this.credentials.password;
        this.api = new myQApi.myQApi(this.username, this.password, console, this.region);
    }
    RED.nodes.registerType("myq-credentials", MyqCredentialsNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}