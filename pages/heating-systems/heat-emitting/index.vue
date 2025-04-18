<script setup lang="ts">
const page = usePage();
const title = "Heat emitting";
const store = useEcaasStore();

type HeatEmittingType = keyof typeof store.heatingSystems.heatEmitting;
interface HeatEmittingData extends ElectricStorageHeaterData, InstantElectricStorageData, ElectricStorageHeaterData, WarmAirHeatPumpData { }

function handleRemove(emittingType: HeatEmittingType, index: number) {
	const emitters = store.heatingSystems.heatEmitting[emittingType]?.data;
	if (emitters) {
		emitters.splice(index, 1);

		store.$patch((state) => {
			state.heatingSystems.heatEmitting[emittingType]!.data = emitters.length ? emitters : [];
			state.heatingSystems.heatEmitting[emittingType]!.complete = emitters.length > 0;
		});
	}
}

function handleDuplicate<T extends HeatEmittingData>(emittingType: HeatEmittingType, index: number) {
	const emitters = store.heatingSystems.heatEmitting[emittingType]?.data;
	const emitter = emitters?.[index];
	if (emitter) {
		const duplicates = emitters.filter(f => f.name.match(duplicateNamePattern(emitter.name)));

		store.$patch((state) => {
			const newItem = {
				...emitter,
				name: `${emitter.name} (${duplicates.length})`
			} as T;

			state.heatingSystems.heatEmitting[emittingType]!.data.push(newItem);
		});
	}
}
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovCustomList
		id="wetDistribution" title="Wet distribution" 
		:form-url="`${page?.url!}/wet-distribution`"
		:items="store.heatingSystems.heatEmitting.wetDistribution.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('wetDistribution', index)"
		@duplicate="(index: number) => handleDuplicate('wetDistribution', index)" />

	<GovCustomList
		id="instantElectricHeater" title="Instant electric heater"
		:form-url="`${page?.url!}/instant-electric-heater`"
		:items="store.heatingSystems.heatEmitting.instantElectricHeater.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('instantElectricHeater', index)"
		@duplicate="(index: number) => handleDuplicate('instantElectricHeater', index)" />

	<GovCustomList
		id="electricStorageHeater" title="Electric storage heater"
		:form-url="`${page?.url!}/electric-storage-heater`"
		:items="store.heatingSystems.heatEmitting.electricStorageHeater.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('electricStorageHeater', index)"
		@duplicate="(index: number) => handleDuplicate('electricStorageHeater', index)" />

	<GovCustomList
		id="warmAirHeatPump" title="Warm air heat pump" 
		:form-url="`${page?.url!}/warm-air-heat-pump`"
		:items="store.heatingSystems.heatEmitting.warmAirHeatPump.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('warmAirHeatPump', index)"
		@duplicate="(index: number) => handleDuplicate('warmAirHeatPump', index)" />

	<GovButton
		href="/heating-systems"
		secondary
	>
		Return to overview
	</GovButton>
</template>
