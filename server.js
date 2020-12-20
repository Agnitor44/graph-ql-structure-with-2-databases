const express = require('express')
const { graphqlHTTP } = require("express-graphql");
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require('graphql')

const app = express()
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'authors',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type:GraphQLNonNull(GraphQLString)},
        book: {type: BookType,
        resolve: (author) => {
            return books.find(book => book.authorId === author.id)
        }}
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'book written by an author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type:GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLID},
        author: {type: AuthorType,
        resolve: (book) => {
            return authors.find(author => author.id === book.authorId)
        }}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            args: {id:{type: GraphQLID}},
            resolve: (parent, args) => {return books.find(item => String(item.id) === String(args.id))}
                
            
           
        },
        author: {
            type: AuthorType,
            args: {id:{type: GraphQLID}},
            resolve: (parent, args) => {
                return authors.find(item => String(item.id) === String(args.id))
            }
        },
        books: {
            type: GraphQLList(BookType),
            description: 'list of books',
            resolve: () => {
             return  books
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'list of authors',
            resolve: () => authors
        }
    })
})
const schema = new GraphQLSchema({
    query: RootQueryType,

})

const PORT = 5000
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(PORT, () => console.log('słucham cie uważnie'))