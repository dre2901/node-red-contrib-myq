module.exports = function (RED) {
    const myQApi = require('@hjdhjd/myq');

    function MyqDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.user = RED.nodes.getNode(config.user);
        const username = this.user ? this.user.username : '';
        const password = this.user ? this.user.password : '';
        const serialNumber = config.serialnumber;
        const deviceName = config.name;
        const api = new myQApi.myQApi(username, password);

        node.on('input', function (msg, send, done) {
            api
                .refreshDevices()
                .then((refreshResult) => {
                    this.debug(`Result of devices refresh: '${refreshResult}'`);
                    if (!refreshResult) {
                        return Promise.reject('Could not refresh devices!');
                    } else {
                        this.debug(api.devices);

                        const device = api.devices.find(
                            (d) => (serialNumber && serialNumber === d.serial_number || deviceName === d.name)
                        );

                        if (!device) {
                            return Promise.reject(`No device with either serial number "${serialNumber}" or name "${deviceName}" were found!`);
                        } else {
                            if (!msg.payload || msg.payload === '' || msg.payload === 'info') {
                                this.debug(`Retrieving state for serial number "${serialNumber}" or name "${deviceName}"`);
                                return Promise.resolve(device);
                            } else {
                                this.debug(`Executing command "${msg.payload}" for device door with serial number "${serialNumber}" or name "${deviceName}"`);
                                return api.execute(device, msg.payload);
                            }
                        }
                    }
                })
                .then((result) => {
                    this.debug('MyQ result:');
                    this.debug(JSON.stringify(result, null, 2));
                    if (result.state) {
                        if (result.state.door_state === 'open' || result.state.light_state === 'on' || result.state.lamp_state === 'on') {
                            this.status({ fill: "red", shape: "dot", text: result.state.door_state || result.state.light_state || result.state.lamp_state });
                        } else if (result.state.door_state === 'closed' || result.state.light_state === 'off' || result.device.state.lamp_state === 'off') {
                            this.status({ fill: "green", shape: "dot", text: result.state.door_state || result.state.light_state || result.state.lamp_state });
                        }
                    }
                    msg.payload = result;
                    node.send(msg);
                    if (done) {
                        // Node-RED 1.0 compatible
                        done();
                    }
                })
                .catch((error) => {
                    this.error('Error received:');
                    this.error(error);
                    this.error(`Error code: ${error.code}`);
                    this.error(`Error message: ${error.message}`);
                    if (done) {
                        // Node-RED 1.0 compatible
                        done(error);
                    } else {
                        // Node-RED 0.x compatible
                        node.error(error, msg);
                    }
                });

        });
    }
    RED.nodes.registerType("myq-device-node", MyqDeviceNode);
}