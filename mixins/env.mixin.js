const dotenv = require('dotenv')

module.exports = {
    created() {
        let {parsed, error} = dotenv.config({path: `${__dirname}/.env`})
        if(error && this.envRequired){
            throw new Error('failed to load config')
        }
        this.env = {
            ...process.env,
            ...parsed
        }
        this.broker.logger.info(this.name, 'Local environment settings loaded')
    }
}