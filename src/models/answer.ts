import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de tests
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
    questionGroup:Type.objectId({ref: 'QuestionGroup',required:true}),
    option    : Type.string({ required:true }),
    users   :  [Type.objectId({ref: 'User',required:true})],
    position : Type.number({ required:true }),
});

const Answer = typedModel('Answer', schema, undefined, undefined, 
    {
     
        /**
         * Obtiene todos los answers con un nombre dado
         * 
         * @param  answer   El nombre
         */
        create(questionGroup,option,position) {
            return new Answer({questionGroup,option,position}).save()
        },

        /**
         * Sa ber si alguin voto 
         * 
         * @param  id  id del answer
         *  @param user  id del user
         */
        userVoted(id,user){
            return Answer.findOne( { questionGroup:id, users: { $elemMatch: { $eq: user } } })
        },

        /**
         * Elimina un answers 
         * @param id ID del answers a eliminar
         */
        deleteOneById(id){
            return Answer.findByIdAndUpdate(id,{deleted:true})
        },
        findByQuestionGroup(id){
            return Answer.find({questionGroup:id}).populate('users.user')
        },
        newUser(id,user){
            return Answer.findByIdAndUpdate(id,{$push:{users:user}})
        }
        },
    
);


/**
 * Exporta el modelo
 */
export default Answer;
