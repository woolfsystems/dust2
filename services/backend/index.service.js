module.exports = {
    name: 'backend',
	dependencies: ['http'],
	actions: {
		postcodeLookup: {
			cache: {
				keys: [
					'postcode',
					'token'
				]
			},
			params: {
				postcode: { type: 'string', min: 3, max: 9, trim: true, convert: true },
				token: { type: 'string', min: 8, max: 1024, trim: true, convert: true }
			},
			async handler(ctx) {
				return await ctx.broker
					.call('http.get', {
                        url: 'https://httpbin.org/status/200'
                        //url: `${process.env.API_BACKEND_HOST}/${process.env.API_BACKEND_SERVICE_POSTCODE}/${ctx.params.postcode}`
					}).then(response => {
						ctx.broker.logger.info(response.data)
						return response.data
					}).catch(error => {
						ctx.broker.logger.error(error)
						return error
					})
			}
        },
        login: {
			params: {
				user: { type: 'string', min: 4, max: 128, trim: true, convert: true },
				pass: { type: 'string', min: 4, max: 32, trim: true, convert: true }
			},
			async handler(ctx) {
				return await ctx.broker
					.call('http.post', {
                        url: 'https://httpbin.org/status/200'
                        //url: `${process.env.API_BACKEND_HOST}/${process.env.API_BACKEND_SERVICE_LOGIN}`
					}).then(response => {
						ctx.broker.logger.info(response.data)
						return response.data
					}).catch(error => {
						ctx.broker.logger.error(error)
						return error
					})
			}
        }
	}
}
