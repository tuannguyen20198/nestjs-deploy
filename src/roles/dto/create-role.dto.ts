import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({message:'name không được để trống'})
    name:string;

    @IsNotEmpty({message:'descrition không được để trống'})
    description:string;

    
    @IsNotEmpty({message:'isActive không được để trống'})
    @IsBoolean({message:'isActive có giá trị boolean'})
    isActive:boolean;

    @IsNotEmpty({message:'permission không được để trống'})
    @IsMongoId({each:true,message:"each permisssion là mongo object id"})
    @IsArray({message:'permission có định dạng là array'})
    permissions:mongoose.Schema.Types.ObjectId[];
}
