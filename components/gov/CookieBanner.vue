<script setup lang="ts">
import type { CookieRef } from "#app";
import type { CookieConsent } from "~/constants/cookieConsent";

const serviceName = "Cookies on Check Part L building compliance";

const cookieConsent: CookieRef<CookieConsent | undefined> = useCookie("cookieConsent");
const hideCookieMessage = useCookie("hideCookieMessage");

const { gtag } = useGtag();

const handleAccept = () => {
	cookieConsent.value = "accepted";

	gtag("consent", "update", {
		analytics_storage: "granted",
	});
};

const handleReject = () => {
	cookieConsent.value = "rejected";

	gtag("consent", "update", {
		analytics_storage: "denied",
	});
};

const handleHide = () => hideCookieMessage.value = "true";
</script>

<template>
	<div v-if="!cookieConsent" class="govuk-cookie-banner" data-nosnippet role="region" aria-label="Cookies on {{ serviceName }}">
		<div class="govuk-cookie-banner__message govuk-width-container">
			<div class="govuk-grid-row">
				<div class="govuk-grid-column-two-thirds">
					<h2 class="govuk-cookie-banner__heading govuk-heading-m">
						{{ serviceName }}
					</h2>
					<div class="govuk-cookie-banner__content">
						<p class="govuk-body">We use some essential cookies to make this service work.</p>
						<p class="govuk-body">
							We'd also like to use analytics cookies so we can understand how you use the service and make improvements.
						</p>
					</div>
				</div>
			</div>
			<div class="govuk-button-group">
				<button type="button" class="govuk-button" data-module="govuk-button" @click="handleAccept">
					Accept analytics cookies
				</button>
				<button type="button" class="govuk-button" data-module="govuk-button" @click="handleReject">
					Reject analytics cookies
				</button>
				<NuxtLink class="govuk-link" href="/cookies">View cookies</NuxtLink>
			</div>
		</div>
	</div>

	<div v-if="cookieConsent && !hideCookieMessage" class="govuk-cookie-banner" data-nosnippet role="region" aria-label="Cookies on {{ serviceName }}">
		<div class="govuk-cookie-banner__message govuk-width-container">
			<div class="govuk-grid-row">
				<div class="govuk-grid-column-two-thirds">
					<div class="govuk-cookie-banner__content">
						<p v-if="cookieConsent === 'accepted'" class="govuk-body">You've accepted additional cookies. You can <a class="govuk-link" href="/cookies">change your cookie settings</a> at any time.</p>
						<p v-if="cookieConsent === 'rejected'" class="govuk-body">You've rejected analytics cookies. You can <a class="govuk-link" href="/cookies">change your cookie settings</a> at any time.</p>
					</div>
				</div>
			</div>
			<div class="govuk-button-group">
				<button value="yes" type="submit" name="cookies[hide]" class="govuk-button" data-module="govuk-button" @click="handleHide">
					Hide cookie message
				</button>
			</div>
		</div>
	</div>
</template>