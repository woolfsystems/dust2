const { USER_TYPE_CLIENT } = require('@model/role')

module.exports = {
	name: 'postcode',
	dependencies: [ 'backend' ],
	roles: [ USER_TYPE_CLIENT ],

	actions: {
		lookup(ctx) {
			ctx.broker.logger.info('meta', ctx.meta, ctx.requestID)

			ctx.broker.emit("postcode lookup", {
				postcode: ctx.params.postcode
			})

			return ctx.broker.call("message.send", {
				to: "hello@moleculer.services",
				subject: "Hello Mailer",
				//template: "welcome",
				//locale: "hu-HU", // Localized e-mail template
				// data: {
				// 	name: "John Doe",
				// 	username: "john.doe",
				// 	verifyToken: "123456"
				// }
				from: "adam@email.com",
				cc: "twoolf+testmail@gmail.com",
				html: "This is a <b>moleculer-mail</b> demo!",
				text: "This is the text part"
			}).then(_r => ctx
				.call('backend.postcodeLookup', ctx.params)
				.then(response => {
					ctx.broker.logger.info(response)
					return ctx.call('client.generateContract', ctx.params)
				}).catch(error => {
					ctx.broker.logger.error(error)
					return error
				})
			)
		}
	}
}
