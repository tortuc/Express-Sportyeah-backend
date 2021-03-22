import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Friend
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
    follower    : Type.objectId({required: true,ref:'User'}),
    user        : Type.objectId({required: true,ref:'User'}),
    date        : Type.date({default: Date.now}),
    deleted     : Type.boolean({default:false})
});

const Friend = typedModel('Friend', schema, undefined, undefined, 
    {
        /**
         * Crea un nuevo seguidor
         * @param {Friend} friend 
         */
        newFollower(friend){
            return new Friend(friend).save()
        },
        /**
         * dejar de seguir a un usuario
         * @param {string} id 
         */
        unFollow(id){
            return Friend.findByIdAndUpdate(id,{deleted:true})
        },
        /**
         * Obtiene los seguidores por usuario
         * 
         * @param {string} user     El nombre
         */
        findFollowers(user){
            return Friend.find({user,deleted:false}).select('follower _id').populate("follower")
        },
        /**
         * Obtiene los id de los seguidores por usaurio
         * @param {string} user 
         */
        findFollowersOnlyId(user){
            return Friend.find({user,deleted:false}).select('follower _id')
        },
        /**
         * Obtiene los usuario que un usuario sigue
         * 
         * @param {string} follower  id del usuario
         */
        findFollowing(follower){
            return Friend.find({follower,deleted:false}).select('user _id').populate("user")
        },
        /**
         * Obtiene los id de los seguidores por usaurio
         * @param {string} follower 
         */
        findFollowingOnlyId(follower){
            return Friend.find({follower,deleted:false}).select('user _id')
        },
        async followerAndFollowingsByUser(user){
            let followers = await Friend.countDocuments({deleted:false,user})
            let followings = await Friend.countDocuments({deleted:false,follower:user})
            return {followers,followings}
        }
    }
);

/**
 * Exporta el modelo
 */
export default Friend;
