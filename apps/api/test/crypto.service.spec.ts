import { ConfigService } from "@nestjs/config";
import { CryptoService } from "../src/common/crypto.service";

describe("CryptoService", () => {
  const service = new CryptoService({
    get: () => "test-secret"
  } as unknown as ConfigService);

  it("masks Aadhaar and round-trips encrypted values", () => {
    const encrypted = service.encrypt("123456789012");
    expect(encrypted).not.toContain("123456789012");
    expect(service.decrypt(encrypted)).toBe("123456789012");
    expect(service.maskAadhaar("123456789012")).toBe("XXXX-XXXX-9012");
  });

  it("hashes Aadhaar deterministically", () => {
    expect(service.hash("1234 5678 9012")).toBe(service.hash("123456789012"));
  });
});
