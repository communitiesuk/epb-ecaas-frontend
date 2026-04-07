<script setup lang="ts">
import { displayHeatEmitterType, getUrl, type HeatingControlData } from "#imports";

const title = "Heating controls";
const store = useEcaasStore();


const heatingControlOptions = {
	separateTemperatureControl: "Separate temperature control",
	separateTimeAndTemperatureControl: "Separate time and temperature control",
};

const heatingControlData = store.spaceHeating.heatingControls.data[0];
const model = ref(heatingControlData?.data as HeatingControlData);
const heatEmitters = computed(() => store.spaceHeating.heatEmitters.data);
const heatEmitterRankWords = ["primary", "second", "third", "fourth", "fifth", "sixth"] as const;

const getHeatEmitterLabel = (heatEmitter: (typeof heatEmitters.value)[number]) => {
	const name = heatEmitter.data.name?.trim();
	if (name) {
		return name;
	}

	return displayHeatEmitterType(heatEmitter.data.typeOfHeatEmitter) || "Heat emitter";
};

const getHeatEmitterRankFieldId = (rankIndex: number) => {
	if (rankIndex === 0) {
		return "primaryHeatEmitter";
	}
	if (rankIndex === 1) {
		return "secondaryHeatEmitter";
	}
	return `heatEmitterRank_${rankIndex}`;
};

const getHeatEmitterRankQuestion = (rankIndex: number) => {
	const rankWord = heatEmitterRankWords[rankIndex] ?? `${rankIndex + 1}th`;
	return `Which is your ${rankWord} heating system?`;
};

const getHeatEmitterRankRenderKey = (rankIndex: number) => {
	/* 
	This key will change when the rank selction changes forcing a remount of the component and reset of internal state.
	This is necessary to reset the radio options when a higher rank selection is changed to ensure previously selected now invalid options are cleared. 
	*/
	const higherSelections = heatEmitterRankings.value
		.slice(0, rankIndex)
		.map((selection) => selection ?? "none")
		.join("-");

	return `${getHeatEmitterRankFieldId(rankIndex)}-${higherSelections}`;
};

const buildInitialHeatEmitterRankings = () => Array.from({ length: heatEmitters.value.length }, (_, rankIndex) => {
	const emitterIndex = heatEmitters.value.findIndex((heatEmitter) => heatEmitter.data.heatingRank === rankIndex + 1);
	return emitterIndex === -1 ? undefined : `${emitterIndex}`;
});

const heatEmitterRankings = ref<Array<string | undefined>>(buildInitialHeatEmitterRankings());

const visibleHeatEmitterRanks = computed(() => heatEmitters.value
	.map((_, rankIndex) => rankIndex)
	.filter((rankIndex) => rankIndex === 0 || heatEmitterRankings.value[rankIndex - 1] != null));

const heatEmitterOptionsForRank = (rankIndex: number) => {
	const selectedHigherRanks = heatEmitterRankings.value
		.slice(0, rankIndex)
		.filter((selection) => selection != null);
	const currentSelection = heatEmitterRankings.value[rankIndex];
	const availableEmitterIndexes = heatEmitters.value
		.map((_, emitterIndex) => emitterIndex)
		.filter((emitterIndex) => {
			const optionValue = `${emitterIndex}`;
			return !selectedHigherRanks.includes(optionValue) || optionValue === currentSelection;
		});

	return Object.fromEntries(
		availableEmitterIndexes.map((emitterIndex) => {
			const heatEmitter = heatEmitters.value[emitterIndex]!;
			const optionValue = `${emitterIndex}`;
			return [optionValue, getHeatEmitterLabel(heatEmitter)];
		}),
	);
};

const haveRankingsChanged = (a: (string | undefined)[], b: (string | undefined)[]) => {
	if (a.length !== b.length) {
		return true;
	}

	for (let i = 0; i < a.length; i += 1) {
		if (a[i] !== b[i]) {
			return true;
		}
	}

	return false;
};

const removeDuplicateEmitterRankSelections = (rankings: (string | undefined)[]) => {
	for (let rankIndex = 0; rankIndex < rankings.length; rankIndex += 1) {
		const selectedEmitter = rankings[rankIndex];
		if (selectedEmitter == null) {
			continue;
		}

		if (rankings.slice(0, rankIndex).includes(selectedEmitter)) {
			rankings[rankIndex] = undefined;
		}
	}
};

