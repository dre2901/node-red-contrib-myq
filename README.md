# node-red-contrib-myq
Node-Red node to control MyQ (Chamberlain) devices. Based on awesome [myq](https://github.com/hjdhjd/myq) library. 

## Installation
```
npm install node-red-contrib-myq
```
Drop the `myq device node` to your flow. Provide your MyQ credentials (`Username` and `Password`), set `Serial number` or `Name` (if both are set then `Serial number` will be used to identify the device) in properties. That's it. 

## Inputs
`payload` (optional) - string

Action to perform on device. If `payload` is null, empty or `info` then it will trigger retrieval of status information. Any other payload will be sent as is to the API (for example, there are actions for doors `open` and `close`, for lights `on` and `off`, for lamps `lamp_on` and `lamp_off`).

## Outputs
* Status output

`payload` - object

Returns extended status information about device in `payload`

* Action output

`payload` - boolean

Confirmation of successful action execution

* Standard error

`payload` - string

The standard error of the command
