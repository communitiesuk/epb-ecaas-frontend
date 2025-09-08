<script setup lang="ts">
import { getUrl } from "#imports";
const title = "Instant electric heater";
const store = useEcaasStore();
const route = useRoute();

const instantElectricHeaterData = useItemToEdit("heater", store.heatingSystems.heatEmitting.instantElectricHeater.data);
const model: Ref<InstantElectricStorageData | undefined> = ref(instantElectricHeaterData?.data);

const saveForm = (fields: InstantElectricStorageData) => {
	store.$patch((state) => {
		const { instantElectricHeater } = state.heatingSystems.heatEmitting;
		const storeData = store.heatingSystems.heatEmitting.instantElectricHeater.data;

		const index = route.params.heater === "create" ? storeData.length - 1 : Number(route.params.heater);

		const instantElectricHeaterItem: EcaasForm<InstantElectricStorageData> = {
			data: {
				name: fields.name,
				ratedPower: fields.ratedPower,
				convectionFractionInstant: fields.convectionFractionInstant,
			},
			complete: true
		};

		instantElectricHeater.data[index] = instantElectricHeaterItem;
		instantElectricHeater.complete = false;
	});

	navigateTo("/heating-systems/heat-emitting");
};

watch(model, async (newData: InstantElectricStorageData | undefined, initialData: InstantElectricStorageData | undefined) => {
	const storeData = store.heatingSystems.heatEmitting.instantElectricHeater.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = "Instant electric heater";
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.heater === "create" && isFirstEdit) {

		store.$patch(state => {
			state.heatingSystems.heatEmitting.instantElectricHeater.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.heater === "create" ? storeData.length - 1 : Number(route.params.heater);

		state.heatingSystems.heatEmitting.instantElectricHeater.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.heatingSystems.heatEmitting.instantElectricHeater.data[index]?.data.name
			}
		};

		state.heatingSystems.heatEmitting.instantElectricHeater.complete = false;
	});
});

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
		<GovErrorSummary :error-list="errorMessages" test-id="instantElectricHeaterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this instant electric heater so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			help="Enter the maximum power consumption of the heater"
			name="ratedPower"
			validation="required | number | min:0 | max:70"
			suffix-text="kW"
		/>
		<FormKit
			id="convectionFractionInstant"
			type="govInputFloat"
			label="Convection fraction for heating"
			help="Specify the portion of heat transferred through convection (0 to 1), where 1 means all heat is convective"
			name="convectionFractionInstant"
			validation="required | number | min:0.01 | max:1">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Heating type</th>
							<th scope="col" class="govuk-table__header">Convection fraction</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Air heating</b><br>Convectors, fan coils</td>
							<td class="govuk-table__cell">0.95</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Free heating surface</b><br>Radiators, radiant panels</td>
							<td class="govuk-table__cell">0.70</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Floor heating</b><br>Low temperature radiant tube heaters, luminous heaters, wood stoves</td>
							<td class="govuk-table__cell">0.50</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Wall heating</b><br>Radiant ceiling panels, accumulation stoves</td>
							<td class="govuk-table__cell">0.35</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Ceiling heating</b><br>Radiant ceiling electric heating</td>
							<td class="govuk-table__cell">0.20</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatEmitting')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>