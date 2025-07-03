import {renderSuspended} from "@nuxt/test-utils/runtime";
import ClearData from './clear-data.vue';
import {screen} from '@testing-library/vue';

describe('clear data page', () => {
	it('renders page correctly', async () => {
		await renderSuspended(ClearData);

		expect(screen.getByTestId('clearDataPanel')).toBeDefined();
		expect(screen.getByTestId('clearDataButton')).toBeDefined();
		expect(screen.getByTestId('taskListLink')).toBeDefined();
	});
});