import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuditService } from "../audit/audit.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
    private readonly config: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.validatePassword(dto.email, dto.password);
    if (!user) {
      await this.audit.record("AUTH_LOGIN_FAILED", { email: dto.email });
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.users.touchLogin(user.id);
    await this.audit.record("AUTH_LOGIN_SUCCESS", { userId: user.id, email: user.email });
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      centerId: user.centerId?.toString()
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      expiresIn: this.config.get<string>("JWT_EXPIRES_IN", "8h"),
      user: payload
    };
  }
}
