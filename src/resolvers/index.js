const fsPromises = require('fs/promises')
const { GraphQLError, graphql, defaultTypeResolver } = require('graphql')
const path = require('path')
const { fileExists, readJsonFile } = require('../utils/fileHandling') //kolla så den expoteras rätt i filen fileHandling.js
const crypto = require('node:crypto')
const { stringify } = require('querystring')
const { type } = require('os')
const { dirname } = require('path')
const { response } = require('express')
const { doc } = require('prettier')
const axios = require('axios').default //ladda ner axios
// const projectsDirectory = path.join(__dirname, '..', 'data', 'projects')
// const { ticketPriority, ticketType, ticketStatus } = require('../enums/authors')

exports.resolvers = {
	Query: {
		getAllAuthors: async (_, args) => {
			let authors = []
			try {
				const response = await axios.get(process.env.SHEETDB_URI)
				if (response.data?.length > 0) {
					authors = response.data
				}
				console.log(response.data)
				// return response.data
			} catch (error) {
				console.log(error)
				return new GraphQLError('Oooops.. something went wrong')
			}
			return authors
		},
	},

	Mutation: {
		deleteAuthor: async (_, args) => {
			const authorId = args.authorId

			try {
				const endpoint = `${process.env.SHEETDB_URI}/id/${authorId}`
				const response = await axios.delete(endpoint)

				return {
					deletedId: authorId,
					success: true,
				}
			} catch (error) {
				console.log(error)
				// return new GraphQLError ("Ops coudnt delete that")
				return {
					deletedId: authorId,
					success: false,
				}
			}
		},

		createAuthor: async (__, args) => {
			console.log('running')
			console.log(args)

			const { firstname, lastname, year, books, authorId } = args.input

			const getallNewAuthor = {
				id: crypto.randomUUID(),
				firstname,
				lastname,
				year,
				books,
				authorId,
			}

			console.log(getallNewAuthor)

			try {
				const endpoint = process.env.SHEETDB_URI
				const respons = await axios.post(
					endpoint,
					{
						data: JSON.stringify(getallNewAuthor),
					},
					{
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'Accept-Encoding': 'gzip,deflate,compress',
						},
					}
				)

				// console.log(respons)
			} catch (error) {
				console.log(error)
				return new GraphQLError('Could not create the author...')
			}

			return getallNewAuthor
		},
	},
}
