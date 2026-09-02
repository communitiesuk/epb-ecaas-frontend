import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

export async function invalidateIncompatibleWetDistributionEmitters(
	state: EcaasState,
	newFuelTypes: string[],
) {
	for (const heatEmitter of state.spaceHeating.heatEmitters.data) {
		if (heatEmitter.data.typeOfHeatEmitter !== "wetDistributionSystem") {
			continue;
		}

		if (!heatEmitter.complete) {
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
				const heatEmitterForm = heatEmitter as {
					data: WetDistributionSystemData;
					complete?: boolean;
				};

				heatEmitterForm.complete = false;
				break;
			}
		}
	}
}