import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Roles
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
  /**
   * nombre del role
   */
  name: Type.string({ required: true }),
  /**
   * Fecha de creacion
   */
  date: Type.date({ default: Date.now }),
  /**
   * Si el rol esta eliminado
   */
  deleted: Type.boolean({ default: false }),
  /**
   * Permisos del role
   */
  permissions: Type.mixed({ required: true }),
});

const Roles = typedModel("Roles", schema, undefined, undefined, {
  /**
   * Crear un rol con sus respectivo permiso
   * @param role
   */
  newRole(role) {
    return new Roles(role).save();
  },
  /**
   * Obtiene todos los roles
   * @returns
   */
  getRoles() {
    return Roles.find({ deleted: false }).sort({ date: -1 });
  },
  /**
   * Editar un role
   * @param id _id del role
   * @param newPermission nuevos permisos editados
   * @returns
   */
  updateRoles(id, newPermission) {
    newPermission.date = Date.now();
    return Roles.findByIdAndUpdate(id, newPermission, { new: true });
  },
  /**
   * Retorna un role por su id
   * @param id _id del role
   * @returns
   */
  getRole(id) {
    return Roles.findById(id);
  },
});

/**
 * Exporta el modelo
 */
export default Roles;
