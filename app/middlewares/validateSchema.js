const Ajv = require('ajv');
const {routes,ERRORS} = require('../config');
const {getRoute} = require('../helpers');

/**
 * Provides a user-friendly message, for pattern schema violation.
 * @hidden
 */
const PATTERNS = {
 "^[^\\s]+$" : 'Must Not Contain Space!'
}



/**
 * @deprecated
 * @memberof middlewares
 * @type {typedefs~middleware}
 * @function validateSchema
 * @desc A route specific middleware. This middleware can be added on each Route that requires Schema
 * validation. This middleware uses schemas in the /app/schemas.
 * 
 * 
 */
module.exports = validateSchema = (req,res,next)=>{
  let route = getRoute(routes,req);
  //check required properties
  const { validateSchema } = route;
  
  if(!validateSchema || !validateSchema.schema){
   let error = new Artifact.Error(ERRORS.SERVER_ERROR_SCHEMA_NOT_FOUND_ON_ROUTE,'Please contact Administrator!');
   let artifact = new Artifact(Artifact.NOK,'M_validate_schema',error);
   next(artifact);
  }

  const { schema: SCHEMA_NAME, requireId, skip, generateEntity } = validateSchema;

  let jsonSchema = require(`../schemas/${SCHEMA_NAME}.json`);
  
  if(requireId){
   if(!jsonSchema.required){
    jsonSchema.required = [];
   }
   //??? ADD AS APP CONFIG, allow user to decide label of id e.g. _id, ID, userID
   !jsonSchema.required.includes('_id')? jsonSchema.required.push("_id"): null; 
  }

  
  let subject = Object.assign({},req.body);

   if(skip && skip.length > 0){
   //delete properties mentioned on skip array
   console.log('skip',skip);
   for(let str of skip){
         delete jsonSchema.properties[str];
         delete subject[str];
      }
   }
  let ajv = new Ajv();
  let validate = ajv.compile(jsonSchema);
  console.log('validateSchema subject',subject);
  console.log('validateSchema jsonSchema',jsonSchema);
  let valid = validate(subject);
  if(!valid){
   console.log(validate.errors);
   let error = new Artifact.Error(ERRORS.VALIDATION_ERROR,`Validation Failed! ${SCHEMA_NAME} ${validate.errors[0].message}`);
   if(validate.errors[0].keyword === 'pattern'){//pattern failure
      let fieldName = validate.errors[0].dataPath;
      let txt = PATTERNS[validate.errors[0].params.pattern] || 'Invalid Pattern';
    error = new Artifact.Error(ERRORS.VALIDATION_ERROR,`${fieldName}: ${txt}`);
   }
   if(validate.errors[0].keyword === 'format'){
      let fieldName = validate.errors[0].dataPath;
      error = new Artifact.Error(ERRORS.VALIDATION_ERROR,`${fieldName}: Invalid Format`);
   }

   let artifact = new Artifact(Artifact.NOK,'M_validate_schema',error);
   next(artifact);
   return;
  }

  //???
  //** if generateEntity, generate an entity based on schema attach it to the req as req.validated.user we can't make sure to namespace so we don't pollute the req */
  // if(generateEntity){
  //  let entity = Object.assign({},jsonSchema.properties);
  //  entity = Object.assign(entity,req.body);
  //  console.log(entity);
  // }
 
  //signifies that the req.body has undergone schema validation
  req.schemaValidationDone = true; 
  //the schema used during validation
  req.schemaValidationSchema = jsonSchema;
  next();
}

/**
 * @typedef {Object} MiddlewareOptions~validateSchemaOptions
 * @property {String} schema The name of the schema
 * @property {Array} [skip] The names of the schema field to skip validation. Example if you want to skip validation of
 * the employeeId field and differ it's validation to the service provider.
 * @property {Boolean} [requireId] Requires the _id property of the schema,useful during update operations.
 */