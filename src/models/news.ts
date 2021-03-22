import { createSchema, Type, typedModel } from 'ts-mongoose';

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
    user    : Type.objectId({ref: 'User',required:true}),
    //news    : Type.objectId({ref:'News', default:null}),
    headline: Type.string(),
    content : Type.array().of({
        subtitle    : Type.string({}),
        parrafo     : Type.string({required:true}),
        position    : Type.number({ required:true }),
        image       : Type.string({required:false}),
        video       : Type.string({default:null}),
        originMedia : Type.string({default:null})
        //streaming:
    }),
    principalSubtitle:Type.string(),
    principalImage:Type.string(),
    principalVideo:Type.string(),
    originPrincipaMedia : Type.string({default:null}),
    origin:Type.string({default:null}),
    sport   : Type.string({required:true,enum:['soccer', 'basketball','tennis',
    'baseball','golf','running','volleyball','swimming','boxing','table tennis','rugby','football','esport','various']})  ,   
    stream  : Type.boolean({default:false}),
    postStream : Type.string({required:false}),
    date    : Type.date({default:Date.now}),
    deleted : Type.boolean({default:false}),
    edited  : Type.date({defualt:null})
});

const News = typedModel('News', schema, undefined, undefined, {
    /**
     * Crea un news
     * @param {News} news  
     *  
     */
    create(news){
        return new News(news).save()
    },

    findNews(){
        return News
            .find({deleted:false})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },

    findOneNews(id){
        return News.findById(id).populate('user')
    },


    /**
     * Obtiene los News de un deporte
     * 
     * @param sport deporte
     */

    findBySport(sport){
        return News
            .find({sport,deleted:false})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },
    /**
     * Obtiene los News de un usuario
     * @param user Id del usuario
     */
    findMyNewss(user){
        
        return News.find({user,deleted:false})
        .populate('user')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },

    updateNews(id,newValues){
        return News.findByIdAndUpdate(id,newValues)
    },

    /**
     * Elimina un News 
     * @param id ID del News a eliminar
     */
    deleteOneById(id){
        return News.findByIdAndUpdate(id,{deleted:true})
    },

    /* getCountNewsByUser(user){
        return News.countDocuments({deleted:false,user})
    } */

    getSharedsByNews(id){
        return News.find({news:id}).populate('user news').populate({path:'news',populate:{path:'user'}}).sort({date:-1})
    },

});

/**
 * Exporta el modelo
 */
export default News;
