import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { compareSync } from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) 
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel:SoftDeleteModel<RoleDocument>
    
  ) {}
  getHashPassword = (password)=>{
    return hashSync(password,genSaltSync(10));
  }

  async create(createUserDto:CreateUserDto,@User() user:IUser){
    const {name,email,password,age,gender,address,role,company} = createUserDto;
    const hashPassword = await this.getHashPassword(password)

    const isExist = await this.userModel.findOne({email});
    if (isExist) {
      throw new BadRequestException(`Email:${email} đã tồn tại trên hệ thống.Vui lòng đăng nhập email khác`)
    }
    const newUser = this.userModel.create({
      name,email,
      password:hashPassword,
      age,
      gender,address,role,company,
      createdBy:{
        _id:user._id,
        email:user.email
      }
    })
    return newUser
  }

  async findAll(currentPage :number,limit:number,qs:string) {
    const { filter, sort, population } = aqp(qs);
    
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .select('-password')
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentPage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
  }

  async findOne(id: string) {
      if (!mongoose.Types.ObjectId.isValid(id)) 
        return `not found user`
      return await this.userModel.findOne({
        _id:id
      })
      .select("-password")
      .populate({path:"role",select: { name:1, _id: 1}});
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email:username
    }).populate({path: "role",select:{name:1}});
  }

  isValidPassword(password,hashPassword){
    return compareSync(password,hashPassword);
  }
  async update(updateUserDto: UpdateUserDto, @User() user:IUser) {
    const updated= await this.userModel.updateOne(
      {_id:updateUserDto._id},
      {
        ...updateUserDto,
        updatedBy:{
          _id:user._id,
          email:user.email
        }
      }
    );
    return updated
  }

  async remove(id: string,@User() user:IUser) {
    
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`

    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "admin@gmail.com") {
      throw new BadRequestException("Không thể tài khoản admin@gmail.com")
    }
    await this.userModel.updateOne(
      {_id:id},
      {
        deletedBy:{
          _id:user._id,
          email:user.email
        }
      }
    )
    return this.userModel.softDelete({
      _id:id
    })
  }
  
  async register(user:RegisterUserDto){
    const {name,email,password,age,gender,address} = user;
    const hashPassword = await this.getHashPassword(password);
    const isExist = await this.userModel.findOne({email});
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại.Vui lòng đăng ký tài khoản khác`);
    }

    //fetch user role 
    const userRole = await this.roleModel.findOne({name:USER_ROLE})
    const newUser = await this.userModel.create({
      name,
      email,
      password:hashPassword,
      age,
      gender,
      address,
      role:userRole?._id
    })
    return newUser
  }
  updateUserToken =async (refreshToken:string,_id:string) => {
    return await this.userModel.updateOne(
      {_id},
      {
        refreshToken
      }
    )
  }
  findUserByToken =async (refreshToken:string) => {
    return await this.userModel.findOne({refreshToken})
    .populate({
      path:"role",
      select:{name:1}
    })
  }
}
