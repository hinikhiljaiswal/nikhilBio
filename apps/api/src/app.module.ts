import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AlertsModule } from "./alerts/alerts.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { CentersModule } from "./centers/centers.module";
import { DevicesModule } from "./devices/devices.module";
import { ExamsModule } from "./exams/exams.module";
import { HealthModule } from "./health/health.module";
import { ReportsModule } from "./reports/reports.module";
import { StudentsModule } from "./students/students.module";
import { UsersModule } from "./users/users.module";
import { VerificationsModule } from "./verifications/verifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>("MONGODB_URI")
      })
    }),
    AuditModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    CentersModule,
    ExamsModule,
    DevicesModule,
    VerificationsModule,
    AlertsModule,
    ReportsModule,
    HealthModule
  ]
})
export class AppModule {}
