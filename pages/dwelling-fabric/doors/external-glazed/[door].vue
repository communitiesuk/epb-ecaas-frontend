<script setup lang="ts">
import { getUrl, standardPitchOptions } from "#imports";

const title = "External glazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const doorData = useItemToEdit("door", store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor?.data);
const model = ref(doorData?.data);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalGlazedDoor } = state.dwellingFabric.dwellingSpaceDoors;
		const index = getStoreIndex(dwellingSpaceExternalGlazedDoor.data);

		dwellingSpaceExternalGlazedDoor.data[index] = {
			data: {
				name: fields.name,
				orientation: fields.orientation,
				surfaceArea: fields.surfaceArea,
				height: fields.height,
				width: fields.width,
				uValue: fields.uValue,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				solarTransmittance: fields.solarTransmittance,
				elevationalHeight: fields.elevationalHeight,
				midHeight: fields.midHeight,
				openingToFrameRatio: fields.openingToFrameRatio,
				numberOpenableParts: "1",
				maximumOpenableArea: fields.surfaceArea,
				heightOpenableArea: fields.height,
				midHeightOpenablePart1: fields.midHeight,
			},
			complete: true,
		};
		dwellingSpaceExternalGlazedDoor.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

autoSaveElementForm<ExternalGlazedDoorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor,
	defaultName: "External glazed door",
	onPatch: (state, newData, index) => {
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="externalGlazedDoorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsPitch
			:pitch-option="model?.pitchOption"
			:options="standardPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
		/>
		<FieldsOrientation />
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.width"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.max_window_open_area"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance or G value, or the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance"
			validation="required | number | min:0.01 | max:1"
			data-field="Zone.BuildingElement.*.g_value"
		/>
		<FormKit
			id="midHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Mid height"
			help="Enter the height from the ground to the midpoint of the window"
			name="midHeight"
			validation="required | number | min:0 | max:100"
			data-field="Zone.BuildingElement.*.mid_height"
		/>
		<FormKit
			id="openingToFrameRatio"
			type="govInputFloat"
			label="Window to frame ratio"
			help="Enter the proportion of the door taken up by the window"
			name="openingToFrameRatio"
			validation="required | number | min:0 | max:1"
			data-field="Zone.BuildingElement.*.frame_area_fraction"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Window to door ratio</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">0</th>
							<td class="govuk-table__cell">There is no window in the door.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">1</th>
							<td class="govuk-table__cell">There is no frame, only glass.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>