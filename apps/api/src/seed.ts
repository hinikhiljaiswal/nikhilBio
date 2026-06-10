import { ConfigModule } from "@nestjs/config";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { hash } from "bcryptjs";
import { Model } from "mongoose";
import { Role } from "./common/roles";
import { User, UserSchema } from "./users/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? "mongodb://localhost:27017/biometric_exam"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ]
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const users = app.get<Model<User>>(getModelToken(User.name));
  const existing = await users.findOne({ email: "superadmin@example.com" });
  if (!existing) {
    await users.create({
      name: "Super Admin",
      email: "superadmin@example.com",
      passwordHash: await hash("ChangeMe123!", 12),
      role: Role.SuperAdmin,
      isActive: true
    });
    console.log("Seeded superadmin@example.com / ChangeMe123!");
  } else {
    console.log("Seed user already exists");
  }
  await app.close();
}

void seed();
