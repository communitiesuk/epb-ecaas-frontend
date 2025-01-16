<script setup lang="ts">
	const title = "Distant shading";
	const store = useEcaasStore();
	const route = useRoute();

	let model: Ref<ShadingObject>;

	if (route.params.shading && route.params.shading !== 'create') {
		const index = parseInt(route.params.shading as string);

		const shading = store.dwellingDetails.shading.data.shadingObjects?.[index];

		model = ref({
			...shading!
		});
	}

	const saveForm = (fields: ShadingObject) => {
		store.$patch((state) => {
			if (!state.dwellingDetails.shading.data.shadingObjects) {
				state.dwellingDetails.shading.data.shadingObjects = []
			}

			state.dwellingDetails.shading.data.shadingObjects?.push({name: fields.name})
			state.dwellingDetails.shading.complete = true
		})

		navigateTo("/dwelling-details/shading");
	}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit type="form" v-model="model" :actions="false" @submit="saveForm">
		<FormKit
			type="govInputText"
			label="Name"
			help="Name this shading so it can be identified later"
			id="name"
			name="name"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
