import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CreateExamDto, UpdateExamDto } from "./dto";
import { ExamsService } from "./exams.service";

@Controller("exams")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.CenterAdmin, Role.Operator)
  list() {
    return this.exams.list();
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  create(@Body() dto: CreateExamDto, @CurrentUser() user: any) {
    return this.exams.create(dto, user);
  }

  @Patch(":id")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  update(@Param("id") id: string, @Body() dto: UpdateExamDto, @CurrentUser() user: any) {
    return this.exams.update(id, dto, user);
  }

  @Delete(":id")
  @Roles(Role.SuperAdmin)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.exams.remove(id, user);
  }
}
