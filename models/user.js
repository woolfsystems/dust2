const roles = require('@model/role')

class User {
	id = undefined
	meta = { }
	type = undefined

	constructor({id, type, meta}){
        if(typeof roles[type] === 'undefined')
            throw new Error('Invalid user role')
		this.id = id
		this.type = type

		this.meta = meta
	}
}

module.exports = {
    User
}
