import { createSchema, Type, typedModel } from "ts-mongoose";
import Experience from "./experience";
/**
 * Esquema de Usuario
 */
const schema = createSchema({
  name: Type.string({ required: true }),
  last_name: Type.string({ required: true }),
  email: Type.string({ required: true, unique: true }),
  username: Type.string({ required: true, unique: true }),
  birth_date: Type.date({ default: null }),
  lastConection: Type.date({ default: null }),
  connected: Type.boolean({ default: false }),
  password: Type.string(),
  create: Type.date({ default: Date.now }),
  role: Type.string({ enum: ["user", "admin"], default: "user" }),
  verified: Type.boolean({ default: false }),
  attempts: Type.number({ default: 0 }),
  photo: Type.string({
    default:
      "https://files.sportyeah.com/v1/image/get/1616530480396",
  }),
  photoBanner: Type.string({
    default:
      "https://trello-attachments.s3.amazonaws.com/5ff9d47572424648014190dc/700x422/29f3e5ed0cea0a6b7439bfb986a090cd/original.jpg",
  }),
  slider: [
    Type.string({
      default:
        "https://trello-attachments.s3.amazonaws.com/5ff9d47572424648014190dc/700x422/29f3e5ed0cea0a6b7439bfb986a090cd/original.jpg",
    }),
  ],
  experiences: [Type.objectId({ ref: Experience, default: null })],
  estado: Type.string({ default: "Hey there I'm in SportYeah." }),
  deleted: Type.boolean({ default: false }),
  verification_token: Type.string({ default: null }),
  recover_password_token: Type.string({ default: null }),
  parents_email: Type.string(),
  parents_name: Type.string(),
  parents_last_name: Type.string(),
  supera: Type.boolean({ default: false }),
  roles: Type.string(),
  sport: Type.string({
    enum: [
      "soccer",
      "basketball",
      "tennis",
      "baseball",
      "golf",
      "running",
      "volleyball",
      "swimming",
      "boxing",
      "table tennis",
      "rugby",
      "football",
      "esport",
      "various",
    ],
  }),
  profile_user: Type.string({
    enum: [
      "club",
      "player",
      "staff",
      "amateur",
      "representative",
      "scout",
      "press",
      "association",
      "foundation",
      "federation",
      "sponsor",
      "executive",
      "administration",
    ],
    default: null,
  }),
  sub_profile: Type.string(),
  authorize: Type.boolean({ default: true }),
  sponsors: [Type.mixed()],
  structure: Type.mixed(),
  geo:Type.object({ default: null }).of({
    ip : Type.string(),
    country : Type.string(),
    city : Type.string()
  }) 
});

const User = typedModel("User", schema, undefined, undefined, {
  /**
   * Obtiene el usuario por su id
   *
   * @param {string} id   El id del usuario
   */
  async findByUserId(id: string) {
    return await User.findById(id).populate({ path: "experiences" });
  },

  /**
   * Obtiene el usuario por su email
   *
   * @param {string} email   El email del usuario
   */
  findByEmail(email: string) {
    return User.findOne({ email: email }).populate({ path: "experiences" });
  },
  /**
   * Obtiene el usuario por su username
   *
   * @param {string} username   El username del usuario
   */
  findByUsername(username: string) {
    return User.findOne({ username }).populate({ path: "experiences" });
  },

  /**
   * Obtiene el usuario por el token de recuperación de contraseña
   *
   * @param {string} token    El token de recuperación de contraseña
   */
  findByRecoveryPasswordToken(token: string) {
    return User.findOne({ recover_password_token: token }).populate({
      path: "experiences",
    });
  },

  /**
   * Crea un nuevo usuario
   *
   * @param  {User}    user   El usuario a crear
   *
   * @return {User}           El usuario guardado
   * @throws {Error}          El usuario ya está registrado
   */
  async create(user: any) {
    // Comprueba si la dirección de correo suministrada ya está registrada
    let emailExist = await User.findByEmail(user.email);
    let userExist = await User.findByUsername(user.username);

    if (emailExist) {
      // El usuario ya existe
      console.warn(
        `[WARN] El usuario con el email ${user.email} ya está registrado. No se creará una nueva cuenta`
      );
      throw "email-already-exists";
    } else if (userExist) {
      console.warn(
        `[WARN] El usuario con el username ${user.username} ya está registrado. No se creará una nueva cuenta`
      );
      throw "user-already-exists";
    } else {
      // Guarda el nuevo usuario
      return user.save();
    }
  },

  /**
   * Cambia la contraseña de acceso del usuario
   *
   * @param {string} token        El token de usuario
   * @param {string} password     La contraseña cifrada
   */
  newPassword(token: string, password: string) {
    return User.findOneAndUpdate(
      { recover_password_token: token },
      {
        password: password,
        recover_password_token: null, // El token una vez usado es eliminado
      }
    );
  },

  /**
   * Envía el email para cambiar la contraseña del usuario
   *
   * @param {string} email    El email
   * @param {string} token    El token
   *
   * @return {User} user      El usuario actualizado
   */

  async forgot(email: string, token: string) {
    // Obtiene el usuario de email dado, y un token para recuperar su contraseña
    var user = await User.findOne({ email, deleted: false });

    // Si el usuario existe
    if (user) {
      // Actualiza el usuario con el token
      var user = await User.findByIdAndUpdate(user._id, {
        recover_password_token: token,
      });

      return user;
    } else {
      throw "User not found";
    }
  },

  /**
   * Verifica la cuenta de usuario
   *
   * @param {string} token El token de verificación de la cuenta
   *
   * @return {User}        El usuario de token dado
   */
  async verification(token: string) {
    let user = await User.findOneAndUpdate(
      {
        verification_token: token,
      },
      {
        verification_token: "v",
        verified: true,
      }
    );

    if (user) {
      return user;
    } else {
      throw "Invalid token";
    }
  },

  /**
   * Autentica el usuario por email y contraseña
   *
   * @param {string} email        La dirección de email
   * @param {string} password     La contraseña
   *
   * @return {user}               El usuario
   * @throws {error}              No existe el usuario con las credenciales suministradas
   */
  async auth(email: string, password: string) {
    let user = await User.findOne({ email: email }).populate({
      path: "experiences",
    });

    if (!user) {
      throw "User not found";
    }

    return user;
  },

  /**
   * Incrementa el número de intentos fallidos
   *
   * @param {User} user El usuario
   *
   * @return {number}   El número de intentos fallidos desde el inicio de sesión
   */
  async incrementAccessAttemps(user) {
    let userUpdated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { attempts: 1 } },
      { new: true }
    );

    return userUpdated.attempts;
  },

  /**
   * Reinicia el número de intentos fallidos
   *
   * @param {User} user   El usuario
   */
  resetAccessAttemps(user) {
    return User.findByIdAndUpdate(user._id, { attempts: 0 });
  },

  /**
   * Modifica un usuario
   * @param {string }id
   * @param {User} newData
   */
  updateOne(id: string, newData) {
    return User.findByIdAndUpdate(id, newData,{new:true});
  },

  listUsers() {
    return User.find().populate({ path: "experiences" });
  },

  /** Editar marcas
   *
   * @param {string }id
   * @param {User} newData
   */
  upadateSponsors(id: number, sponsors: any) {
    return User.findByIdAndUpdate(id, { sponsors });
  },
});

/**
 * Exporta el modelo
 */
export default User;
