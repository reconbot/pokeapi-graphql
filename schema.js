// This example demonstrates a simple server with some
// relational data: Posts and Authors. You can get the
// posts for a particular author, and vice-versa

// Read the complete docs for graphql-tools here:
// http://dev.apollodata.com/tools/graphql-tools/generate-schema.html

const { find, filter } = require('lodash')
const { makeExecutableSchema } = require('graphql-tools')
const { connectionFromArray, connectionArgs } = require('graphql-relay')
const data = require('./data/data.json')

const typeDefs = `
  type Query { debug: Boolean! }

  type Pokemon {
    id: Int!
    identifier: String!
    species: Species!
    height: Int!
    weight: Int!
    baseExperience: Int!
    order: Int!
    default: Boolean!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type PokemonEdge {
    node: Pokemon!
    cursor: String!
  }

  type PokemonConnection {
    pageInfo: PageInfo!
    edges: [PokemonEdge!]!
    count: Int!
  }

  extend type Query {
    pokemonConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): PokemonConnection!
  }

  type Species {
    id: Int!
    identifier: String!
    genderRate: Int!
    captureRate: Int!
    baseHappiness: Int!
    isBaby: Boolean!
    hatchCounter: Int!
    hasGenderDifferences: Boolean!
    formsSwitchable: Boolean!
    order: Int!
    conquestOrder: String
    pokemonConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): PokemonConnection!
  }

  type SpeciesEdge {
    node: Species!
    cursor: String!
  }

  type SpeciesConnection {
    pageInfo: PageInfo!
    edges: [SpeciesEdge!]!
    count: Int!
  }

  extend type Query {
    speciesConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): SpeciesConnection!
  }

  # this schema allows the following mutation:
  # type Mutation {
  #  upvotePost (
  #    postId: Int!
  #  ): Post
  #}
`;

const resolvers = {
  Query: {
    pokemonConnection: (_, args) => Object.assign(connectionFromArray(data.pokemon, args), { count: data.pokemon.length }),
    speciesConnection: (_, args) => Object.assign(connectionFromArray(data.pokemonSpecies, args), { count: data.pokemonSpecies.length }),
    debug: () => true
  },
  Pokemon: {
    species: ({ speciesId }) => find(data.pokemonSpecies, { id: speciesId })
  },
  Species: {
    pokemonConnection: ({ id }, args) => {
      const pokemon = filter(data.pokemon, pokemon => pokemon.speciesId === id)
      return Object.assign(connectionFromArray(pokemon, args), { count: pokemon.length })
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs: [ typeDefs ],
  resolvers,
})

module.exports = schema
