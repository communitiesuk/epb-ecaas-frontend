import products, { Products } from "./products";

describe("products file passes defined schema", () => {
	it("passes validation against the expected schema", () => {
		expect(
			() => {
				Products.parse(products);
			},
		).not.toThrowError();
	});
});