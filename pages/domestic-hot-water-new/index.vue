<script setup lang="ts">
import { isEcaasForm } from '#imports';
import formStatus from '~/constants/formStatus';

const title = "Domestic Hot Water";

const page = usePage();
const store = useEcaasStore();

type DomesticHotWaterType = keyof typeof store.domesticHotWaterNew;
type DomesticHotWaterData = EcaasForm<WaterStorageData> //& EcaasForm<HotWaterOutletsData> & EcaasForm<PipeworkData>;

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
			// hotWaterOutlets: { complete: true },
			// pipework: { complete: true },
		},
	});

	navigateTo("/");
}

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

const immersion1: EcaasForm<ImmersionHeaterData> = {
	data: {
		name: "Jasper's Immersion Heater",
		ratedPower: 69,
		heaterPosition: "top",
		thermostatPosition: "middle",
	}
};

store.$patch({
	domesticHotWater: {
		waterHeating: {
			hotWaterCylinder: {
				complete: true,
				data: [hwCylinder1],
			},
			immersionHeater: {
				complete: true,
				data: [immersion1]
			}
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
</template>