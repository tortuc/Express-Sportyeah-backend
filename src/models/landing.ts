import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Experiences
 *
 * @author David Valor  <davidvalorwork@gmail.com>
 * @copyright Sapviremoto
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Interface Landing
 *
 */
interface ILanding {
  _id: string;
  username: string; 
  banner: string; 
  logo: string; 
  title: string; 
  description: string;
  button: string;
  divider: string;
  dividerImg: string;
  ptitle:string;
  psubtitle: string;
  stitle:string;
  ssubtitle:string;
  s1title:string;
  s1description:string;
  s1iconName:string;
  s2title:string;
  s2description:string;
  s2iconName:string;
  s3title:string;
  s3description:string;
  s3iconName:string;
  products:any[];
  twitter:string;
  facebook:string;
  instagram:string;
  linkedin: string;
  tiktok: string;
  copyright: string;
  active:boolean;
}
/**
 * Esquema de Usuario
 */
const schema = createSchema({
  username: Type.string({required: true}),
  banner:Type.string({ required: true }),
  logo:Type.string({ required: true }),
  title:Type.string({ required: true }),
  description:Type.string({ required: true }), 
  button:Type.string({ required: true }), 
  divider:Type.string({ required: true }), 
  dividerImg:Type.string({ required: true }), 
  ptitle:Type.string({ required: true }),
  psubtitle:Type.string({ required: true }), 
  stitle:Type.string({ required: true }),
  ssubtitle:Type.string({ required: true }),
  s1title:Type.string({ required: true }),
  s1description:Type.string({ required: true }),
  s1iconName:Type.string({ required: true }),
  s2title:Type.string({ required: true }),
  s2description:Type.string({ required: true }),
  s2iconName:Type.string({ required: true }),
  s3title:Type.string({ required: true }),
  s3description:Type.string({ required: true }),
  s3iconName:Type.string({ required: true }),
  products: [Type.mixed()],
  twitter:Type.string({ required: true }),
  facebook:Type.string({ required: true }),
  instagram:Type.string({ required: true }),
  tiktok:Type.string({ required: true }),
  linkedin:Type.string({ required: true }),
  copyright:Type.string(),
  active: Type.boolean()
});



const Landing = typedModel('Landing', schema, undefined, undefined, {
    /**
     * Obtiene la landing por el id del usuario 
     * 
     * @param {string} idUser   El id del usuario 
     */
    async findByLandingId(username:string)
    {
        return await Landing.findOne({username});
    },
    /**
     * Crea una nueva landing  
     *   
     * @param  {Landing}  landing  La landing a crear 
     * @return {Landing}           La landing guardada
     */
    async create(landing:any):Promise<any>
    {
      return await new Landing(landing).save();
    },
    /**
     * Modifica la landing  
     * @param {string}  Landing ID 
     * @param {Landing} newData 
     */
    async updateOne(id:string,newData:any):Promise<any>{
        return await Landing.findByIdAndUpdate(id,newData,{new:true});
    },
});

/**
 * Exporta el modelo
 */
export default Landing;
