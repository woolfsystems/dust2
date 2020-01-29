const USER_TYPE_CLIENT = Symbol('todo') //symbol import source

module.exports = {
	name: 'postcode',
	dependencies: [ 'backend' ],
	roles: [ USER_TYPE_CLIENT ],
	actions: {
		async lookup(ctx) {
			ctx.broker.logger.info('meta', ctx.meta, ctx.requestID)

			ctx.broker.emit("postcode lookup", {
				postcode: ctx.params.postcode
			})

			return await ctx
				.call('backend.postcodeLookup', ctx.params)
				.then(response => {
					ctx.broker.logger.info(response)
					return ctx.call('client.generateContract', ctx.params)
				}).catch(error => {
					ctx.broker.logger.error(error)
					return error
				})
		}
	}
}
