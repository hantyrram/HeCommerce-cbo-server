PRBA
=================================

## Policy & Role Based Authorization

PRBA is an express middleware module providing authorization mechanism to expressjs applications. Policy & Role based authorization uses Policies, Rules and User Roles as bases of authorizing a request. The PRBA module authorizes a request by validating it with the collection of Policies passed during invocation. Internally policies are just a collection of Rule instances, each Rule instance's `check()` methods are invoked making sure it does not throw a PolicyViolation. If no Rule throws a PolicyViolation exception then the http request is said to have passed the authorization process. If a single Rule's `check()` method invocation throws a PolicyViolation exception the request is said to be unauthorized and the PRBA calls the `next(policyViolation)`

**User :** An object identifying the currently logged in user. A user object MUST be present on the http request object.
**Rule :** A class that defines a certain specific condition that an http request must pass in order for it to be authorized.A Rule abstract class is provided and MUST be extended by any Rule implementing the condition method.
**Policy :** Is just an Array/Collection of Rule instances.
**User Role:** Each User that is subject for authorization may have a Role. A Role is a text identifying
the user's role e.g. 'admin'.

`
 const express = require('express');
 const app = express();
 const policies = getPoliciesDefinition();
 prba.deserializeUserRoles(function(user,done){
  function(currentLoggedInUser,done){
  if(currentLoggedInUser.roles !== undefined && currentLoggedInUser.roles.length !== 0){
   db.collection('roles')
   .find({$or: currentLoggedInUser.roles.map(roleName=>{name:roleName})})
   .toArray(function(error,documents){
    done(documents);
   });
  }
 });
 app.use(prba(policies));

`
           
    
