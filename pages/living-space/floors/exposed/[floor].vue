<script setup lang="ts">
const store = useEcaasStore();
const route = useRoute();

let model: Ref<ExposedFloorData>;

const saveForm = (fields: ExposedFloorData) => {
	store.$patch((state) => {
		const { livingSpaceFloors } = state.livingSpaceFabric;

		if (!livingSpaceFloors.livingSpaceExposedFloor?.data) {
			livingSpaceFloors.livingSpaceExposedFloor = { data: [] };
		}

		const floor: ExposedFloorData = {
			name: fields.name
		};

		if (route.params.floor && route.params.floor !== 'create') {
			const index = parseInt(route.params.floor as string);
			livingSpaceFloors.livingSpaceExposedFloor.data[index] = floor;
		} else {
			livingSpaceFloors.livingSpaceExposedFloor.data.push(floor);
		}

		livingSpaceFloors.livingSpaceExposedFloor.complete = true;
	});

	navigateTo("/living-space/floors");
};
</script>

<template>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"

	>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="test"
			name="name"
			validation="required"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>