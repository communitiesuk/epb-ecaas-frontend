<script setup lang="ts">
definePageMeta({ layout: false });

const title = 'Clear data';

</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>

		<ClearDataPanel />
	</NuxtLayout>
</template>