<script setup lang="ts">
const title = "Water heating";
const page = usePage();
const store = useEcaasStore();

type WaterHeatingType = keyof typeof store.domesticHotWater.waterHeating;

interface WaterHeatingData extends
	StorageTankData,
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
				storageTank: { complete: true },
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
	<CustomList
		id="storageTank"
		title="Hot water cylinder"
		:form-url="`${page?.url!}/storage-tank`"
		:items="store.domesticHotWater.waterHeating.storageTank.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('storageTank', index)"
		@duplicate="(index: number) => handleDuplicate('storageTank', index)"
	/>
	<CustomList
		id="immersionHeater"
		title="Immersion heater"
		:form-url="`${page?.url!}/immersion-heater`"
		:items="store.domesticHotWater.waterHeating.immersionHeater.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('immersionHeater', index)"
		@duplicate="(index: number) => handleDuplicate('immersionHeater', index)"
	/>
	<h2 class="govuk-heading-l">
		Other water heat sources
	</h2>
	<CustomList
		id="pointOfUse"
		title="Point of use"
		:form-url="`${page?.url!}/point-of-use`"
		:items="store.domesticHotWater.waterHeating.pointOfUse.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('pointOfUse', index)"
		@duplicate="(index: number) => handleDuplicate('pointOfUse', index)"
	/>
	<CustomList
		id="heatPump"
		title="Heat pump (hot water only)"
		:form-url="`${page?.url!}/heat-pump`"
		:items="store.domesticHotWater.waterHeating.heatPump.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatPump', index)"
		@duplicate="(index: number) => handleDuplicate('heatPump', index)"
	/>
	<CustomList
		id="combiBoiler"
		title="Combi boiler"
		:form-url="`${page?.url!}/combi-boiler`"
		:items="store.domesticHotWater.waterHeating.combiBoiler.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('combiBoiler', index)"
		@duplicate="(index: number) => handleDuplicate('combiBoiler', index)"
	/>
	<CustomList
		id="heatBattery"
		title="Heat battery"
		:form-url="`${page?.url!}/heat-battery`"
		:items="store.domesticHotWater.waterHeating.heatBattery.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatBattery', index)"
		@duplicate="(index: number) => handleDuplicate('heatBattery', index)"
	/>
	<CustomList
		id="smartHotWaterTank"
		title="Smart hot water tank"
		:form-url="`${page?.url!}/smart-hot-water-tank`"
		:items="store.domesticHotWater.waterHeating.smartHotWaterTank.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('smartHotWaterTank', index)"
		@duplicate="(index: number) => handleDuplicate('smartHotWaterTank', index)"
	/>
	<CustomList
		id="heatInterfaceUnit"
		title="Heat interface unit"
		:form-url="`${page?.url!}/heat-interface-unit`"
		:items="store.domesticHotWater.waterHeating.heatInterfaceUnit.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatInterfaceUnit', index)"
		@duplicate="(index: number) => handleDuplicate('heatInterfaceUnit', index)"
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