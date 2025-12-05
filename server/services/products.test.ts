import { productsInCategory } from "./products";
import products from "@/pcdb/data/products.json";

describe("product service", () => {
  it("returns all products for given category", async () => {
    const result = await productsInCategory("heatPump");

    expect(result).toBeDefined();
    expect(result).toEqual(products);
  });
});
