import { IsEmail,IsNotEmpty } from "class-validator";

export class CreateCompanyDto {

  @IsNotEmpty({
    message:"Name không đúng định dạng"
  })
  name:string;

  @IsNotEmpty({
    message:"Email không được để trống"
  })
  address: string;

  @IsNotEmpty({
    message:"Description không được để trống"
  })
  description:string;

  @IsNotEmpty({
    message:"Logo không được để trống"
  })
  logo:string;
}
