/**
 * @namespace typedefs
 */

/**
 * A function that handles a route.
 * 
 * @typedef { function } RouteHandler
 * @param {Object} req
 * @param {Object} res
 */ 

/**
 * Defines the properties of a Service
 * @typedef { object } ServiceApi
 * @property { string } path - The api endpoint
 * @property { string } [ type = secure]  -  The type of the api, secure or public. Public api does not require authentication.
 * @property { string } method - The http method.
 * @property { string } resource - The type of resource.
 * @property { string } op - The operation performed by the service on the identified resource.
 * @property { string } [description] - The description of the service.
 */



/**
 * The service that handles a particular api endpoint.
 * @typedef { ( Array | RouteHandler ) } Service 
 * @prop { ServiceApi } api 
 */

/**
 * @typedef {function} typedefs~service - A service responds to api requests.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @property {Boolean} [permissionIsRequired=true] - Must be explicitly set to false, for the service to bypass authentication.
 */

 /**
  * An express middleware
 * @see {@link https://expressjs.com/en/guide/using-middleware.html} 
 * @typedef {function} typedefs~middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

 /**
 * A helper is a unit of work in a form of a globally accessible reusable function. 
 * Helper functions must be exported from helpers/index.
 * @see {@link https://expressjs.com/en/guide/using-middleware.html} 
 * @typedef {function} typedefs~helper
 * @param {*} [args]
 */

/**
 * @namespace middlewares
 * 
 */

/**
 * @namespace schemas
 * 
 */

/**
 * @namespace helpers
 * 
 */ 

/**
 * @namespace policies
 * 
 */

/**
 * @namespace rules
 * 
 */

/**
 * @namespace local_modules 
 */ 

