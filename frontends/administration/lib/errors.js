class AuthenticationError extends Error{ }
class ApplicationError extends Error{ }
class ServiceError extends Error{ }
class APIError extends Error{ }

const LOGIN_REJECTED = 'User Rejected Login'
const LOGIN_FAILED = 'Login Failed'

export {
    AuthenticationError,
    ApplicationError,
    ServiceError,
    APIError,

    LOGIN_FAILED,
    LOGIN_REJECTED
}