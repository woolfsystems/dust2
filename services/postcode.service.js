module.exports = {
	name: 'postcode',
	dependencies: ['http'],
	actions: {
		lookup: {
			cache: {
				keys: [
					'postcode',
					'token'
				]
			},
			params: {
				postcode: 'string',
				token: 'string'
			},
			async handler(ctx) {
				console.log('ctx',ctx.meta)
				//`${getSettings().backofficeEndpoint}${getSettings().apiPostcodeLookup}${_data.postcode}`
				return await ctx.broker
					.call('http.get', {
						url: 'https://httpbin.org/status/200'
					}).then(response => {
						ctx.broker.logger.info(response.data)
						return response.data
					})
			}
		}
	}
}
