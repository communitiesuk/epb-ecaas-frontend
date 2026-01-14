<script setup lang="ts">
import type { CookieConsent } from "~/constants/cookieConsent";

const title = "Cookies on our service";
const serviceName = "Check Part L building compliance";

const cookieOptions = {
	accepted: "Use cookies that measure my website use",
	rejected: "Do not use cookies that measure my website use",
} as const satisfies Record<CookieConsent, string>;

type CookieOption = keyof typeof cookieOptions | null | undefined;

const cookieConsent = useCookie("cookieConsent");

const model = ref<{
	acceptCookies: CookieOption
}>({
	acceptCookies: cookieConsent.value as CookieOption,
});

const { gtag } = useGtag();

const saveForm = (fields: typeof model.value) => {
	cookieConsent.value = fields.acceptCookies;

	gtag("consent", "update", {
		analytics_storage: fields.acceptCookies === "accepted" ? "granted" : "denied",
	});

	navigateTo("/");
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">
		Cookies are files saved on your phone, tablet or computer when you visit a website. The '{{ serviceName }}' service uses cookies in order to understand how you use the service so we can update and improve it.
	</p>
	<GovInset>
		The cookies we use don't identify you personally. You can still use the '{{ serviceName }}' service if you don't accept cookies that measure website use.
	</GovInset>
	<h2 class="govuk-heading-m">Cookies that measure website use</h2>
	<p class="govuk-body">We use Google Analytics to collect information about how you use this service. This helps us check it's meeting your needs and make improvements.</p>
	<p class="govuk-body">Google Analytics stores information about:</p>
	<ul class="govuk-list govuk-list--bullet">
		<li>how you got to the site</li>
		<li>pages you visit and how long you spend on them</li>
		<li>what you click on</li>
	</ul>
	<p class="govuk-body">No personal details are stored with this information, so you can't be identified.</p>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm">
		<FormKit
			id="acceptCookies"
			type="govRadios"
			:options="cookieOptions"
			name="acceptCookies"
			validation="required"
			:validation-messages="{
				required: 'Select an option'
			}"
		/>
		<FormKit type="govButton" label="Save settings" />
	</FormKit>
</template>