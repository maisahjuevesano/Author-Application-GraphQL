console.log('hello')

//query beskriver bara vår request, vad vi vill göra

const graphQLQuery = async (url, query, variables = {}) => {
	//url till servern där vi skapar vårt api. //parametern som måste heta såhär inom body.
	const response = await fetch(url, {
		method: 'POST', //i method kommer alltid post, man gör aldrig en get request. Vi gör alltid ett post request till ett graphqlapi.
		headers: {
			'Content-Type': 'application/json',
		},

		body: JSON.stringify({
			query,
			variables,
		}),
	})

	const res = await response.json()
	return res.data
}

const getAllAuthorsQuery = `query Query { getAllAuthors {
                id
                firstname
                lastname
                year
                books
            }
        }`

//För mutation
/*Vi skapar 
        .skickar in ett js objekt som matchar - dollartecknet är framför det variabelnamn vi måste använda.
        sen skickar vi med objektet som matchar med vårt schema.*/

const createAuthorQuery = `mutation CreateAuthor($input: CreateAuthurInput) {
            createAuthor(input: $input) {
                id
                firstname
                year
                books
                lastname
            }
        }`

const deleteAllAuthorQuery = `mutation DeleteAuthor($authorId: ID!) {
  deleteAuthor(authorId: $authorId) {
    deletedId
  }
}`

const listTheAuthors = document.querySelector('.listTheAuthors')
const authorContainer = document.querySelector('#author-selection')

let authors = []
let author = []

console.log(listTheAuthors, authorContainer)
listTheAuthors.addEventListener('click', async (e) => {
	e.preventDefault()
	displayAuthor()
})

const formDelete = document.querySelector('.deleteAuthor')
formDelete.addEventListener('submit', async (e) => {
	e.preventDefault()

	const response = await graphQLQuery('http://localhost:5000/graphql', deleteAllAuthorQuery, {
		// @ts-ignore
		authorId: document.getElementById('idname').value,
	})

	// let authorList = JSON.parse(localStorage.getItem("authorList") || "[]");
	// const messagecontainer = document.createElement("p");
	// messagecontainer.innerHTML = "Author was deleted!"
	// authorContainer.appendChild(messagecontainer)
	alert('Deleted success!')
	window.location.reload()
	displayAuthor()

	console.log(response)

	// authors = await response.getAllAuthors;
	// @ts-ignore
	document.removeDeleteInputs.reset()
})

const formCreate = document.querySelector('.createAuthor')
formCreate.addEventListener('submit', async (e) => {
	e.preventDefault()

	const response = await graphQLQuery('http://localhost:5000/graphql', createAuthorQuery, {
		input: {
			// @ts-ignore
			firstname: document.getElementById('firstname').value,
			// @ts-ignore
			lastname: document.getElementById('lastname').value,
			// @ts-ignore
			books: document.getElementById('books').value,
			// @ts-ignore
			year: document.getElementById('year').value,
		},
	})

	displayAuthor()
	console.log(response)
	// @ts-ignore
	document.removeCreateInputs.reset()

	// authors = await response.getAllAuthors;
})

const displayAuthor = async () => {
	authorContainer.innerHTML = ''

	const response = await graphQLQuery('http://localhost:5000/graphql', getAllAuthorsQuery)

	authors = await response.getAllAuthors
	console.log(authors)

	const displayTitle = document.createElement('h1')
	displayTitle.classList.add('title')
	displayTitle.innerHTML = 'All Authors'
	authorContainer.appendChild(displayTitle)

	authors.forEach((author) => {
		const authorDiv = document.createElement('div')
		authorDiv.classList.add('authorDiv')

		const displayId = document.createElement('p')
		const displayName = document.createElement('p')
		const displayLastname = document.createElement('p')
		const displayYear = document.createElement('p')
		const displayBooks = document.createElement('p')

		displayId.innerHTML = author.id
		displayName.innerHTML = author.firstname
		displayLastname.innerHTML = author.lastname
		displayYear.innerHTML = author.year
		displayBooks.innerHTML = author.books

		authorDiv.appendChild(displayId)
		authorDiv.appendChild(displayName)
		authorDiv.appendChild(displayLastname)
		authorDiv.appendChild(displayYear)
		authorDiv.appendChild(displayBooks)

		authorContainer.appendChild(authorDiv)
		localStorage.setItem('authorList', JSON.stringify(authors)) //Spara i LS
	})

	console.log(authors)
}
