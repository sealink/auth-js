"use strict";

const jwk = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const fetch = require("node-fetch");

// Generate policy to allow this user on this API:
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;

  const policyDocument = {};
  policyDocument.Version = "2012-10-17";
  policyDocument.Statement = [];
  const statementOne = {};
  statementOne.Action = "execute-api:Invoke";
  statementOne.Effect = effect;
  statementOne.Resource = resource;
  policyDocument.Statement[0] = statementOne;
  authResponse.policyDocument = policyDocument;

  return authResponse;
};

const authorize = async (event, issuer) => {
  if (event.authorizationToken) {
    const token = event.authorizationToken.substring(7);

    const response = await fetch(`${issuer}/.well-known/jwks.json`)
      .then(res => res.json())
      .then(json => {
        const keys = json;
        // Based on the JSON of `jwks` create a Pem:
        const k = keys.keys[0];
        const jwkArray = {
          kty: k.kty,
          n: k.n,
          e: k.e
        };
        const pem = jwkToPem(jwkArray);

        // Verify the token:
        const decoded = jwk.verify(token, pem, { issuer });
        return generatePolicy(decoded.sub, "Allow", event.methodArn);
      })
      .catch(err => {
        console.log(err);
        throw new Error("Unauthorized");
      });
    return response;
  } else {
    console.log("No authorizationToken found in the header.");
    throw new Error("Unauthorized");
  }
};

const authorizeStagingToken = async (event, context) => {
  return authorize(event, "https://auth-next.quicktravel.com.au");
};

const authorizeProductionToken = async (event, context) => {
  return authorize(event, "https://auth.quicktravel.com.au");
};

module.exports.authorizeStagingToken = authorizeStagingToken;
module.exports.authorizeProductionToken = authorizeProductionToken;
