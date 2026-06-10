import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      service: "biometric-exam-api",
      timestamp: new Date().toISOString()
    };
  }
}
