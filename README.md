# node-red-contrib-myq
Node-Red node to control MyQ (Chamberlain) devices. Based on awesome [myq-api](https://github.com/thomasmunduchira/myq-api) library. 

## Installation
```
npm install node-red-contrib-myq
```
Drop the `myq device node` to your flow. Set `Serial number`, `Username` and `Password` in properties. That's it. 

## Inputs
`payload` (optional) - string

Action to perform on device. Supported actions for doors `open` and `close`, for lights `on` and `off`, for lamps `lamp_on` and `lamp_off`. Any other content or no payload at all will trigger retrieval of status information

## Outputs
* Status output

`payload` - object

Returns extended status information about device in `payload.device`

* Action output

`payload` - object

Confirmation of succussful action execution

* Standard error

`payload` - string

The standard error of the command
