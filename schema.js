const fetch = require('node-fetch');
const util = require('util');
const parseXML = util.promisify(require('xml2js').parseString);
const  {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const BooksType = new GraphQLObjectType({
    name: 'Book',
    desciption: 'returns books related to specific author',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.isbn[0]
        },
        imgPath: {
            type: GraphQLString,
            resolve: xml => xml.image_url[0]
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    desciption: '...',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BooksType),
            resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
        }
    })
})
 
module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        desciption: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root,args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=ONapPQ8jcwSHo4TIg3zlAA`
                ).then(response => response.text())
                .then(parseXML)
            }
        })
    })
})

