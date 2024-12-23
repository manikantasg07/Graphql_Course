import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './_db.js';



const resolvers={
    Query:{
        games(){
            return db.games
        },
        reviews(){
            return db.reviews
        },
        authors(){
            return db.authors
        },
        review(parent,args,context){

            return db.reviews.find((review)=>{ return review.id==args.id})
        },
        game(parent,args,context){

            return db.games.find((game)=>{ return game.id==args.id})
        },
        author(parent,args,context){

            return db.authors.find((author)=>{ return author.id==args.id})
        },
    },
    Game:{
        reviews(parent){
            return db.reviews.filter((r)=>r.game_id===parent.id)
        }
    },
    Author:{
        reviews(parent){
            return db.reviews.filter((r)=>r.author_id===parent.id)
        }
    },
    Review:{
        game(parent){
            return db.games.find((game)=>parent.game_id===game.id)
        },
        author(parent){
            return db.authors.find((author)=> author.id===parent.author_id)
        }
    },
    Mutation:{
        deletegame(parent,args){
            return db.games.filter((g)=> g.id!==args.id)
        },
        addGame(parent,args){
            let game={
                ...args.game,
                id:Math.floor(Math.random()*10000).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(parent,args){
            db.games=db.games.map((g)=>{
                if(g.id===args.id){
                    return {...g,...args.edits}
                }
                return g;
            })
            return db.games.find((g)=>g.id===args.id)
        }
    }
}


const server = new ApolloServer({
    //typeDefs
    typeDefs,
    //resolvers
    resolvers


})

const {url} = await startStandaloneServer(server,{
    listen:{port:4000}
})

console.log("Server ready at port: ",4000);
