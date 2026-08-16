import "server-only";
import { getSettings } from "../github/database";
import { ensureBootstrap } from "../github/database";

let bootstrapped: Promise<void> | null = null;

export function ensureBootstrapOnce(): Promise<void> {
  if (!bootstrapped) {
    bootstrapped = ensureBootstrap().catch((error) => {
      bootstrapped = null;
      throw error;
    });
  }
  return bootstrapped;
}
