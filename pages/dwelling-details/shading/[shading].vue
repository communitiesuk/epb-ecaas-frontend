<script setup lang="ts">
	const title = "Distant shading";
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit type="form" :actions="false">
		<FormKit
			type="govInputText"
			label="Name"
			help="Name this shading so it can be identified later"
			id="name"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
