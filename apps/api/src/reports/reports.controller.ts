import { Controller, Get, Header, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { ReportsService } from "./reports.service";

@Controller("reports")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get("dashboard")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  dashboard() {
    return this.reports.dashboard();
  }

  @Get("verifications.csv")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", "attachment; filename=verifications.csv")
  exportVerifications(@CurrentUser() user: any) {
    return this.reports.exportVerifications(user);
  }
}
