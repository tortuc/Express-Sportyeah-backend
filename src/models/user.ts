import { createSchema, Type, typedModel } from "ts-mongoose";
import { userHelper } from "../helpers/userHelper";
import Experience from "./experience";
/**
 * Esquema de Usuario
 */
const schema = createSchema({
  /**
   * Nombre del usuario
   */
  name: Type.string({ required: true }),
  /**
   * Apellido del usuario
   */
  last_name: Type.string({ required: true }),
  /**
   * Correo electronico del usuario
   */
  email: Type.string({ required: true, unique: true }),
  /**
   * Nombre de usuario, del usuario (unico)
   */
  username: Type.string({ required: true, unique: true }),
  /**
   * Fecha de nacimiento del usuario
   */
  birth_date: Type.date({ default: null }),
  /**
   * Ultima conexion del usuario
   */
  lastConection: Type.date({ default: null }),
  /**
   * Si el usuario esta conectado
   */
  connected: Type.boolean({ default: false }),
  /**
   * Password del usuario
   */
  password: Type.string(),
  /**
   * Idioma que ha seleccionado el usuario
   */
  lang: Type.string({ default: "es" }),
  /**
   * Fecha en que se creo el usuario
   */
  create: Type.date({ default: Date.now }),
  /**
   * Role del usuario (administrador o usuario comun)
   */
  role: Type.string({ enum: ["user", "admin"], default: "user" }),
  /**
   * Si el usuario verifico su cuenta
   */
  verified: Type.boolean({ default: false }),
  /**
   * Intentos fallidos al intentar entrar en la cuenta
   */
  attempts: Type.number({ default: 0 }),
  /**
   * Imagen de perfil del usuario
   */
  photo: Type.string({
    default: "https://files.sportyeah.com/v1/image/get/1616530480396",
  }),
  /**
   * banner del usuario (portada)
   */
  photoBanner: Type.string({
    default: "https://files.sportyeah.com/v1/image/get/1620692250035.jpeg",
  }),
  /**
   * Slider (esto no puede ser asi)
   */
  slider: [
    Type.string({
      default: "https://files.sportyeah.com/v1/image/get/1620692250035.jpeg",
    }),
  ],
  /**
   * Estado del usuario, mensaje que se muestra abajo del nombre
   */
  estado: Type.string({ default: "Hey there I'm in SportYeah." }),
  /**
   * Si la cuenta fue eliminada
   */
  deleted: Type.boolean({ default: false }),
  /**
   * Token de verificacion, se usa la primera vez para verificar el usuario por un token
   */
  verification_token: Type.string({ default: null }),
  /**
   * Token para recuperar la password
   */
  recover_password_token: Type.string({ default: null }),
  /**
   * Email de los padres
   */
  parents_email: Type.string(),
  /**
   * Nombre de los padres
   */
  parents_name: Type.string(),
  /**
   * Apellido de los padres
   */
  parents_last_name: Type.string(),
  /**
   * Si el usuario es super administrador
   */
  supera: Type.boolean({ default: false }),
  /**
   * Roles de administrador
   */
  roles: Type.string(),
  /**
   * Deporte del usuario
   */
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
  /**
   * tipo de perfil del usuario
   */
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
  /**
   * Sub_profile del usuario
   */
  sub_profile: Type.string(),
  /**
   * Si fue authorizado por los padres
   */
  authorize: Type.boolean({ default: true }),
  /**
   * Si el usuario es un patrocinador, podra editar su tarjeta
   */
  sponsor_info: Type.object().of({
    name: Type.string({ default: "SportYeah" }),
    miniature: Type.string({ default: "assets/sponsors/default_mini.jpg" }),
    profile_image: Type.string({
      default: "assets/sponsors/default_profile.jpg",
    }),
  }),
  /**
   * Estructura, muchisimo menos puede ir asi
   */
  structure: Type.mixed(),
  /**
   * Pais del usuario (countryCode)
   */
  country: Type.string({ default: null }),
  /**
   * Bandera del pais, aplica para usuarios espanioles que quieran cambiar entre sus 3 banderas
   */
  flag: Type.string({
    default: null,
    enum: ["catalunya", "euskal", "andalucia", null],
  }),
  /**
   * Token del FCM para las Push Notifications
   */
  fcmtoken: Type.string({ default: null }),
  /**
   * Variable de control para saber si el usuario leyo el mensaje de el perfil
   */
  msgProfile: Type.boolean({ default: false }),
});

