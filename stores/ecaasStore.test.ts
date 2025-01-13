import { createPinia, setActivePinia } from 'pinia';
import formStatus from '~/constants/formStatus';
import pagesData from '~/data/pages';

describe('Ecaas Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('getStatus of section returns not started status when no forms are complete', () => {
		const store = useEcaasStore();
		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus of section returns in progress status when some forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus of section returns complete status when all forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				},
				appliancesAndElectricity: {
					complete: true
				},
				shading: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});

	it('getStatus of subsection returns not started status when form has no data', () => {
		const store = useEcaasStore();
		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus of subsection returns complete status when form is complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});
});