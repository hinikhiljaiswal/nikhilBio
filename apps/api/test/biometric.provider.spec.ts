import { BiometricProvider } from "../src/verifications/biometric.provider";

describe("BiometricProvider", () => {
  it("accepts plausible captured templates", async () => {
    const provider = new BiometricProvider();
    const result = await provider.match({
      modality: "FINGERPRINT",
      capturedTemplate: "template-value-12345",
      studentId: "student"
    });

    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(60);
  });

  it("rejects explicit failure templates", async () => {
    const provider = new BiometricProvider();
    const result = await provider.match({
      modality: "FACE",
      capturedTemplate: "fail-template-value",
      studentId: "student"
    });

    expect(result.matched).toBe(false);
  });
});
