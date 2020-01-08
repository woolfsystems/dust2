const fs = require("fs");
const path = require("path");
const { ForbiddenError, UnAuthorizedError, ERR_NO_TOKEN, ERR_INVALID_TOKEN } = require("moleculer-web/src/errors");
const ApiGateway = require("moleculer-web");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	mixins: ApiGateway,
	settings: {
		port: 4000,
		ip: "0.0.0.0",
		https: {
			key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
			cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem"))
		},
		//http2: true,
		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			allowedHeaders: "*",
			//exposedHeaders: "*",
			credentials: true,
			maxAge: null
		},
		rateLimit: {
			window: 10 * 1000,
			limit: 10,
			headers: true
		},
		etag: true,
		path: "/api",
		routes: [
			{
				path: "/admin",
				whitelist: [
					"users.*",
					"$node.*"
				],
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
				},
				authorization: true,
				roles: ["admin"],
				aliases: {
					"POST users": "users.create",
					"health": "$node.health"
				},
				bodyParsers: {
					json: true
				},
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					ctx.meta.authToken = req.headers["authorization"];
				},
				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("X-Custom-Header", "Authorized path");
					return data;
				},
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}
			},

			{
				path: "/upload",
				authorization: false,
				bodyParsers: {
					json: false,
					urlencoded: false
				},
				aliases: {
					"GET /": "file.get",
					"FILE /": "file.save"
				},
				busboyConfig: {
					limits: {
						files: 1
					}
				},
				callOptions: {
					meta: {
					}
				},
				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("async onAfterCall in upload route");
					return new this.Promise(resolve => {
						res.setHeader("X-Response-Type", typeof(data));
						resolve(data);
					});
				},
				mappingPolicy: "restrict"
			},
			{
				path: "/",
				use: [
				],
				etag: true,
				whitelist: [
					"auth.*",
					"file.*",
					"test.*",
				],
				authorization: false,
				camelCaseNames: true,
				aliases: {
					"login": "auth.login",
				},
				bodyParsers: {
					json: true,
					urlencoded: { extended: true }
				},
				callOptions: {
					timeout: 3000,
					//fallbackResponse: "Fallback response via callOptions"
				},
				onBeforeCall(ctx, route, req, res) {
					return new this.Promise(resolve => {
						this.logger.info("async onBeforeCall in public. Action:", ctx.action.name);
						ctx.meta.userAgent = req.headers["user-agent"];
						//ctx.meta.headers = req.headers;
						resolve();
					});
				},
				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("async onAfterCall in public");
					return new this.Promise(resolve => {
						res.setHeader("X-Response-Type", typeof(data));
						resolve(data);
					});
				},
			}
		],

		assets: {
			folder: "./static/www",
			options: {}
		},

		onError(req, res, err) {
			res.setHeader("Content-Type", "text/plain");
			res.writeHead(err.code || 500);
			res.end("Global error: " + err.message);
		},

		log4XXResponses: false,
	},
	events: {
		"node.broken"(node) {
			this.logger.warn(`The ${node.id} node is disconnected!`);
		}
	},
	methods: {
		/**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		authorize(ctx, route, req) {
			/*let authValue = req.headers["authorization"];
			if (authValue && authValue.startsWith("Bearer ")) {
				let token = authValue.slice(7);

				// Verify JWT token
				return ctx.call("auth.verifyToken", { token })
					.then(decoded => {
						//console.log("decoded data", decoded);

						// Check the user role
						if (route.opts.roles.indexOf(decoded.role) === -1)
							return this.Promise.reject(new ForbiddenError());

						// If authorization was success, we set the user entity to ctx.meta
						return ctx.call("auth.getUserByID", { id: decoded.id }).then(user => {
							ctx.meta.user = user;
							this.logger.info("Logged in user", user);
						});
					})

					.catch(err => {
						if (err instanceof MoleculerError)
							return this.Promise.reject(err);

						return this.Promise.reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
					});

			} else
				return this.Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));

				*/
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token") {
					token = req.headers.authorization.split(" ")[1];
				}
			}
			if (!token) {
				return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
			}
			// Verify JWT token
			return ctx.call("auth.resolveToken", { token })
				.then(user => {
					return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
				});
		}
	}
};
