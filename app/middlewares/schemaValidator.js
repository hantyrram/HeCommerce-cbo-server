

const Ajv = require('ajv');
const path = require('path');
/**
 * Provides a user-friendly message, for pattern schema violation.
 * @hidden
 */
const PATTERNS = {
 "^[^\\s]+$" : 'Must Not Contain Space!'
}

const definitions = require(path.resolve(SCHEMAS_PATH,'definitions.json'));
const Permission = require(path.resolve(SCHEMAS_PATH,'Permission.json'));
const Role = require(path.resolve(SCHEMAS_PATH,'Role.json'));
const Employee = require(path.resolve(SCHEMAS_PATH,'Employee.json'));
const Credential = require(path.resolve(SCHEMAS_PATH,'Credential.json'));
const Permissions = require(path.resolve(SCHEMAS_PATH,'Permissions.json'));
const ProductCategory = require(path.resolve(SCHEMAS_PATH,'ProductCategory.json'));
const Product = require(path.resolve(SCHEMAS_PATH,'Product.json'));
const ShippingZone = require(path.resolve(SCHEMAS_PATH,'ShippingZone.json'));
const ShippingMethod = require(path.resolve(SCHEMAS_PATH,'ShippingMethod.json'));

const schemas = [];//so that we can easily reference which schema to compile based on the schema defined on the api.
schemas['definitions'] = definitions;
schemas['Permission'] = Permission;
schemas['Permissions'] = Permissions;
schemas['Role'] = Role;
schemas['Employee'] = Employee;
schemas['Credential'] = Credential;
schemas['ProductCategory'] = ProductCategory;
schemas['Product'] = Product;
schemas['ShippingZone'] = ShippingZone;
schemas['ShippingMethod'] = ShippingMethod;

/**
 * @memberof middlewares
 * @type {typedefs~middleware}
 * @function validateSchema
 * @desc A route specific middleware. This middleware can be added on each Route that requires Schema
 * validation. This middleware uses schemas in the /app/schemas.
 * 
 * 
 */
module.exports = schemaValidator = (req,res,next)=>{
   console.log('@schemaValidator:46 Validating...');
   if(req.currentApi.schemaValidator && req.currentApi.schemaValidator.schema){
      // const schema = require(path.resolve(SCHEMAS_PATH,req.currentApi.schemaValidator.schema))
      const ajv = new Ajv(
         {
            schemas: [
               definitions,Permission,Permissions,Role,Credential,Employee,
            ]
         }
      );
      console.log('@schemaValidator:56 Validating ',req.currentApi.schemaValidator.schema,'...');
      console.log('@schemaValidator:57 Validating Input ',req.body);
      // let validate = ajv.addSchema(definitions).compile(schema);
      let validate = ajv.compile(schemas[req.currentApi.schemaValidator.schema]);
      let entity = req.body;
      if(req.currentApi.schemaValidator.op && !(req.body instanceof Array)){
         //add _op, from api definition
         entity = { _op: req.currentApi.schemaValidator.op, ...req.body }
      }
      let valid = validate(entity);
      console.log('@schemaValidator:66',validate.errors);
      if(!valid){        
         res.status(400).json({ error: { type: 'VALIDATION_ERROR', text: JSON.stringify(validate.errors) }});
         return;
      }
   }
   console.log('@schemaValidator:72 Validated!!!');
   next();
}

//schemas = array of {name:'SchemaName', schema:schema}
module.exports.init = (schemas)=>{
   forEach()
}
/**
 * @typedef {Object} MiddlewareOptions~validateSchemaOptions
 * @property {String} schema The name of the schema
 * @property {Array} [skip] The names of the schema field to skip validation. Example if you want to skip validation of
 * the employeeId field and differ it's validation to the service provider.
 * @property {Boolean} [requireId] Requires the _id property of the schema,useful during update operations.
 */
