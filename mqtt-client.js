// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var transport = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var NoRetry = require('azure-iot-common').NoRetry;

var connectionString = '<your-iot-hub-connection-string-here>';
var client = DeviceClient.fromConnectionString(connectionString, transport);

client.setRetryPolicy(new NoRetry());

client.open(function(err) {
  if (err) {
    console.error("could not open IotHub client", err);
    process.exit(-1);
  } else {
    console.log("client opened");

    client.on("error", err => console.error(err));
    client.on("disconnect", err => console.error(err));

    sendMessages();
  }
});

function sendMessages() {
  var message = new Message(JSON.stringify('date: ' + new Date()));
  console.log('Sending message: ' + message.getData());
  client.sendEvent(message, function (err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log('Sent message:    ' + message.getData()+'\n');
    setTimeout(sendMessages, 1000);
  });
}

setInterval(() => console.log("60s passed"), 60000);