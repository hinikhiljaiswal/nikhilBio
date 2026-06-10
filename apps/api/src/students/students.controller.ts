import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CreateStudentDto, StudentQueryDto, UpdateStudentDto } from "./dto";
import { StudentsService } from "./students.service";

@Controller("students")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.CenterAdmin, Role.Operator)
  list(@Query() query: StudentQueryDto) {
    return this.students.list(query);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: any) {
    return this.students.create(dto, user);
  }

  @Patch(":id")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  update(@Param("id") id: string, @Body() dto: UpdateStudentDto, @CurrentUser() user: any) {
    return this.students.update(id, dto, user);
  }

  @Delete(":id")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.students.remove(id, user);
  }

  @Post("import")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  @UseInterceptors(FileInterceptor("file"))
  importCsv(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    return this.students.importCsv(file.buffer, user);
  }
}
