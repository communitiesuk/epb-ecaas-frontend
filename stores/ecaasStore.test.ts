import { createPinia, setActivePinia } from 'pinia';
import formStatus from '~/constants/formStatus';

describe('Ecaas Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('getSectionStatus returns not started status when no forms are complete', () => {
		const store = useEcaasStore();
		const status = store.getSectionStatus('dwellingDetails');

		expect(status).toBe(formStatus.notStarted);
	});

	it('getSectionStatus returns complete status when all forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const status = store.getSectionStatus('dwellingDetails');

		expect(status).toBe(formStatus.complete);
	})
});