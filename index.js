const server = require("apollo-server-lambda");
const myGraphQLSchema = require('./schema')

exports.handler = server.graphqlLambda({ schema: myGraphQLSchema });
