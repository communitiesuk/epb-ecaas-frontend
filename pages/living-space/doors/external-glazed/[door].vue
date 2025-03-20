<script setup lang="ts">
const title = "External glazed door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalGlazedDoor?.data);
const model: Ref<ExternalGlazedDoorData> = ref(doorData!);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const {livingSpaceExternalGlazedDoor} = state.livingSpaceFabric.livingSpaceDoors;

		const door: ExternalGlazedDoorData = {
			name: fields.name,
			orientation: fields.orientation,
			surfaceArea: fields.surfaceArea,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			solarTransmittence: fields.solarTransmittence,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			numberOpenableParts: fields.numberOpenableParts,
			frameToOpeningRatio: fields.frameToOpeningRatio,
			maximumOpenableArea: fields.maximumOpenableArea,
			heightOpenableArea: fields.heightOpenableArea,
			midHeightOpenablePart1: fields.midHeightOpenablePart1,
			midHeightOpenablePart2: fields.midHeightOpenablePart2,
			midHeightOpenablePart3: fields.midHeightOpenablePart3,
			midHeightOpenablePart4: fields.midHeightOpenablePart4,
		};

		saveToList(door, livingSpaceExternalGlazedDoor);
	});

	navigateTo("/living-space/doors");
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
		<FieldsOrientation />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area"
			help="Net area of the building element. For non-rectangular windows, use the area of the window based on its shape"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
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
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m2.K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FormKit
			id="pitchOption"
			type="govRadios"
			:options="{
				'90': '90',
				custom: 'Custom'
			}"
			label="Pitch"
			help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down"
			name="pitchOption"
			validation="required"
		/>
		<FormKit
			v-if="model.pitchOption === 'custom'"
			id="pitch"
			type="govInputWithSuffix"
			suffix-text="degrees"
			name="pitch"
			validation="required | number | min:0 | max:180"
		/>
		<FormKit
			id="solarTransmittence"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="G value. Total solar energy transmittance of the transparent part of the window. Decimal between 0-1"
			name="solarTransmittence"
			validation="required | number | min:0.01 | max:1"
		/>
		<FormKit
			id="elevationalHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Elevational height of building element at its base"
			help="The distance between the ground and the lowest edge of the element"
			name="elevationalHeight"
			validation="required | number | min:0 | max:500"
		/>
		<FormKit
			id="midHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Mid height"
			help="Mid height of the air-flow path relative to the ventilation zone floor"
			name="midHeight"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="numberOpenableParts"
			type="govRadios"
			:options="{
				one: '1',
				two: '2',
				three: '3',
				four: '4',
				none: 'None',
			}"
			label="Number of openable parts "
			name="numberOpenableParts"
			validation="required"
		/>
		<template v-if="!!model.numberOpenableParts && model.numberOpenableParts !== 'none'">
			<FormKit
				id="frameToOpeningRatio"
				type="govInputFloat"
				label="Frame to opening ratio"
				help="The frame area fraction of window wi, ratio of the projected frame area to the overall projected area of the glazed element of the window. Decimal 0-1"
				name="frameToOpeningRatio"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="maximumOpenableArea"
				type="govInputWithSuffix"
				suffix-text="m2"
				label="Maximum openable area"
				help="The equivalent open area of the windows in the home."
				name="maximumOpenableArea"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="heightOpenableArea"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the openable area"
				help="Height of the openable part of the window (excluding the frame edges, and top/bottom portions that are not openable)"
				name="heightOpenableArea"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="midHeightOpenablePart1"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				name="midHeightOpenablePart1"
				validation="required | number | min:0 | max:100"
			/>
			<template v-if="model.numberOpenableParts !== 'one'">
				<FormKit
					id="midHeightOpenablePart2"
					type="govInputWithSuffix"
					suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					name="midHeightOpenablePart2"
					validation="required | number | min:0 | max:100"
				/>
				<template v-if="model.numberOpenableParts !== 'two'">
					<FormKit
						id="midHeightOpenablePart3"
						type="govInputWithSuffix"
						suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						name="midHeightOpenablePart3"
						validation="required | number | min:0 | max:100"
					/>
					<template v-if="model.numberOpenableParts !== 'three'">
						<FormKit
							id="midHeightOpenablePart4"
							type="govInputWithSuffix"
							suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
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