const clearRanksAfterChangedIndex = (rankings: (string | undefined)[], changedAt: number) => {
	if (changedAt === -1) {
		return;
	}

	for (let rankIndex = changedAt + 1; rankIndex < rankings.length; rankIndex += 1) {
		rankings[rankIndex] = undefined;
	}
};

const saveForm = (fields: HeatingControlData) => {
	store.$patch((state) => {
		const { heatingControls } = state.spaceHeating;

		const heatingControlsItem: EcaasForm<HeatingControlData> = {
			data: {
				name: displayCamelToSentenceCase(fields.heatingControlType),
				heatingControlType: fields.heatingControlType,
			},
			complete: true,
		};
		
		heatingControls.data = [heatingControlsItem];
		heatingControls.complete = false;
	});

	navigateTo("/space-heating");
};

watch(model, async (newData, initialData) => {

	if (initialData === undefined || newData === undefined) {
		return;
	};

	store.$patch(state => {
		state.spaceHeating.heatingControls.data[0] = {
			data: {
				...newData,
				name: displayCamelToSentenceCase(newData.heatingControlType),
			},
		};

		state.spaceHeating.heatingControls.complete = false;
	});
});

watch(heatEmitterRankings, (newRankings, previousRankings) => {
	const rankings = [...newRankings];
	const previous = previousRankings ? [...previousRankings] : [];
	const changedAt = rankings.findIndex((selection, index) => selection !== previous[index]);

	clearRanksAfterChangedIndex(rankings, changedAt);

	removeDuplicateEmitterRankSelections(rankings);

	const selectionsChanged = haveRankingsChanged(rankings, newRankings);

	if (selectionsChanged) {
		heatEmitterRankings.value = rankings;
		return;
	}

	store.$patch((state) => {
		state.spaceHeating.heatEmitters.data.forEach((heatEmitter, emitterIndex) => {
			const heatingRankIndex = rankings.findIndex((selection) => selection === `${emitterIndex}`);
			const data = heatEmitter.data as { heatingRank?: number };

			if (heatingRankIndex === -1) {
				delete data.heatingRank;
				return;
			}

			data.heatingRank = heatingRankIndex + 1;
		});
	});
}, { deep: true });

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatingControlsErrorSummary"/>
		<FormKit
			id="heatingControlType"
			type="govRadios"
			:options="heatingControlOptions"
			label="Type of heating control for dwelling"
			name="heatingControlType"
			validation="required"
		><GovDetails
			class="summary-text"
			:summary-text="`Help with this input`"
			classes="govuk-!-margin-bottom-4">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th class="govuk-table__header">Type of control</th>
						<th class="govuk-table__header">Description</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<td class="govuk-table__header">Separate temperature</td>
						<td class="govuk-table__cell">This is, for example, where there is a room thermostat in one room and thermostatic radiator valves, but all rooms follow a single time schedule.</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__header">Separate time and temperature</td>
						<td class="govuk-table__cell">This is, for example, where there is independent heating schedules and target temperatures for different areas.</td>
					</tr>
				</tbody>
			</table>
		</GovDetails></FormKit>
		<div
			v-if="heatEmitters.length > 0"
			id="heatEmitterRanking"
			data-testid="heatEmitterRanking"
			class="govuk-form-group">
			<fieldset class="govuk-fieldset">
				<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
					<h2 class="govuk-fieldset__heading">Rank the heating systems</h2>
				</legend>
				<FormKit
					v-for="rankIndex in visibleHeatEmitterRanks"
					:id="getHeatEmitterRankFieldId(rankIndex)"
					:key="getHeatEmitterRankRenderKey(rankIndex)"
					v-model="heatEmitterRankings[rankIndex]"
					:name="getHeatEmitterRankFieldId(rankIndex)"
					type="govRadios"
					validation="required"
					:options="heatEmitterOptionsForRank(rankIndex)"
					:label="getHeatEmitterRankQuestion(rankIndex)"
				/>
			</fieldset>
		</div>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('spaceHeating')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>