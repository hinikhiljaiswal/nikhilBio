import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditService } from "../audit/audit.service";
import { DeviceStatus } from "../common/roles";
import { Device } from "./device.schema";
import { DeviceHeartbeatDto, RegisterDeviceDto, UpdateDeviceDto } from "./dto";

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
    private readonly audit: AuditService
  ) {}

  async register(dto: RegisterDeviceDto, actor?: any) {
    const device = await this.deviceModel.create(dto);
    await this.audit.record("DEVICE_REGISTERED", { deviceId: device.id, serialNumber: dto.serialNumber }, actor);
    return device;
  }

  list() {
    return this.deviceModel.find().sort({ updatedAt: -1 }).lean();
  }

  async heartbeat(serialNumber: string, dto: DeviceHeartbeatDto) {
    const device = await this.deviceModel.findOneAndUpdate(
      { serialNumber },
      { status: dto.status, lastSeenAt: new Date() },
      { new: true }
    );
    if (!device) throw new NotFoundException("Device not found");
    if (dto.status === DeviceStatus.Offline) {
      await this.audit.record("DEVICE_OFFLINE", { serialNumber });
    }
    return device;
  }

  async update(id: string, dto: UpdateDeviceDto, actor?: any) {
    const device = await this.deviceModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!device) throw new NotFoundException("Device not found");
    await this.audit.record("DEVICE_UPDATED", { deviceId: id, serialNumber: device.serialNumber }, actor);
    return device;
  }

  async remove(id: string, actor?: any) {
    const device = await this.deviceModel.findByIdAndDelete(id).lean();
    if (!device) throw new NotFoundException("Device not found");
    await this.audit.record("DEVICE_DELETED", { deviceId: id, serialNumber: device.serialNumber }, actor);
    return device;
  }
}
