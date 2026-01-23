<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { isEcaasForm } from "#imports";

const page = usePage();
const title = "Heat emitting";
const store = useEcaasStore();

type HeatEmittingType = keyof typeof store.spaceHeating.heatEmitting;
type HeatEmittingData = ElectricStorageHeaterData & EcaasForm<InstantElectricStorageData> & EcaasForm<WetDistributionData> & WarmAirHeatPumpData;

function handleRemove(emittingType: HeatEmittingType, index: number) {
	const emitters = store.spaceHeating.heatEmitting[emittingType]?.data;
	if (emitters) {
		emitters.splice(index, 1);

		store.$patch((state) => {
			state.spaceHeating.heatEmitting[emittingType].data = emitters.length ? emitters : [];
			state.spaceHeating.heatEmitting[emittingType].complete = false;
		});
	}
}

function handleDuplicate<T extends HeatEmittingData>(emittingType: HeatEmittingType, index: number) {
	const emitters = store.spaceHeating.heatEmitting[emittingType]?.data;
	const emitter = emitters?.[index];
	let name: string;

	if (emitter) {
		const duplicates = emitters.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(emitter)) {
				name = emitter.data.name;
				return f.data.name.match(duplicateNamePattern(emitter.data.name));
			} else if (!isEcaasForm(f) && !isEcaasForm(emitter)) {
				name = emitter.name;
				return f.name.match(duplicateNamePattern(emitter.name));
			}

			return false;
		});

		store.$patch((state) => {
			let newItem;

			if (isEcaasForm(emitter)) {
				newItem = {
					complete: emitter.complete,
					data: {
						...emitter.data,
						name: `${name} (${duplicates.length})`,
					},
				} as T;
			} else {
				newItem = {
					...emitter,
					name: `${name} (${duplicates.length})`,
				} as T;
			}

			state.spaceHeating.heatEmitting[emittingType].data.push(newItem);
			state.spaceHeating.heatEmitting[emittingType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		spaceHeating: {
			heatEmitting: {
				wetDistribution: { complete: true },
				instantElectricHeater: { complete: true },
				electricStorageHeater: { complete: true },
				warmAirHeatPump: { complete: true },
			},
		},
	});

	navigateTo("/space-heating");
}

function checkIsComplete() {
	const emitters = store.spaceHeating.heatEmitting;
	return Object.values(emitters).every(emitter => emitter.complete);
}

function hasIncompleteEntries() {
	const emitterTypes = store.spaceHeating.heatEmitting;
	
	return Object.values(emitterTypes).some(
		emitters => emitters.data.some(
			emitter => isEcaasForm(emitter) ? !emitter.complete : false));
}
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>

	<p class="govuk-hint">For now, this service only allows homes to be modelled with the following. In future releases there will be further options.</p>

	<CustomList
		id="wetDistribution"
		title="Wet distribution" 
		:form-url="`${page?.url!}/wet-distribution`"
		:items="store.spaceHeating.heatEmitting.wetDistribution.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('wetDistribution', index)"
		@duplicate="(index: number) => handleDuplicate('wetDistribution', index)" />

	<CustomList
		id="instantElectricHeater"
		title="Instant electric heater"
		:form-url="`${page?.url!}/instant-electric-heater`"
		:items="store.spaceHeating.heatEmitting.instantElectricHeater.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('instantElectricHeater', index)"
		@duplicate="(index: number) => handleDuplicate('instantElectricHeater', index)" />

	<CustomList
		v-if="false"
		id="electricStorageHeater"
		title="Electric storage heater"
		:form-url="`${page?.url!}/electric-storage-heater`"
		:items="store.spaceHeating.heatEmitting.electricStorageHeater.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('electricStorageHeater', index)"
		@duplicate="(index: number) => handleDuplicate('electricStorageHeater', index)" />

	<CustomList
		v-if="false"
		id="warmAirHeatPump"
		title="Warm air heat pump" 
		:form-url="`${page?.url!}/warm-air-heat-pump`"
		:items="store.spaceHeating.heatEmitting.warmAirHeatPump.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('warmAirHeatPump', index)"
		@duplicate="(index: number) => handleDuplicate('warmAirHeatPump', index)" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/space-heating"
			secondary
		>
			Return to space heating
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>
