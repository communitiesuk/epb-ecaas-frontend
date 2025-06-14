<script setup lang="ts">
const title = "Water heating";
const page = usePage();
const store = useEcaasStore();

type WaterHeatingType = keyof typeof store.domesticHotWater.waterHeating;

interface WaterHeatingData extends
	HotWaterCylinderData,
	ImmersionHeaterData,
	SolarThermalData,
	PointOfUseData,
	HotWaterHeatPumpData,
	CombiBoilerData,
	WaterHeatingHeatBatteryData,
	SmartHotWaterTankData,
	WaterHeatingHeatInterfaceUnitData {}

function handleRemove(waterHeatingType: WaterHeatingType, index: number) {
	const waterHeating = store.domesticHotWater.waterHeating[waterHeatingType]?.data;

	if (waterHeating) {
		waterHeating.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWater.waterHeating[waterHeatingType]!.data = waterHeating.length ? waterHeating : [];
			state.domesticHotWater.waterHeating[waterHeatingType]!.complete = false;
		});
	}
}

function handleDuplicate<T extends WaterHeatingData>(waterHeatingType: WaterHeatingType, index: number) {
	const waterHeating = store.domesticHotWater.waterHeating[waterHeatingType]?.data;
	const waterHeatingItem = waterHeating[index];

	if (waterHeatingItem) {
		const duplicates = waterHeating.filter(d => d.name.match(duplicateNamePattern(waterHeatingItem.name)));

		store.$patch((state) => {
			state.domesticHotWater.waterHeating[waterHeatingType].data.push({
				...waterHeatingItem,
				name: `${waterHeatingItem.name} (${duplicates.length})`
			} as T);
			state.domesticHotWater.waterHeating[waterHeatingType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: { complete: true },
				immersionHeater: { complete: true },
				solarThermal: { complete: true },
				pointOfUse: { complete: true },
				heatPump: { complete: true },
				combiBoiler: { complete: true },
				heatBattery: { complete: true },
				smartHotWaterTank: { complete: true },
				heatInterfaceUnit: { complete: true },
			}
		}
	});
	navigateTo('/domestic-hot-water');
}

function checkIsComplete(){
	const heatingItems = store.domesticHotWater.waterHeating;
	return Object.values(heatingItems).every(item => item.complete);
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		Water Heating
	</h1>
	<p class="govuk-body">For now, this service only allows homes to be modelled with the following. In future releases there will be further options.</p>
	<CustomList
		id="hotWaterCylinder"
		title="Hot water cylinder"
		:form-url="`${page?.url!}/hot-water-cylinder`"
		:items="store.domesticHotWater.waterHeating.hotWaterCylinder.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('hotWaterCylinder', index)"
		@duplicate="(index: number) => handleDuplicate('hotWaterCylinder', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/domestic-hot-water"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>

	</div>
</template>