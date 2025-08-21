<script setup lang="ts">
const page = usePage();
const title = "Heat emitting";
const store = useEcaasStore();

type HeatEmittingType = keyof typeof store.heatingSystems.heatEmitting;
type HeatEmittingData = ElectricStorageHeaterData & EcaasForm<InstantElectricStorageData> & WetDistributionData & WarmAirHeatPumpData;

function handleRemove(emittingType: HeatEmittingType, index: number) {
	const emitters = store.heatingSystems.heatEmitting[emittingType]?.data;
	if (emitters) {
		emitters.splice(index, 1);

		store.$patch((state) => {
			state.heatingSystems.heatEmitting[emittingType]!.data = emitters.length ? emitters : [];
			state.heatingSystems.heatEmitting[emittingType]!.complete = false;
		});
	}
}

function handleDuplicate<T extends HeatEmittingData>(emittingType: HeatEmittingType, index: number) {
	const emitters = store.heatingSystems.heatEmitting[emittingType]?.data;
	const emitter = emitters?.[index];
	let name: string;

	if (emitter) {
		const duplicates = emitters.filter(f => {
			if ("data" in f && "data" in emitter) {
				name = emitter.data.name;
				return f.data.name.match(duplicateNamePattern(emitter.data.name));
			} else if ("name" in f && "name" in emitter) {
				name = emitter.name
				return f.name.match(duplicateNamePattern(emitter.name))
			}

			return false;
		});

		store.$patch((state) => {
			let newItem;

			if ("data" in emitter) {
				newItem = {
					complete: emitter.complete,
					data: {
						...emitter.data,
						name: `${name} (${duplicates.length})`
					}
				} as T;
			} else {
				newItem = {
					...emitter,
					name: `${name} (${duplicates.length})`
				} as T;
			}

			state.heatingSystems.heatEmitting[emittingType]!.data.push(newItem);
			state.heatingSystems.heatEmitting[emittingType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		heatingSystems: {
			heatEmitting: {
				wetDistribution: { complete: true },
				instantElectricHeater: { complete: true },
				electricStorageHeater: { complete: true },
				warmAirHeatPump: { complete: true }
			}
		}
	});

	navigateTo('/heating-systems');
}

function checkIsComplete(){
	const emitters = store.heatingSystems.heatEmitting;
	return Object.values(emitters).every(emitter => emitter.complete);
}

function hasIncompleteEntries() {
	const emitterTypes = store.heatingSystems.heatEmitting;
	return Object.values(emitterTypes).some(emitters => emitters.data.some(emitter => {
		if ("data" in emitter) {
			return !emitter.complete
		} else {
			return false
		}
	}));
}
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>

	<p class="govuk-hint">For now, this service only allows homes to be modelled with the following. In future releases there will be further options.</p>

	<CustomList
		id="wetDistribution" title="Wet distribution" 
		:form-url="`${page?.url!}/wet-distribution`"
		:items="store.heatingSystems.heatEmitting.wetDistribution.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('wetDistribution', index)"
		@duplicate="(index: number) => handleDuplicate('wetDistribution', index)" />

	<CustomList
		id="instantElectricHeater" title="Instant electric heater"
		:form-url="`${page?.url!}/instant-electric-heater`"
		:items="store.heatingSystems.heatEmitting.instantElectricHeater.data.map(x => x.data?.name)"
		@remove="(index: number) => handleRemove('instantElectricHeater', index)"
		@duplicate="(index: number) => handleDuplicate('instantElectricHeater', index)"
		:show-status="true" />

	<CustomList
		v-if="false"
		id="electricStorageHeater" title="Electric storage heater"
		:form-url="`${page?.url!}/electric-storage-heater`"
		:items="store.heatingSystems.heatEmitting.electricStorageHeater.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('electricStorageHeater', index)"
		@duplicate="(index: number) => handleDuplicate('electricStorageHeater', index)" />

	<CustomList
		v-if="false"
		id="warmAirHeatPump" title="Warm air heat pump" 
		:form-url="`${page?.url!}/warm-air-heat-pump`"
		:items="store.heatingSystems.heatEmitting.warmAirHeatPump.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('warmAirHeatPump', index)"
		@duplicate="(index: number) => handleDuplicate('warmAirHeatPump', index)" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/heating-systems"
			secondary
		>
			Return to heating systems
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>