const User = typedModel("User", schema, undefined, undefined, {
  /**
   * Obtiene el usuario por su id
   *
   * @param {string} id   El id del usuario
   */
  async getAllUsers(skip = 0) {
    return User.find();
  },
  /**
   * Obtiene el usuario por su id
   *
   * @param {string} id   El id del usuario
   */
  async findByUserId(id: string) {
    return await User.findById(id);
  },

  /**
   * Obtiene el usuario por su email
   *
   * @param {string} email   El email del usuario
   */
  findByEmail(email: string) {
    return User.findOne({ email: email });
  },
  /**
   * Obtiene el usuario por su username
   *
   * @param {string} username   El username del usuario
   */
  findByUsername(username: string) {
    return User.findOne({ username });
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
    return User.findByIdAndUpdate(id, newData, { new: true });
  },

  listUsers() {
    return User.find();
  },

  /** Editar marcas
   *
   * @param {string }id
   * @param {User} newData
   */
  upadateSponsors(id: number, sponsors: any) {
    return User.findByIdAndUpdate(id, { sponsors });
  },

  searchQueryUsers(query: string, limit = 5, skip = 0) {
    let regex = new RegExp(query.replace(/ /g, ""), "i");

    return User.aggregate([
      {
        $project: { search: { $concat: ["$name", "$last_name", "$username"] } },
      },
      { $match: { search: { $regex: regex } } },
      { $sort: { search: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
  },
  /**
   * Busca patrocinadores por nombre, apellido o usuario
   * @param query
   * @param limit
   * @param skip
   * @returns
   */
  searchQuerySponsors(query: string, limit = 5, skip = 0) {
    let regex = new RegExp(query.replace(/ /g, ""), "i");
    console.log(regex);

    return User.aggregate([
      {
        $project: {
          search: { $concat: ["$name", "$last_name", "$username"] },
          profile_user: "$profile_user",
        },
      },
      {
        $match: { profile_user: "sponsor", search: { $regex: regex } },
      },
      { $sort: { search: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
  },
  /**
   * Retorna un conteo de la cantidad de usuarios registrados/creados en un intervalo de tiempo
   *
   * @param date Fecha desde cual consultar
   */
  getUsersByDate(date) {
    // se crea la fecha como Date
    let day = new Date(date);
    // se crea otra fecha
    let dayAfter = new Date(day);
    // se le suma un dia, para poder tener un rango de 24 horas
    dayAfter.setDate(day.getDate() + 1);

    return User.countDocuments({ create: { $gte: day, $lte: dayAfter } });
  },
  /**
   * Devuelve la cantidad de usuarios registrados o creados
   */
  countOfUsers() {
    return User.countDocuments();
  },
  /**
   * Devuelve la cantidad de usuarios conectados
   */
  countOfUsersOnlines() {
    return User.countDocuments({ connected: true });
  },
  setFCMTOken(user, fcmtoken) {
    return User.findByIdAndUpdate(user, { fcmtoken }, { new: true });
  },
  /**
   * Crea un nuevo usuario
   *
   * @param  {User}    user   El usuario a crear
   *
   * @return {User}           El usuario guardado
   * @throws {Error}          El usuario ya está registrado
   */
  async createAdmin(user: any, password) {
    // le generamos un nombre de usuario
    user.username = await userHelper.generateUsername(user);
    // le generamos un password
    user.password = password;
    // Indicamos que es un usuario tipo admin
    user.role = "admin";
    // indicamos que ya este usuario se encuentra verificado
    user.verified = true;

    user.sport = "football";
    user.profile_user = "administration";
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
      return new User(user).save();
    }
  },
  /**
   * Obtiene todos los administradores
   */
  getAdmins() {
    return User.find({ role: "admin" });
  },
});

/**
 * Exporta el modelo
 */
export default User;
