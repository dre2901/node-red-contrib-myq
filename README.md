# node-red-contrib-myq
Node-Red node to control MyQ (Chamberlain) devices

## Inputs
`payload` (optional) - string

Action to perform on device. Supported actions for doors `open` and `close`, for lights `on` and `off`. Any other content or no payload at all will trigger retrieval of status information

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
