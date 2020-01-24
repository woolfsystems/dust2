module.exports = {
	name: 'postcode',
	dependencies: ['backend'],
	actions: {
		async lookup(ctx) {
			ctx.broker.logger.info('meta',ctx.meta)
			//`${getSettings().backofficeEndpoint}${getSettings().apiPostcodeLookup}${_data.postcode}`
			ctx.broker.emit("postcode lookup", {
				postcode: ctx.params.postcode
			})
			return await ctx.broker
				.call('backend.postcodeLookup', ctx.params, {meta: ctx.meta})
				.then(response => {
					ctx.broker.logger.info(response)
					return response
				}).catch(error => {
					ctx.broker.logger.error(error)
					return error
				})
		}
	}
}
