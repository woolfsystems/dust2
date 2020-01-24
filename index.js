const path = require('path')
const { ServiceBroker } = require('moleculer')
const dotenv = require('dotenv')

let {parsed, error} = dotenv.config({path: '.env'})
if(error)
    throw error

const { 
    SERVICE_LIST,
    SERVICE_DIR,
    NODEID,
    NAMESPACE,
    LOG_LEVEL
} = parsed

const broker = new ServiceBroker({
    nodeID: NODEID,
    namespace: NAMESPACE,
    logger: true,
    logLevel: LOG_LEVEL,
    transporter: 'NATS',
    requestTimeout: 5 * 1000,
    circuitBreaker: {
        enabled: false
    },
    metrics: true
})


SERVICE_LIST.split(',')
    .forEach(async (_SERVICE) => {
        let _FN = path.join(SERVICE_DIR, `${String(_SERVICE).trim()}/index.service.js`)
        await broker.loadService(_FN)
        broker.logger.info('Loaded', _SERVICE, _FN)
    })

broker.start()