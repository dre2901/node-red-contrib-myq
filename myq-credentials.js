module.exports = function (RED) {
    function MyqCredentialsNode(n) {
        RED.nodes.createNode(this, n);
        this.description = this.description;
        this.username = this.credentials.username;
        this.password = this.credentials.password;
    }
    RED.nodes.registerType("myq-credentials", MyqCredentialsNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}