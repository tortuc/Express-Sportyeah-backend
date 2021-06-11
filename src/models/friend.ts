import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Friend
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
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
         async  newFollower(friend){
            let exist = await Friend.findOneAndUpdate(
                { follower: friend.follower, user: friend.user, deleted: true },
                { deleted: false },
                { new: true }
              );
              
              if (exist) {
                return exist;
              } else {
                return new Friend(friend).save();
              }        
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

        /**
         * Obtiene la cantidad de seguidores y seguidos por usuario
         * @param user
        */
        async followerAndFollowingsByUser(user){
            let followers = await Friend.countDocuments({deleted:false,user})
            let followings = await Friend.countDocuments({deleted:false,follower:user})
            return {followers,followings}
        },

         /**
         * Busca al usuario con mas seguidores
         */
        mostPopularUser() {
            return Friend.aggregate([
            { $match: { deleted: false } },
            {
                $group: {
                _id: "$user",
                followers: { $sum: 1 },
                },
            },
            { $sort: { followers: -1 } },
            { $limit: 1 },
            ]);
        },

        /**
         * Busca a los usuarios mas populares
         * @param friends  // array con los objectsId de los usuarios que debe ignorar o que ya son mis amigos
         */
        mostPopularUserToAdd(friends) {
            return Friend.aggregate([
            { $match: { deleted: false, user: { $nin: friends } } },
            {
                $group: {
                _id: "$user",
                followers: { $sum: 1 },
                },
            },
            { $sort: { followers: -1 } },
            { $limit: 5 },
            ]);
        },

        
        getfollowersByTime(start, end) {
            let startTime = new Date(start);
            let endTime = new Date(end);
            return Friend.aggregate([
                { $match: { deleted: false,  date: { $gte: startTime, $lte: endTime }}  },
                {
                  $group: {
                    _id:{user:"$user"},
                    followers: { $sum: 1 },
                  },
                },
                { $sort: { followers: -1 } },
                { $limit: 5 },
              ]);
          },
/**
   * Busca a los usuarios mas populares
   * 
   */
    getfollowersAllTime() {

    return Friend.aggregate([
        { $match: { deleted: false} },
        {
          $group: {
            _id:{user:"$user"},
            followers: { $sum: 1 },
          },
        },
        { $sort: { followers: -1 } },
        { $limit: 5 },
      ]);
  },
          },

        
);

/**
 * Exporta el modelo
 */
export default Friend;
