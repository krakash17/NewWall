const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const {UserInputError, AuthenticationError} = require('apollo-server')

module.exports = {

    Mutation:{
        async createComment(_,{postId,body},context){
            const { username } = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty Error',{
                    errors: {
                        body: 'Comment body must not empty'
                    }
                });
            }

            try{
                const post = await Post.findById(postId);
                if(post){
                    post.comments.unshift({
                        body,
                        username,
                        createdAt: new Date().toISOString()
                    });
                    await post.save();
                    return post;

                }
                else throw new UserInputError('post not Found');
            }
            catch(err){
                throw new Error(err);
            }
        },

        async deleteComment(_,{postId,commentId},context){

            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
                

                if(post){
                    const commentIndex = post.comments.findIndex(c => c.id === commentId);
                    if(post.comments[commentIndex].username === username){
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    }

                    else{
                        throw new AuthenticationError('Action not allowed')
                    }
                }
                else throw new UserInputError('Post not found');
           
        }
    }

}