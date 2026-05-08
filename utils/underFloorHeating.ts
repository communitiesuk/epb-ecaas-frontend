import type { UnderFloorHeatingProduct, DisplayProduct, UnderFloorHeatingDisplayProduct, AnyPcdbProduct } from "~/pcdb/pcdb.types";

export function isUnderfloorHeatingProduct(product: AnyPcdbProduct): product is UnderFloorHeatingProduct {
	return product.technologyType === "UnderFloorHeating";
}

export function asUnderfloorHeatingDisplayProduct(product: UnderFloorHeatingProduct): DisplayProduct {
	return {
		displayProduct: true,
		id: `${product.ID}`,
		systemName: product.systemName,
		floorFinishCompatibility: product.floorFinishCompatibility,
		pipeCentres: product.pipeCentres,
		technologyType: product.technologyType, 
	};
}

export function isUnderfloorHeatingDisplayProduct(product: DisplayProduct): product is UnderFloorHeatingDisplayProduct {
	return product.technologyType === "UnderFloorHeating";
}

export function getUnderfloorHeatingHeading(product: UnderFloorHeatingProduct): string {
	return product.systemName;
}

export function getUnderfloorHeatingSubtitle(product: UnderFloorHeatingProduct): string {
	return `${product.pipeCentres}mm spacing between heating pipes`;
}