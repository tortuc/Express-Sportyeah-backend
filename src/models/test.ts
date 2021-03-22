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
    name    : Type.string({required: true}),
    vendor  : Type.string({required: true}),
    date    : Type.date({default: Date.now}),
    record  :Type.number({default: 0})
});

const Test = typedModel('Test', schema, undefined, undefined, 
    {
        /**
         * Obtiene el primer test con un nombre dado
         * 
         * @param {string} name     El nombre
         */
        findOneByName: function (name: string) {
            return this.findOne({ name : name });
        },

        /**
         * Obtiene todos los tests con un nombre dado
         * 
         * @param {string} name   El nombre
         */
        findByName: function (name: string) {
            return this.find({ name: name });
        },

        /**
         * Obtiene todos los tests de un fabircante dado
         * 
         * @param {string} vendor   El fábricante
         */
        findByVendor: function (vendor: string) {
            return this.find({ vendor: vendor });
        },
    }
);

/**
 * Exporta el modelo
 */
export default Test;
