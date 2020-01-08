"use strict";

const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
	transporter: "NATS",
	metrics: true
});

broker.loadServices();
broker.start();
