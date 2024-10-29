import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("jobs")
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create a new job")
  
  create( @Body()  createJobDto:CreateJobDto, @User() user:IUser) 
  {
    return this.jobsService.create(createJobDto,user)
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch jobs with paginate")
  findAll(
    @Query("current")  currentPage:string,
    @Query("pageSize")  limit:string,
    @Query()  qs:string,
  ) {
    return this.jobsService.findAll(+currentPage,+limit,qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a new job")
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto,@User() user:IUser) {
    return this.jobsService.update(id, updateJobDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a new job")
  remove(@Param('id') id: string,@User() user:IUser) {
    return this.jobsService.remove(id,user);
  }
}
