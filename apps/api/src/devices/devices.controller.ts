import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { Role } from "../common/roles";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { DevicesService } from "./devices.service";
import { DeviceHeartbeatDto, RegisterDeviceDto, UpdateDeviceDto } from "./dto";

@Controller("devices")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DevicesController {
  constructor(private readonly devices: DevicesService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  list() {
    return this.devices.list();
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  register(@Body() dto: RegisterDeviceDto, @CurrentUser() user: any) {
    return this.devices.register(dto, user);
  }

  @Patch(":id")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  update(@Param("id") id: string, @Body() dto: UpdateDeviceDto, @CurrentUser() user: any) {
    return this.devices.update(id, dto, user);
  }

  @Delete(":id")
  @Roles(Role.SuperAdmin, Role.CenterAdmin)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.devices.remove(id, user);
  }

  @Patch(":serialNumber/heartbeat")
  @Roles(Role.SuperAdmin, Role.CenterAdmin, Role.Operator)
  heartbeat(@Param("serialNumber") serialNumber: string, @Body() dto: DeviceHeartbeatDto) {
    return this.devices.heartbeat(serialNumber, dto);
  }
}
