import type { ConvectorRadiatorDisplayProduct, ConvectorRadiatorProduct, DisplayProduct, Product } from "~/pcdb/pcdb.types";

export type AnyPcdbProduct = Product | ConvectorRadiatorProduct;

export function isConvectorRadiatorProduct(product: AnyPcdbProduct): product is ConvectorRadiatorProduct {
	return product.technologyType === "ConvectorRadiator";
}

export function asRadiatorDisplayProduct(product: ConvectorRadiatorProduct): DisplayProduct {
	return {
		id: `${product.ID}`,
		type: product.type,
		height: product.height,
		technologyType: product.technologyType,
	};
}

export function isConvectorRadiatorDisplayProduct(product: DisplayProduct): product is ConvectorRadiatorDisplayProduct {
	return product.technologyType === "ConvectorRadiator";
}

export function getRadiatorHeading(product: ConvectorRadiatorProduct): string {
	const height = product.height != null ? ` ${product.height} mm` : "";
	return `${product.type}${height}`;
}
