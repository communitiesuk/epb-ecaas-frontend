import type { UnderFloorHeatingProduct, DisplayProduct, UnderFloorHeatingDisplayProduct, AnyPcdbProduct } from "~/pcdb/pcdb.types";

export function isUnderFloorHeatingProduct(product: AnyPcdbProduct): product is UnderFloorHeatingProduct {
	return product.technologyType === "UnderFloorHeating";
}

export function asUnderFloorHeatingDisplayProduct(product: UnderFloorHeatingProduct): DisplayProduct {
	return {
		displayProduct: true,
		id: `${product.ID}`,
		systemName: product.systemName,
		floorFinishCompatibility: product.floorFinishCompatibility,
		pipeCentres: product.pipeCentres,
		technologyType: product.technologyType, 
	};
}

export function isUnderFloorHeatingDisplayProduct(product: DisplayProduct): product is UnderFloorHeatingDisplayProduct {
	return product.technologyType === "UnderFloorHeating";
}

export function getUnderFloorHeatingHeading(product: UnderFloorHeatingProduct): string {
	return product.systemName;
}

export function getUnderFloorHeatingSubtitle(product: UnderFloorHeatingProduct): string {
	return `${product.pipeCentres}mm spacing between heating pipes`;
}