<script setup lang="ts">

const title = "Distant shading";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.dwellingDetails.shading;


function handleRemove(index: number) {
	data.splice(index, 1);
	
	store.$patch({
		dwellingDetails: {
			shading: {
				data,
				complete: false
			}
		}
	});
	
}

function handleDuplicate(index: number) {
	const shading = data[index];
	
	if (shading) {
		const duplicates = data.filter(s => s.name.match(duplicateNamePattern(shading.name)));
		
		store.$patch((state) => {
			state.dwellingDetails.shading.data.push({
				...shading,
				name: `${shading.name} (${duplicates.length})`
			});
		});
		store.dwellingDetails.shading.complete = false;
	}
}


function handleComplete() {
	store.$patch({
		dwellingDetails: {
			shading: { complete: true }
		}
	});
		
	navigateTo('/dwelling-details');		
}

</script>

<template>
	
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="shading" title="Shading" :form-url="page?.url!"
		:items="store.dwellingDetails.shading?.data?.map(x => x.name)" @remove="handleRemove" @duplicate="handleDuplicate" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-details">
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="store.dwellingDetails.shading?.complete ?? false" @completed="handleComplete"/>

	</div>
</template>

