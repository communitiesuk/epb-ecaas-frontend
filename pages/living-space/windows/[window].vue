<script setup lang="ts">
const title = "Window";
const store = useEcaasStore();
const route = useRoute();

const window = useItemToEdit('window', store.livingSpaceFabric.livingSpaceWindows.data.windowObjects);
const model: Ref<WindowObject> = ref(window!);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const { data } = state.livingSpaceFabric.livingSpaceWindows;

		if (!data.windowObjects) {
			data.windowObjects = [];
		}

		const window: WindowObject = {
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
			overhangDepth: fields.overhangDepth,
			overhangDistance: fields.overhangDistance,
			sideFinRightDepth: fields.sideFinRightDepth,
			sideFinRightDistance: fields.sideFinRightDistance,
			sideFinLeftDepth: fields.sideFinLeftDepth,
			sideFinLeftDistance: fields.sideFinLeftDistance,
			type: fields.type,
			curtainsControlObject: fields.curtainsControlObject,
			thermalResistivityIncrease: fields.thermalResistivityIncrease,
			solarTransmittenceReduction: fields.solarTransmittenceReduction,
		};

		if (route.params.window && route.params.window !== 'create') {
			const index = parseInt(route.params.window as string);
			data.windowObjects[index] = window;
		} else {
			data.windowObjects?.push(window);
		}

		state.livingSpaceFabric.livingSpaceWindows.complete = true;
	});

	navigateTo("/living-space/windows");
};

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
		<GovErrorSummary :error-list="errorMessages" test-id="windowErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later "
			name="name"
			validation="required"
		/>
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			suffix-text="degrees"
			label="Orientation"
			help="The orientation angle of the inclined surface, expressed as the geographical azimuth angle of the horizontal projection of the inclined surface normal, 0 to 360"
			name="orientation"
			validation="required | number | min:0 | max:360"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area"
			help="Net area of the opaque building element (i.e. minus any windows / doors / etc.) If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for this in addition to width and height"
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
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<table class="govuk-table">
			<caption class="govuk-table__caption govuk-table__caption--m govuk-!-margin-bottom-6">Window shading</caption>
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-!-text-align-left">Type of shading</th>
					<th scope="col" class="govuk-!-text-align-left">Depth</th>
					<th scope="col" class="govuk-!-text-align-left">Distance</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Overhang</th>
					<td>
						<FormKit
							id="overhangDepth"
							type="govInputWithSuffix"
							suffix-text="m"
							name="overhangDepth"
							validation="number0"
						/>
					</td>
					<td>
						<FormKit
							id="overhangDistance"
							type="govInputWithSuffix"
							suffix-text="m"
							name="overhangDistance"
							validation="number0"
						/>
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin right</th>
					<td>
						<FormKit
							id="sideFinRightDepth"
							type="govInputWithSuffix"
							suffix-text="m"
							name="sideFinRightDepth"
							validation="number0"
						/>
					</td>
					<td>
						<FormKit
							id="sideFinRightDistance"
							type="govInputWithSuffix"
							suffix-text="m"
							name="sideFinRightDistance"
							validation="number0"
						/>
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin left</th>
					<td>
						<FormKit
							id="sideFinLeftDepth"
							type="govInputWithSuffix"
							suffix-text="m"
							name="sideFinLeftDepth"
							validation="number0"
						/>
					</td>
					<td>
						<FormKit
							id="sideFinLeftDistance"
							type="govInputWithSuffix"
							suffix-text="m"
							name="sideFinLeftDistance"
							validation="number0"
						/>
					</td>
				</tr>
			</tbody>

		</table>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<h2 class="govuk-heading-m">
			Curtains and blinds
		</h2>
		<FormKit
			id="type"
			type="govRadios"
			:options="{
				curtains: 'Curtains',
				blinds: 'Blinds',
			}"
			label="Type"
			help="Determines behaviour (curtains are scheduled, blinds respond to sunlight)"
			name="type"
			validation="required"
		/>
		<FormKit
			v-if="model.type === 'curtains'"
			id="curtainsControlObject"
			type="govRadios"
			:options="{
				motorised: 'Auto motorised',
				manual: 'Manual',
			}"
			label="Curtains control object reference"
			help="Reference to an OnOffTimeControl object that determines when curtains should open"
			name="curtainsControlObject"
			validation="required"
		/>
		<FormKit
			id="thermalResistivityIncrease"
			type="govInputWithSuffix"
			suffix-text="W / (m2.K)"
			label="Thermal resistivity increase"
			help="Additional thermal resistivity applied to window when curtain/blind is closed"
			name="thermalResistivityIncrease"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="solarTransmittenceReduction"
			type="govInputFloat"
			label="Solar transmittance reduction"
			help="Proportion of solar energy allowed through the window which is allowed into the zone when curtain/blind is closed (ie this is an additional reduction in transmission after the initial reduction by the window). Decimal 0-1"
			name="solarTransmittenceReduction"
			validation="required | number | min:0 | max:1"
		/>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>