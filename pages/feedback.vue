<script setup lang="ts">
const title = 'Send your feedback';
const router = useRouter();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<NuxtLink href="/" class="govuk-back-link govuk-!-margin-top-0" @click="router.back()">Back</NuxtLink>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovInset>
		Email <a href="mailto:ecaas@communities.gov.uk" class="govuk-link">ecaas@communities.gov.uk</a> to send your feedback.
	</GovInset>
	<p class="govuk-body">We appreciate any feedback you have, whether it's positive or negative. This helps us to make this tool better for everyone.</p>
	<p class="govuk-body">If you are reporting an bug, please include the following in your email:</p>
	<ul class="govuk-list govuk-list--bullet">
		<li>Time and date you encountered the bug</li>
		<li>Browser type you are using</li>
		<li>Brief description of the bug</li>
		<li>Screenshots of the error</li>
		<li>An exported file of the data you had inputted</li>
	</ul>
	<p class="govuk-body">Please only send one email per bug.</p>
	<p class="govuk-body">We will look at all feedback and bug reports, but due to the capacity of the team we are not be able to respond to all emails.</p>
	<GovButton href="/">Return to overview</GovButton>
</template>