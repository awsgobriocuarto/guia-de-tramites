"use client";
import { useRouter } from "next/navigation";

export default function LinkToBack({ variant = "btn-primary" }) {
  const router = useRouter();
  return (
    <button className={`btn ${variant}`} type="button" onClick={router.back}>
      Volver
    </button>
  );
}
