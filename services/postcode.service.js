module.exports = {
	name: "postcode",
	actions: {
		async lookup(ctx) {
			//`${getSettings().backofficeEndpoint}${getSettings().apiPostcodeLookup}${_data.postcode}`
			//return Number(ctx.params.a) + Number(ctx.params.b);
			return await ctx.broker
				.call("axios.get", {url: "https://httpbin.org/status/200"})
				.then(response => {
					ctx.broker.logger.info(response)
					return response.data
				})
				// .catch(broker.logger.error);
		}
	}
}
