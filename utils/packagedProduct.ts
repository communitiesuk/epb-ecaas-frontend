import type { PcdbPackagedProduct } from "#imports";
import type { HasPcdbPackagedProduct } from "~/stores/ecaasStore.schema";

export function hasPackagedProduct(model: object): model is HasPcdbPackagedProduct {
	return model !== undefined &&
		"packagedProductReference" in model &&
		!!model.packagedProductReference;
}

export function isPackagedProduct(model: object): model is PcdbPackagedProduct {
	return model !== undefined &&
		"packageProducts" in model &&
		Array.isArray(model.packageProducts) &&
		!!model.packageProducts.length;
};