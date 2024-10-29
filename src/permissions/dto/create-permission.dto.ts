import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsEmail,isNotEmpty,IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreatePermissionDto {

    @IsNotEmpty({message:'name không được để trống'})
    name:string;

    @IsNotEmpty({message:'apiPath không được để trống'})
    apiPath:string;

    @IsNotEmpty({message:'method không được để trống'})
    method:string;

    @IsNotEmpty({message:'module không được để trống'})
    module:string;
    
}
