<script setup lang="ts">
const store = useEcaasStore();
const route = useRoute();

let model: Ref<GroundFloorData>;

const saveForm = (fields: GroundFloorData) => {

	store.$patch((state) => {
		if (!state.livingSpaceFabric.floors.data.groundFloor.data) {
			state.livingSpaceFabric.floors.data.groundFloor.data = [];
		}

		const index = parseInt(route.params.floor as string);
		const floor = {
			name: fields.name,

		};

		if (route.params.floor && route.params.floor !== 'create') {
			state.livingSpaceFabric.floors.data.groundFloor.data[index] = floor;
		} else {
			state.livingSpaceFabric.floors.data.groundFloor.data.push(floor);
		}

		state.livingSpaceFabric.floors.data.groundFloor.complete = true;
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