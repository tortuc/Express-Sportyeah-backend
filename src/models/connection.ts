import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de conexión
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
    user    : Type.objectId({ref: 'User'}),
    ip      : Type.string(),
    country : Type.string(),
    city    : Type.string(),
    date    : Type.date({default:Date.now})
});

const Connection = typedModel('Connection', schema, undefined, undefined, {

    /**
     * Guarda una conexión
     * 
     * @param {Connection} connection    Una conexión 
     */
    create(connection)
    {
        let newConnection = new Connection(connection)
        return  newConnection.save()
    },
    /**
     * obtiene una cantidad de conexiones
     * @param {string} user 
     * @param {number} limit 
     */
    async getConnections(user,limit){

        return await Connection.find({ user })
            .limit(limit)
            .populate('user')
            .sort({ date: -1 })
    },
    diferentIp(geo){
        return Connection.getConnections(geo.user,3)
        .then((connections) => {
            let different = 0
            connections.forEach((connection, i, arr) => {
                if (connection.ip != geo.ip) 
                {
                    different += 1
                }

                if (i == arr.length - 1) 
                {                                  
                    if (different == 3) 
                    {
                        throw 'ip uknkow'
                    }
                }

            })
        })
    }


});

/**
 * Exporta el modelo
 */
export default Connection;
