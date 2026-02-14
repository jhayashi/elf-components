import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Settings() {
  const router = useRouter();
  useEffect(() => {
    void router.replace("/settings/preferences");
  }, [router]);
  return null;
}
