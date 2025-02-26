<script setup lang="ts">
const title = "Roof";
const store = useEcaasStore();
const route = useRoute();

const roofData = useItemToEdit('roof', store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceRoofs?.data);
const model: Ref<RoofData> = ref(roofData!);

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const { livingSpaceCeilingsAndRoofs } = state.livingSpaceFabric;
		
		if (!livingSpaceCeilingsAndRoofs.livingSpaceRoofs?.data) {
			livingSpaceCeilingsAndRoofs.livingSpaceRoofs = { data: [] };
		}

		const roof: RoofData = {
			name: fields.name,
			typeOfRoof: fields.typeOfRoof,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '180' ? 180 : fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			width: fields.width,
			elevationalHeightOfElement: fields.elevationalHeightOfElement,
			surfaceArea: fields.surfaceArea,
			solarAbsorbtionCoefficient: fields.solarAbsorbtionCoefficient,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		if (route.params.roof && route.params.roof !== 'create') {
			const index = parseInt(route.params.roof as string);
			livingSpaceCeilingsAndRoofs.livingSpaceRoofs.data[index] = roof;
		} else {
			livingSpaceCeilingsAndRoofs.livingSpaceRoofs.data.push(roof);
		}

		livingSpaceCeilingsAndRoofs.livingSpaceRoofs.complete = true;
	});

	navigateTo("/living-space/ceilings-and-roofs");
};

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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="roofErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later."
			name="name"
			validation="required"
		/>
		<FormKit
			id="typeOfRoof"
			type="govRadios"
			:options="{
				flat: 'Flat roof',
				pitchedInsulatedAtRoof: 'Pitched roof insulated at roof or rafter',
				pitchedInsulatedAtCeiling: 'Pitched roof insulated at ceiling or joist'
			}"
			label="Type of roof"
			name="typeOfRoof"
			validation="required"
		/>
		<template v-if="model.typeOfRoof === 'flat'">
			<FormKit
				id="pitchOption"
				type="govRadios"
				:options="{
					'180': '180',
					custom: 'Custom'
				}"
				label="Pitch"
				help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down."
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
		</template>
		<template v-else-if="!!model.typeOfRoof">
			<FormKit
				id="pitch"
				type="govInputWithSuffix"
				suffix-text="degrees"
				label="Pitch"
				help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down."
				name="pitch"
				validation="required | number | min:0 | max:180"
			/>
		</template>
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			label="Orientation"
			help="The orientation angle of the inclined surface, expressed as the geographical azimuth angle of the horizontal projection of the inclined surface normal, 0 to 360."
			name="orientation"
			validation="required | number | min:0 | max:360"
			suffix-text="degrees"
		/>
		<FormKit
			id="height"
			type="govInputWithSuffix"
			label="Height"
			help="The height of the building element."
			name="height"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width"
			help="The width of the building element."
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="elevationalHeightOfElement"
			type="govInputWithSuffix"
			label="Elevational height of building element at its base"
			help="The distance between the ground and the lowest edge of the element."
			name="elevationalHeightOfElement"
			validation="required | number | min:0 | max:500"
			suffix-text="m"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Surface area"
			help="Net area of the opaque building element (i.e. minus any windows / doors / etc.) If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for this in addition to width and height."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m2"
		/>
		<FormKit
			id="solarAbsorbtionCoefficient"
			type="govInputFloat"
			label="Solar absorption coefficient"
			help="Solar absorption coefficient at the external surface (dimensionless), the proportion of solar radiation which is absorbed. Decimal between 0-1."
			name="solarAbsorbtionCoefficient"
			validation="required | number | min:0.01 | max:1"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			label="U-value"
			help="Steady-state thermal transmittance of the building element."
			name="uValue"
			validation="required | number | min:0.01 | max:10"
			suffix-text="W/(m2.K)"
		/>
		<FormKit
			id="kappaValue"
			type="govInputWithSuffix"
			suffix-text="J/m2.K"
			label="Areal heat capacity"
			help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers. (Note that this is different to the effectiveness thickness definition of areal heat capacity used in SAP10 and in other monthly models.)"
			name="kappaValue"
			validation="required | number | min:100 | max:5000000"
		/>
		<FormKit
			id="massDistributionClass"
			type="govRadios"
			:options="{
				internal: 'Mass distributed on internal side',
				external: 'Mass concentrated on external side',
				divided: 'Mass divided over internal and external side',
				equally: 'Mass equally distributed',
				inside: 'Mass concentrated inside',
			}"
			label="Mass distribution class"
			help="Distribution of mass in building element."
			name="massDistributionClass"
			validation="required"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>