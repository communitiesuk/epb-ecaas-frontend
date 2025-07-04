<script setup lang="ts">
import { pitchOptions } from '#imports';

const title = "External glazed door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor?.data);
const model: Ref<ExternalGlazedDoorData> = ref(doorData!);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const {dwellingSpaceExternalGlazedDoor} = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = {
			name: fields.name,
			orientation: fields.orientation,
			surfaceArea: fields.surfaceArea,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			frameToOpeningRatio: fields.frameToOpeningRatio,
		};

		let door: ExternalGlazedDoorData;

		const numberParts = fields.numberOpenableParts;

		switch (numberParts) {
			case '0':
				door = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
				};
				break;
			case '1':
				door = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
				};
				break;
			case '2':
				door = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
				};
				break;
			case '3':
				door = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
				};
				break;
			case '4':
				door = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
					midHeightOpenablePart4: fields.midHeightOpenablePart4,
				};
				break;
			default:
				door = { ...commonFields } as ExternalGlazedDoorData;
		}
			
		dwellingSpaceExternalGlazedDoor.complete = false;
		saveToList(door, dwellingSpaceExternalGlazedDoor);
	});
	
	navigateTo("/dwelling-space/doors");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
			:pitch-option="model.pitchOption"
			:options="pitchOptions()"
		/>
		<FieldsOrientation />
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="The height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="The width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Net area of the building element. For non-rectangular windows, use the area of the window based on its shape"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="G value. Total solar energy transmittance of the transparent part of the window. Decimal between 0-1"
			name="solarTransmittance"
			validation="required | number | min:0.01 | max:1"
		/>
		<FormKit
			id="midHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Mid height"
			help="Enter the height from the ground to the midpoint of the window"
			name="midHeight"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="frameToOpeningRatio"
			type="govInputFloat"
			label="Frame to opening ratio"
			help="The proportion of the window taken up by the frame compared to the total opening area."
			name="frameToOpeningRatio"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="numberOpenableParts"
			type="govRadios"
			:options="{
				'1': '1',
				'2': '2',
				'3': '3',
				'4': '4',
				'0': 'None',
			}"
			label="Number of openable parts "
			name="numberOpenableParts"
			validation="required"
		/>
		<template v-if="!!model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="heightOpenableArea"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the openable area"
				help="The vertical measurement of the section of the window that can be opened."
				name="heightOpenableArea"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="maximumOpenableArea"
				type="govInputWithSuffix"
				suffix-text="m²"
				label="Maximum openable area"
				help="The total area of the window that can be opened for ventilation."
				name="maximumOpenableArea"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="midHeightOpenablePart1"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				help="Enter the height from the ground to the midpoint of the openable section of the window."
				name="midHeightOpenablePart1"
				validation="required | number | min:0 | max:100"
			/>
			<template v-if="model.numberOpenableParts !== '1'">
				<FormKit
					id="midHeightOpenablePart2"
					type="govInputWithSuffix"
					suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					help="Enter the height from the ground to the midpoint of the openable section of the window."
					name="midHeightOpenablePart2"
					validation="required | number | min:0 | max:100"
				/>
				<template v-if="model.numberOpenableParts !== '2'">
					<FormKit
						id="midHeightOpenablePart3"
						type="govInputWithSuffix"
						suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						help="Enter the height from the ground to the midpoint of the openable section of the window."
						name="midHeightOpenablePart3"
						validation="required | number | min:0 | max:100"
					/>
					<template v-if="model.numberOpenableParts !== '3'">
						<FormKit
							id="midHeightOpenablePart4"
							type="govInputWithSuffix"
							suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
							help="Enter the height from the ground to the midpoint of the openable section of the window."
							name="midHeightOpenablePart4"
							validation="required | number | min:0 | max:100"
						/>
					</template>
				</template>
			</template>
		</template>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>