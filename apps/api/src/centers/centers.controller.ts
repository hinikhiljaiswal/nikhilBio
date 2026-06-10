import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CentersService } from "./centers.service";
import { CreateCenterDto, UpdateCenterDto } from "./dto";

@Controller("centers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CentersController {
  constructor(private readonly centers: CentersService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  list() {
    return this.centers.list();
  }

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() dto: CreateCenterDto, @CurrentUser() user: any) {
    return this.centers.create(dto, user);
  }

  @Patch(":id")
  @Roles(Role.SuperAdmin)
  update(@Param("id") id: string, @Body() dto: UpdateCenterDto, @CurrentUser() user: any) {
    return this.centers.update(id, dto, user);
  }

  @Delete(":id")
  @Roles(Role.SuperAdmin)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.centers.remove(id, user);
  }
}
