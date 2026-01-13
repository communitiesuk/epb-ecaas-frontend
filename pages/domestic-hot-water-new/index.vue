<script setup lang="ts">
import { isEcaasForm, type WaterHeatSourcesData } from '#imports';
import formStatus from '~/constants/formStatus';

const title = "Domestic Hot Water";

const page = usePage();
const store = useEcaasStore();

type DomesticHotWaterType = keyof typeof store.domesticHotWaterNew;
type DomesticHotWaterData = EcaasForm<WaterHeatSourcesData> & EcaasForm<WaterStorageData> & EcaasForm<HotWaterOutletsData> & EcaasForm<PipeworkData>;

function handleRemove(domesticHotWaterType: DomesticHotWaterType, index: number) {
	const data = store.domesticHotWaterNew[domesticHotWaterType]?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWaterNew[domesticHotWaterType].data = data.length ? data : [];
			state.domesticHotWaterNew[domesticHotWaterType].complete = false;
		});
	}
} 

function handleDuplicate<T extends DomesticHotWaterData>(domesticHotWaterType: DomesticHotWaterType, index: number) {
	const data  = store.domesticHotWaterNew[domesticHotWaterType]?.data;
	const item = data?.[index];
	let name: string;
    
	if (item) {
		const duplicates = data.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(item)) {
				name = item.data.name;
				return f.data.name.match(duplicateNamePattern(item.data.name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${name} (${duplicates.length})`,
				},
			} as T;

			state.domesticHotWaterNew[domesticHotWaterType].data.push(newItem);
			state.domesticHotWaterNew[domesticHotWaterType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		domesticHotWaterNew: {
			waterStorage: { complete: true },
			hotWaterOutlets: { complete: true },
			pipework: { complete: true },
			heatSources: { complete: true },
		},
	});

	navigateTo("/");
}

const hasIncompleteEntries = () =>
	Object.values(store.domesticHotWaterNew)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

// const hwCylinder1: EcaasForm<HotWaterCylinderData> = {
// 	data: {
// 		name: "Jasper's Cylinder",
// 		id: "what",
// 		heatSource: "weeeeee",
// 		storageCylinderVolume: {
// 			amount: 100,
// 			unit: "litres",
// 		},
// 		dailyEnergyLoss: 69,
// 		typeOfWaterStorage: "hotWaterCylinder",
// 	},
// };

// // const immersion1: EcaasForm<ImmersionHeaterData> = {
// // 	data: {
// // 		name: "Jasper's Immersion Heater",
// // 		ratedPower: 69,
// // 		heaterPosition: "top",
// // 		thermostatPosition: "middle",
// // 	}
// // };

// store.$patch({
// 	domesticHotWater: {
// 		waterHeating: {
// 			hotWaterCylinder: {
// 				complete: true,
// 				data: [hwCylinder1],
// 			},
// 			// immersionHeater: {
// 			// 	complete: true,
// 			// 	data: [immersion1]
// 			// }
// 		},
// 	},
// });
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
		:items="store.domesticHotWaterNew.heatSources.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('heatSources', index)"
		@duplicate="(index: number) => handleDuplicate('heatSources', index)"
	/>
	<CustomList 
		id="waterStorage"
		title="Water Storage"
		:form-url="`${page?.url!}/water-storage`"
		:items="store.domesticHotWaterNew.waterStorage.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('waterStorage', index)"
		@duplicate="(index: number) => handleDuplicate('waterStorage', index)"
	/>

	<CustomList 
		id="hotWaterOutlets"
		title="Hot Water Outlets"
		:form-url="`${page?.url!}/hot-water-outlets`"
		:items="store.domesticHotWaterNew.hotWaterOutlets.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('hotWaterOutlets', index)"
		@duplicate="(index: number) => handleDuplicate('hotWaterOutlets', index)"
	/>

	<CustomList 
		id="pipework"
		title="Pipework"
		:form-url="`${page?.url!}/pipework`"
		:items="store.domesticHotWaterNew.pipework.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('pipework', index)"
		@duplicate="(index: number) => handleDuplicate('pipework', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
	<GovButton
		href="/"
		secondary
	>
		Return to overview
	</GovButton>
	<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
	<CompleteElement
		:is-complete="Object.values(store.domesticHotWaterNew).every(section => section.complete)"
		:disabled="hasIncompleteEntries()"
		@completed="handleComplete"/>
	</div>
</template>