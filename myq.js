module.exports = function (RED) {
    const MyQ = require('myq-api');
    const api = new MyQ();

    function MyqDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const username = this.credentials.username;
        const password = this.credentials.password;
        const serialNumber = config.serialnumber;

        node.on('input', function (msg, send, done) {
            api
                .login(username, password)
                .then((loginResult) => {
                    this.debug(`Short-lived security token: '${loginResult.securityToken}'`);
                    // return api.getDevices();

                    if (msg.payload === 'close') {
                        this.debug(`Close door with serial number ${serialNumber}`);
                        return api.setDoorState(serialNumber, MyQ.actions.door.CLOSE);
                    } else if (msg.payload === 'open') {
                        this.debug(`Open door with serial number ${serialNumber}`);
                        return api.setDoorState(serialNumber, MyQ.actions.door.OPEN);
                    } if (msg.payload === 'off') {
                        this.debug(`Turning off lights with serial number ${serialNumber}`);
                        return api.setLightState(serialNumber, MyQ.actions.light.TURN_OFF);
                    } if (msg.payload === 'on') {
                        this.debug(`Turning on lights with serial number ${serialNumber}`);
                        return api.setLightState(serialNumber, MyQ.actions.light.TURN_ON);
                    } else {
                        this.debug(`Retrieving state for serial number ${serialNumber}`);
                        // return api.getDoorState(serialNumber);
                        return api.getDevice(serialNumber);
                    }
                })
                .then((result) => {
                    this.debug('MyQ result:');
                    this.debug(JSON.stringify(result, null, 2));
                    if (result.device) {
                        if (result.device.state.door_state === 'open' || result.device.state.light_state === 'on') {
                            this.status({ fill: "red", shape: "dot", text: result.device.state.door_state || result.device.state.light_state });
                        } else if (result.device.state.door_state === 'closed' || result.device.state.light_state === 'off') {
                            this.status({ fill: "green", shape: "dot", text: result.device.state.door_state || result.device.state.light_state });
                        }
                    }
                    msg.payload = result;
                    node.send(msg);
                    if (done) {
                        // Node-RED 1.0 compatible
                        done();
                    }
                })
                // .then((getDevicesResult) => {
                //     this.debug('getDevices result:');
                //     this.debug(JSON.stringify(getDevicesResult, null, 2));

                //     const { devices } = getDevicesResult;
                //     if (devices.length === 0) {
                //         throw Error('No devices found!');
                //     }
                //     this.debug('Devices:');
                //     devices.forEach((device, index) => {
                //         this.debug(
                //             `Device ${index} - Name: '${device.name}', Serial Number: '${device.serial_number}'`
                //         );
                //     });


                //     msg.payload = devices;
                //     node.send(msg);
                //     if (done) {
                //         // Node-RED 1.0 compatible
                //         done();
                //     }
                // })
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
    RED.nodes.registerType("myq-device-node", MyqDeviceNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}