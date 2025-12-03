import { Products } from "./pcdb.types";
import products from "./data/products.json";

describe("products file passes defined schema", () => {
	it("passes validation against the expected schema", () => {
		expect(
			() => {
				Products.parse(products);
			},
		).not.toThrowError();
	});
});