import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { compare, hash } from "bcryptjs";
import { Model } from "mongoose";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { User } from "./user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await hash(dto.password, 12);
    const user = await this.userModel.create({ ...dto, passwordHash });
    return this.sanitize(user.toObject());
  }

  async findAll() {
    const users = await this.userModel.find().sort({ createdAt: -1 }).lean();
    return users.map((user) => this.sanitize(user));
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase(), isActive: true }).select("+passwordHash");
  }

  async validatePassword(email: string, password: string) {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return null;
    const ok = await compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async touchLogin(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
  }

  async requireById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException("User not found");
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.password) {
      update.passwordHash = await hash(dto.password, 12);
      delete update.password;
    }
    const user = await this.userModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!user) throw new NotFoundException("User not found");
    return this.sanitize(user);
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).lean();
    if (!user) throw new NotFoundException("User not found");
    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
