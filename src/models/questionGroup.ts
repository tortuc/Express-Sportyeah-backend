import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de tests
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
    question        : Type.objectId({ref: 'Question',required:true}),
    questionHeadline: Type.string(),
});

const QuestionGroup = typedModel('QuestionGroup', schema, undefined, undefined, 
    {
     
        /*
         * Obtiene todos los questionGroup con un nombre dado
         * 
         * @param  question Id de question
         * @param  questionHeadline Pregunta
         */
        create(question,questionHeadline) {
            return new QuestionGroup({question,questionHeadline}).save()
        },


        /**
         * Elimina un QuestionGroup 
         * @param id ID del QuestionGroup a eliminar
         */
        deleteOneById(id){
            return QuestionGroup.findByIdAndUpdate(id,{deleted:true})
        },

        findByQuestion(id){
            return QuestionGroup.findOne({question:id})
        }
        },
    
);

/**
 * Exporta el modelo
 */
export default QuestionGroup;
