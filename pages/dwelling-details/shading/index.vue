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

function handleDuplicate(index: number) {
		const shading = shadingObjects[index];

		if (shading) {
			const duplicates = shadingObjects.filter(s => s.name.match(duplicateNamePattern(shading.name)));

			store.$patch((state) => {
				state.dwellingDetails.shading.data.shadingObjects?.push({
					...shading,
					name: `${shading.name} (${duplicates.length})`
				});
			})
		}
	}
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <h1 class="govuk-heading-l">
    {{ title }}
  </h1>
  <GovCustomList
    title="Shading"
    :form-url="page?.url!"
    :items="store.dwellingDetails.shading.data.shadingObjects?.map(x => x.name)"
    v-on:remove="handleRemove"
    v-on:duplicate="handleDuplicate"
  />
  <GovButton
    href="/dwelling-details"
    secondary
  >
    Return to overview
  </GovButton>
</template>
