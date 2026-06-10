import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { CreateVerificationDto } from "./dto";
import { VerificationsService } from "./verifications.service";

@Controller("verifications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationsController {
  constructor(private readonly verifications: VerificationsService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  list(@Query("limit") limit?: string) {
    return this.verifications.list(limit ? Number(limit) : 250);
  }

  @Get("summary")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  summary() {
    return this.verifications.summary();
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.CenterAdmin, Role.Operator)
  verify(@Body() dto: CreateVerificationDto, @CurrentUser() user: any) {
    return this.verifications.verify(dto, user);
  }
}
