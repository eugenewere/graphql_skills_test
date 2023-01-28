const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
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
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'Owner of Books',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Author Primary Key',

        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Author Name',

        },
        books: {
            type: new GraphQLList(BookType),
            description: 'Author Books',
            resolve: (author) => {
                return books.filter(book => book.authorId == author.id)
            }
        }
    })
})
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'List Of Books.',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Book Primary Key',

        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Book Name',

        },
        authorId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Book Description',
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Test Book Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Single books.',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => books.find(book => book.id == args.id)
        },
        author: {
            type: BookType,
            description: 'Single books.',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => authors.find(author => author.id == args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List Of books.',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'Authors of books',
            resolve: () => authors
        },
        
    })
})
const RootMutationsType = new GraphQLObjectType({
    name: 'Mutations',
    description: 'Root Mutations',
    fields: ()=>({
        addBook:{
            type: BookType,
            description: 'Add book',
            args:{
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId:{
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve:(parent, args) =>{
                const book ={
                    id:books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation:RootMutationsType
})

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
//             }
//         })
//     })
// })



app.use('/', graphqlHTTP({
    graphiql: true,
    schema: schema,
}));
app.listen(5000, () => { console.log('Eugene! Server is running.'); });