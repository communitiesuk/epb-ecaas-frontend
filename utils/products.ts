import type { PcdbPackagedProduct } from "#imports";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import type { HasPcdbPackagedProduct } from "~/stores/ecaasStore.schema";

export function hasModelDetails(
	product: AnyPcdbProduct,
): product is Extract<AnyPcdbProduct, { modelName: string; brandName: string; modelQualifier?: string | null }> {
	return !!product && "modelName" in product && "brandName" in product;
}

export function hasPackagedProduct(model: object | undefined): model is HasPcdbPackagedProduct {
	return model !== undefined &&
		"packagedProductReference" in model &&
		!!model.packagedProductReference;
}

export function isPackagedProduct(model: object | undefined): model is PcdbPackagedProduct {
	return model !== undefined &&
		"packageProductIds" in model &&
		Array.isArray(model.packageProductIds) &&
		model.packageProductIds.length > 0;
};