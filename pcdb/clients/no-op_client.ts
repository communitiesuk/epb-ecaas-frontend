import type { TechnologyType } from "../pcdb.types";
import type { Command, Client } from "./client.types";
import products from "@/pcdb/data/products.json";

export const noopClient: Client = async <
  T extends TechnologyType,
  U extends Command<T>
>(
  query: U["input"]
): Promise<U["output"]> => {
  // Return sensible no-op values per command type
  if ("id" in query && "technologyType" in query) {
    // fullProductById → ProductForTechnology<T> | undefined
    return undefined as U["output"];
  }
  if ("id" in query) {
    // displayById → DisplayProduct | undefined
    return undefined as U["output"];
  }
  if ("startsWith" in query && "technologyType" in query) {
    // brandsStartingWith → string[]
    return [] as U["output"];
  }
  if ("startsWith" in query) {
    // modelsStartingWith → string[]
    return [] as U["output"];
  }
  if ("technologyType" in query) {
    return products as U["output"] ?? [];
  }

  return undefined as U["output"];
};
