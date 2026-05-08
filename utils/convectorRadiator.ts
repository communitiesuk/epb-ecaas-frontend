import type { ConvectorRadiatorDisplayProduct, ConvectorRadiatorProduct, DisplayProduct, AnyPcdbProduct } from "~/pcdb/pcdb.types";

export function isConvectorRadiatorProduct(product: AnyPcdbProduct): product is ConvectorRadiatorProduct {
	return product.technologyType === "ConvectorRadiator";
}

export function asRadiatorDisplayProduct(product: ConvectorRadiatorProduct): DisplayProduct {
	return {
		displayProduct: true,
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
	return product.type;
}

export function getRadiatorSubtitle(product: ConvectorRadiatorProduct): string {
	const height = product.height != null ? `Height ${product.height}mm` : "";
	return height;
}
