import { Injectable } from "@nestjs/common";

@Injectable()
export class AadhaarProvider {
  async verify(input: { enabled?: boolean; aadhaarLast4?: string }) {
    if (!input.enabled) return { attempted: false, passed: true };
    return {
      attempted: true,
      passed: Boolean(input.aadhaarLast4 && /^\d{4}$/.test(input.aadhaarLast4)),
      providerReference: `aadhaar-stub-${Date.now()}`
    };
  }
}
