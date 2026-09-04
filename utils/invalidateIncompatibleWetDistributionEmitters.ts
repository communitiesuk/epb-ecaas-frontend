import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

export async function invalidateIncompatibleWetDistributionEmitters(
	state: EcaasState,
	newFuelTypes: string[],
) {
	let stateInvalidated = false;

	for (const heatEmitter of state.spaceHeating.heatEmitters.data) {
		if (heatEmitter.data.typeOfHeatEmitter !== "wetDistributionSystem") {
			continue;
		}
		if (
			!("emitters" in heatEmitter.data) ||
			!Array.isArray(heatEmitter.data.emitters)
		) {
			continue;
		}

		for (const emitter of heatEmitter.data.emitters) {
			if (
				emitter.typeOfHeatEmitter !== "fanCoil" || !emitter.productReference
			) {
				continue;
			}

			const { data: product } = await useFetch<AnyPcdbProduct>(
				`/api/products/${encodeURIComponent(emitter.productReference)}`,
			);

			if (
				product.value &&
                "fuel" in product.value &&
                product.value.fuel &&
                product.value.fuel !== "electricity" &&
                !newFuelTypes.includes(product.value.fuel)
			) {
				heatEmitter.complete = false;
				stateInvalidated = true;
				break;
			}
		}
	}

	if (stateInvalidated) {
		state.spaceHeating.heatEmitters.complete = false;
	}
}