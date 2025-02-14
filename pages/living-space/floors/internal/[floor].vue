<script setup lang="ts">
const store = useEcaasStore();
const route = useRoute();

let model: Ref<InternalFloorData>;

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const { livingSpaceFloors } = state.livingSpaceFabric;
		
		if (!livingSpaceFloors.livingSpaceInternalFloor?.data) {
			livingSpaceFloors.livingSpaceInternalFloor = { data: [] };
		}

		const floor: InternalFloorData = {
			name: fields.name
		};

		if (route.params.floor && route.params.floor !== 'create') {
			const index = parseInt(route.params.floor as string);
			livingSpaceFloors.livingSpaceInternalFloor.data[index] = floor;
		} else {
			livingSpaceFloors.livingSpaceInternalFloor.data.push(floor);
		}

		livingSpaceFloors.livingSpaceInternalFloor.complete = true;
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