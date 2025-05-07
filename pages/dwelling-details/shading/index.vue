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
				data: data,
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
		store.dwellingDetails.shading.complete = true;
		
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
		id="shading" title="Shading" :form-url="page?.url!"
		:items="store.dwellingDetails.shading.data.map(x => x.name)" @remove="handleRemove" @duplicate="handleDuplicate" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-details" secondary>
			Return to overview
		</GovButton>

		<GovButton v-show="!store.dwellingDetails.shading.complete" data-testid="completeSection" @click="handleComplete">
			Mark section as complete
		</GovButton>
		<div v-show="store.dwellingDetails.shading.complete" role="status" class="app-status-element">
			Completed  
		</div>

	</div>
</template>

<style lang="scss" scoped>
.app-status-element {

	font-family: "GDS Transport", arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-weight: 400;
		font-size: 1.1875rem;
		line-height: 1;
    padding: 8px 10px 7px;
    border: 2px solid transparent;
    color: #b1b4b6;
    background-color: #f3f2f1;
    box-shadow: 0 2px 0 #b1b4b6;
}

</style>