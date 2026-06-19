import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

export default function DemoOne() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <ParticleTextEffect />
    </div>
  );
}
