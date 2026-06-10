import { Injectable } from "@nestjs/common";

export type BiometricMatchInput = {
  modality: "FINGERPRINT" | "IRIS" | "FACE";
  capturedTemplate: string;
  studentId: string;
};

@Injectable()
export class BiometricProvider {
  async match(input: BiometricMatchInput) {
    const normalized = input.capturedTemplate.trim();
    return {
      matched: normalized.length >= 12 && !normalized.toLowerCase().includes("fail"),
      score: Math.min(99, Math.max(35, normalized.length * 3)),
      providerReference: `stub-${input.modality.toLowerCase()}-${Date.now()}`
    };
  }
}
