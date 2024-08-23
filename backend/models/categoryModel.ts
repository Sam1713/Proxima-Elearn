import mongoose, { Schema } from 'mongoose'

interface CategoryType{
    _id?:mongoose.Types.ObjectId;
    categoryName:string;
    catDescription:string;
   //  isDelete?:boolean;
}

const categorySchema=new Schema<CategoryType>({
     categoryName:{
        type:String,
        required:true,
        unique:true
     },
     catDescription:{
        type:String,
        required:true,
     },
   //   isDelete:{
   //    type:Boolean,
   //    default:false
   //   }
})
const CategoryeModel = mongoose.model<CategoryType>('Category', categorySchema);

export default CategoryeModel
