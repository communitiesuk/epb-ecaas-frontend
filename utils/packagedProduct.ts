import type { PcdbPackagedProduct } from "#imports";
import type { HasPcdbPackagedProduct } from "~/stores/ecaasStore.schema";

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