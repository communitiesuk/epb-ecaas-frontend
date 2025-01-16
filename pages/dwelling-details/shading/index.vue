<script setup lang="ts">
	const title = "Distant shading";
	const page = usePage();
	const store = useEcaasStore();

	const { shadingObjects = [] } = store.dwellingDetails.shading.data;

	function handleRemove(index: number) {
		shadingObjects.splice(index, 1);

		store.$patch({
			dwellingDetails: {
				shading: {
					data: {
						shadingObjects: shadingObjects.length ? shadingObjects : undefined
					}
				}
			}
		});
	}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovCustomList
		title="Shading"
		:form-url="page?.url!"
		:items="store.dwellingDetails.shading.data.shadingObjects?.map(x => x.name)"
		v-on:remove="handleRemove"
	/>
	<GovButton href="/dwelling-details" secondary>Return to overview</GovButton>
</template>
