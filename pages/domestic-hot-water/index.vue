<script setup lang="ts">
import { isEcaasForm } from '#imports';
import formStatus from '~/constants/formStatus';

	const title = "Domestic Hot Water";

	const page = usePage();
	const store = useEcaasStore();

	const hwCylinder1: EcaasForm<HotWaterCylinderData> = {
		data: {
			name: "Jasper's Cylinder",
			id: "what",
			heatSource: "weeeeee",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres",
			},
			dailyEnergyLoss: 69,
		},
	};

	store.$patch({
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: {
					complete: true,
					data: [hwCylinder1],
				},
			},
		},
	});
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<CustomList 
		id="heatSources"
		title="Heat Sources"
		:form-url="`${page?.url!}/heat-sources`"
		:items="Object.values(store.domesticHotWater.waterHeating)
			.map(x=>x.data)
			.flat()
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"

		:show-status="true"
	/>
</template>


		<!-- :items="Object.values(store.domesticHotWater.waterHeating).map(x=>x.data).map(data => {
				if (!data) {
					return null;
				}
				if (!data[0]) {
					return null
				}
				if (Object.keys(data[0]).includes('data')) {
					return data.map(item => {
						(item as {'complete': boolean, 'data': {'name': string}}).data
					})
				};
				return data as {'name': string}[];
			}).flat().filter(x => x !== null && typeof x !== 'undefined').map(x => ({
				name: x?.name,
				status: formStatus.complete
			}))" -->

<!--

export type WaterHeating = AssertFormKeysArePageIds<{

	hotWaterCylinder: EcaasFormList<HotWaterCylinderData>;

	{
		complete:
		data: T
	}[]


	immersionHeater: EcaasForm<ImmersionHeaterData[]>;

	T[];

}>;

-->