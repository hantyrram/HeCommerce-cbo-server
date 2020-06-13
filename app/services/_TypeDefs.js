/**
 * @namespace TypeDefs.Service
 * @typedef {Function} service
 * @description A service is an express middleware that represents an endpoint of a request. A service contains
 * the business logic necessary in generating a response to a particular request. A service responds in a
 * standard form called @see {TypeDefs.Service.Artifact}.
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next next is only called with error, no other request handler will succeed/follow/trail a service. 
 * @property {String} label A short description of the service.
 * @property {String} description A text comprehensibly describing the service's function, prerequisites & conditions
 * behind the generated error or successful responses/Artifact.
 */

/**
 * A referer is a service that forwards it's request to other service. 
 * @namespace TypeDefs.Service
 * @typedef {Object} referer
 * @property {String} name - The service name of the referer, this will identify where the request originated.
 * @property {Object} params - The params that conforms to the route params of the current service accepting the
 * referer's request. If the service accepts /path/:id, id should be a property of the referer.params.
 * @property {function} errHandler - A callback that a referer provides, this accepts an error Artifact.
 * 
 */