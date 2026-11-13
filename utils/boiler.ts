import type { AnyPcdbProduct, BoilerProduct } from "~/pcdb/pcdb.types";

export function isBoilerProduct(product: AnyPcdbProduct): product is BoilerProduct {
	return product.technologyType === "CombiBoiler" ||
		product.technologyType === "RegularBoiler";
}