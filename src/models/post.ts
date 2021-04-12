import { createSchema, Type, typedModel } from 'ts-mongoose';
import Comment from './comment';
import Like from './like';

/**
 * Modelo de conexión
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
    user: Type.objectId({ ref: 'User', required: true }),
    post: Type.objectId({ ref: 'Post', default: null }),
    news: Type.objectId({ default: null, required: false, ref: 'News' }),
    question: Type.objectId({ ref: 'Question', required: false }),
    message: Type.string(),
    image: Type.string(),
    video: Type.string({ default: null }),
    date: Type.date({ default: Date.now }),
    deleted: Type.boolean({ default: false }),
    edited: Type.date({ defualt: null }),
    views  :[Type.string({default: 0})]
});

const Post = typedModel('Post', schema, undefined, undefined, {
    /**
     * Crea un post
     * @param {Post} post 
     */
    create(post) {
        return new Post(post).save()
    },


    /**
     * Obtiene todos los post
     */

    findAllPost() {
        return Post
            .find({ deleted: false })
            .populate('user post news')
            .populate({ path: 'post', populate: { path: 'user news' } })
            .sort({ date: -1 })
    },


    /**
     * Obtiene los post de los amigos
     * 
     * @param {objectId[]}  friends Array de objectId de los usuarios amigos
     */

    findByFriends(friends: string[], skip) {
        return Post
            .find({ user: { $in: friends }, deleted: false })
            .populate('user post news')
            .populate({ path: 'post', populate: { path: 'user news' } })
            .sort({ date: -1 })
            .skip(skip)
            .limit(10)
    },


    /**
     * Obtiene los Posts de un usuario
     * @param user Id del usuario
     */
    findMyPosts(user, regex, skip) {

        return Post.find({ deleted: false })
            .or([
                {
                    user
                },
                {
                    message: { $regex: regex }
                }
            ])
            .populate('user post news')
            .populate({ path: 'post', populate: { path: 'user news' } })
            .sort({ date: -1 })
            .skip(skip)
            .limit(10)
    },

    /**
     * Obtiene los post de un usuario
     * 
     * @param {string} id Id del usuario  
     */

    findByUser(id) {
        return Post
            .find({ user: id, deleted: false })
            .populate('user post news')
            .populate({ path: 'post', populate: { path: 'user news' } })
            .sort({ date: -1 })
            .limit(10)
    },

    /**
     * Elimina un post 
     * @param id ID del post a eliminar
     */
    async deleteOneById(id) {
      await Like.find({post:id}).remove()
      await Comment.find({post:id}).remove()
      return Post.findByIdAndUpdate(id, { deleted: true })
    },

    updatePost(id, newValues) {
        return Post.findByIdAndUpdate(id, newValues)
    },

    findOnePost(id) {
        return Post.findById(id).populate('user post news question')
    .populate({ path: 'post', populate: { path: 'user news' } })
    .populate({path:'news',populate:{path:'user'}})
    },

    getSharedsByPost(id) {
        return Post.find({ post: id }).populate('user post news').populate({ path: 'post', populate: { path: 'user news' } }).sort({ date: -1 })
    },//esto metelo en el newsCOntroller

    getSharedsByNews(id) {
        return Post.find({ news: id }).populate('user post news').populate({ path: 'post', populate: { path: 'user news' } }).sort({ date: -1 })
    },

    getCountPostByUser(user) {
        return Post.countDocuments({ deleted: false, user })
    },

    getPostsByDate(start,end){
        let dayStart = new Date(start)
        let dayEnd = new Date(end)
        return Post.find({date:{$gte:dayStart,$lte:dayEnd},deleted:false})
    },
    getPostAllTime() {
        return Post.aggregate([
          { $match: { post: { $ne: null }, deleted: { $eq: false } } },
          {
            $group: {
              _id: "$post",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]);
      },
      getPostByTime(start, end) {
        let startTime = new Date(start);
        let endTime = new Date(end);
        return Post.aggregate([
          {
            $match: { post: { $ne: null }, deleted: { $eq: false }, date: { $gte: startTime, $lte: endTime } },
          },
          {
            $group: {
              _id: "$post",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]);
      },

      getPostViewsByTime(start, end) {
        let startTime = new Date(start);
        let endTime = new Date(end);
      return  Post.find(
        {deleted:false, date: { $gte: startTime, $lte: endTime },$where: "this.views.length >= 1" }
        )
        .sort({views:-1})
      },
      getPostViewsAllTime(){
        return Post.find({deleted:false,$where: "this.views.length >= 1"})
        .sort({views:-1})
      },
      newView(id,ip){
        return Post.findByIdAndUpdate(id,{$push:{views:ip}})//colocar en el controler el beta la ruta etc etc
      },
      findViewIp(id,ip){
        return Post.findOne({_id:id,views:{$elemMatch:{$eq:ip}}})
      }
});
/**
 * Exporta el modelo
 */
export default Post;
