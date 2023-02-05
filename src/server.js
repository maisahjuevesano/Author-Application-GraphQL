require('dotenv').config() //Enables node to be able to read our .env variables
const { ApolloServer } = require('@apollo/server')
const { resolvers } = require('./resolvers')
const { loadFiles } = require('@graphql-tools/load-files') //detta laddar in vårt schema
const { makeExecutableSchema } = require('@graphql-tools/schema') // för att skapa ett schema
const path = require('path')
// const { startStandaloneServer } = require('@apollo/server/standalone') //denna löste hela json grejen för oss
const { expressMiddleware } = require('@apollo/server/express4')

const express = require('express') //nu konfigurerar vi express, här importerade vi
const app = express() /*sen skapar vi en app, som har möjlighet att lyssna på request den gör inte det än dock, 
utan det gör man genom att kalla.*/

//såhär använder man middleware, inom parenteser vadå?

//Här startar middleware
app.use(express.json()) //detta översätter javascriptet till args?//varför använder vi paketet express.json? det tar json och översätter det till args?
//app.use betyder använd den här koden

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

/*static gör så att den skapar en sökväg så att den blir public, via host. 
skapar en url struktur som det brukar vara med filerna.Allt i public ska skicka tillbaks till en urlfil.*/

const port = process.env.PORT || 5000
//den heter function run för inuti måste vi använda en await
async function run() {
	try {
		const typeDefs = await loadFiles(path.join(__dirname, 'schema.graphql')) //loadfiles tar bara vårt schema och läser den filen
		const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })
		const server = new ApolloServer({ schema: schema })
		// const res = await startStandaloneServer(server)
		// console.log(`🚀 Server ready at ${res.url}`)
		await server.start() //nu har vi startat vår apollo server

		/*vi måste säga i denna app express kommer det ligga någonting i /graphql, vi vill att den hittar dit när man går till
		den filen*/

		app.use('/graphql', expressMiddleware(server))
		//när du går till graphql använd denna typ av middleware.
		//detta har inte med filen att göra utan med url:en att göra.
		//efter denna slutar middleware

		app.listen(port, () => {
			console.log(`Server ready at http://localhost:5000`)
		}) //inuti skriver vi en port som localhost i detta fall har jag anget variabelnamnet port tidigare som localhost 5000
	} catch (error) {
		console.error(error)
	}
}

run()

//all denna kod ger oss ett fint interface
