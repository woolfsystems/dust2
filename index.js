"use strict";

const Axios = require('moleculer-axios')
const { ServiceBroker } = require('moleculer')

const broker = new ServiceBroker({
	transporter: "NATS",
	metrics: true
});


broker.loadServices()
broker.createService(Axios)
broker.start()
