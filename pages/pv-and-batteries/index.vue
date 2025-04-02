<script setup lang="ts">
const title = "Photovoltaic (PV) and electric batteries";
const page = usePage();
const store = useEcaasStore();

type PvAndBatteryType = keyof typeof store.pvAndBatteries;
interface PvAndBatteryData extends PvSystemData, ElectricBatteryData, PvDiverterData {};

function handleRemove(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data = store.pvAndBatteries[pvAndBatteryType]?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.pvAndBatteries[pvAndBatteryType]!.data = data.length ? data : [];
			state.pvAndBatteries[pvAndBatteryType]!.complete = data.length > 0;
		});
	}
} 

function handleDuplicate<T extends PvAndBatteryData>(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data  = store.pvAndBatteries[pvAndBatteryType]?.data;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.pvAndBatteries[pvAndBatteryType]!.data.push(newItem);
		});
	}
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovCustomList
		id="pvSystem"
		title="PV System"
		:form-url="`${page?.url!}/pv-system`"
		:items="store.pvAndBatteries.pvSystem.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('pvSystem', index)"
		@duplicate="(index: number) => handleDuplicate('pvSystem', index)"
	/>
	<GovCustomList
		id="electricBattery"
		title="Electric battery"
		:form-url="`${page?.url!}/electric-battery`"
		:items="store.pvAndBatteries.electricBattery.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('electricBattery', index)"
		@duplicate="(index: number) => handleDuplicate('electricBattery', index)"
	/>
	<GovCustomList
		id="pvDiverter"
		title="PV diverter"
		:form-url="`${page?.url!}/pv-diverter`"
		:items="store.pvAndBatteries.pvDiverter.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('pvDiverter', index)"
		@duplicate="(index: number) => handleDuplicate('pvDiverter', index)"

	/>
	<GovButton href="/living-space" secondary>
		Return to overview
	</GovButton>
</template>
