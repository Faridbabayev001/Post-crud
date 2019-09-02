'use strict'

const Post = use('App/Models/Post')
const { validate } = use('Validator')

class PostController {

    async index({ request, view }) {
        const posts = await Post.all()
        return view.render('post.index', { posts: posts.toJSON() })
    }

    async store({ request, response, session }) {
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            description: 'required|min:3|max:255'
        })

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()

            return response.redirect('back')
        }

        const post = new Post()
        post.title = request.input('title')
        post.description = request.input('description')
        await post.save()

        session.flash({ notification: 'Post added!' })
        return response.redirect('back')
    }

    async destroy({ params, session, response }) {
        const post = await Post.find(params.id)
        await post.delete()

        // Fash success message to session
        session.flash({ notification: 'Post deleted!' })

        return response.redirect('back')
    }
}

module.exports = PostController
