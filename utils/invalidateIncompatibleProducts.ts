import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import type { EcaasState } from "~/stores/ecaasStore.schema";

export async function invalidateIncompatibleProducts(
	state: EcaasState,
	newFuelTypes: string[],
) {
	const isFuelIncompatible = (fuel?: string) => {
		if (!fuel || fuel === "electricity") return false;
		return !newFuelTypes.includes(fuel);
	};

	let heatSourcesInvalidated = false;
	const heatSources = state.spaceHeating?.heatSource?.data ?? [];

	for (let i = 0; i < heatSources.length; i++) {
		const item = heatSources[i];
		if (!item?.complete) continue;

		const data = item.data as Record<string, unknown>;

		if (typeof data.productReference === "string" && data.productReference) {
			const { data: product } = await useFetch<AnyPcdbProduct>(
				`/api/products/${encodeURIComponent(data.productReference)}`,
			);

			if (product.value && "fuel" in product.value && isFuelIncompatible(product.value.fuel)) {
				state.spaceHeating.heatSource.data[i] = {
					...item,
					complete: false,
				};
				heatSourcesInvalidated = true;
			}
		}
	}

	if (heatSourcesInvalidated && state.spaceHeating?.heatSource) {
		state.spaceHeating.heatSource.complete = false;
	}

	let heatEmittersInvalidated = false;
	const heatEmitters = state.spaceHeating?.heatEmitters?.data ?? [];

	for (let i = 0; i < heatEmitters.length; i++) {
		const item = heatEmitters[i];
		if (!item?.complete) continue;

		const data = item.data as Record<string, unknown>;
		let itemNeedsInvalidation = false;

		if (data.typeOfHeatEmitter === "electricStorageHeater" && typeof data.productReference === "string") {
			const { data: product } = await useFetch<AnyPcdbProduct>(
				`/api/products/${encodeURIComponent(data.productReference)}`,
			);

			if (product.value && "fuel" in product.value && isFuelIncompatible(product.value.fuel)) {
				itemNeedsInvalidation = true;
			}
		}

		if (data.typeOfHeatEmitter === "wetDistributionSystem" && Array.isArray(data.emitters)) {
			for (const emitter of data.emitters) {
				if (emitter.typeOfHeatEmitter === "fanCoil" && emitter.productReference) {
					const { data: product } = await useFetch<AnyPcdbProduct>(
						`/api/products/${encodeURIComponent(emitter.productReference)}`,
					);

					if (product.value && "fuel" in product.value && isFuelIncompatible(product.value.fuel)) {
						itemNeedsInvalidation = true;
						break;
					}
				}
			}
		}

		if (itemNeedsInvalidation) {
			state.spaceHeating.heatEmitters.data[i] = {
				...item,
				complete: false,
			};
			heatEmittersInvalidated = true;
		}
	}

	if (heatEmittersInvalidated && state.spaceHeating?.heatEmitters) {
		state.spaceHeating.heatEmitters.complete = false;
	}
}