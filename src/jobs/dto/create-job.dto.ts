import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsEmail,IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id:mongoose.Schema.Types.ObjectId;
  
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    logo:string;
}
export class CreateJobDto {

  @IsNotEmpty({
    message:"Name không đúng định dạng"
  })
  name:string;

  @IsNotEmpty({
    message:"Skills không được để trống"
  })
  @IsNotEmpty({
    message: "Skills không được để trống"
  })
  @IsArray({
    message: "Skills không đúng định dạng"
  })
  @ArrayNotEmpty({
    message: "Skills không được để trống"
  })
  @IsString({ each: true, message: "Skills phải là chuỗi" })
  skills: string[];

  @IsNotEmpty({
    message: "Skills không được để trống"
  })
  location:string;
  
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() =>Company)
  company!:Company

  @IsNotEmpty({
    message:"Salary không được để trống"
  })
  salary: number;

  @IsNotEmpty({
    message:"Quantity không được để trống"
  })
  quantity: number;

  @IsNotEmpty({
    message:"Level không được để trống"
  })
  level: string;

  @IsNotEmpty({
    message:"Description không được để trống"
  })
  description: string;

  @IsNotEmpty({
    message: "StartDate không được để trống"
  })
  @IsDateString({}, {
    message: "StartDate không đúng định dạng, phải là chuỗi ISO"
  })
  startDate: Date;

  @IsNotEmpty({
    message: "EndDate không được để trống"
  })
  @IsDateString({}, {
    message: "EndDate không đúng định dạng, phải là chuỗi ISO"
  })
  endDate: Date;

  isActive: boolean;

}
