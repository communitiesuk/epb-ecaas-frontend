import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from './index.vue'
import {screen } from '@testing-library/vue'
import {within} from '@testing-library/dom';


describe('ground floors', () => {
  const store = useEcaasStore();
  const user = userEvent.setup()

  const ground1: GroundFloorData = {
  name: "ground1 name"
  }

  const ground2: GroundFloorData = {
  name: "ground2 name"
  }

  const ground3: GroundFloorData = {
  name: "ground3 name"
  }

  afterEach(() => {
    store.$reset();
  })

  it('ground floor is removed when remove link is clicked', async () => {

    store.$patch({
      livingSpaceFabric: {
        floors: {
          data: {
            groundFloor: {
              data:[ground1]
            }
             
          }
        }
      }
    });
    await renderSuspended(Floors)
	

		expect(screen.getAllByTestId('ground_items')).toBeDefined();

		await user.click(screen.getByTestId('ground_remove_0'));

		expect(screen.queryByTestId('ground_items')).toBeNull();
	});

  it('should only remove the ground floor object thats is clicked', async () => {

    store.$patch({
      livingSpaceFabric: {
        floors: {
          data: {
            groundFloor: {
              data:[ground1, ground2, ground3]
            }
          }
        }
      }
    });

    await renderSuspended(Floors)
		await user.click(screen.getByTestId('ground_remove_1'));
    const populatedList = screen.getByTestId('ground_items')
    expect(within(populatedList).getByText('ground1 name')).toBeDefined();
    expect(within(populatedList).getByText('ground3 name')).toBeDefined();
    expect(within(populatedList).queryByText('ground2 name')).toBeNull();

  })
it('shading is duplicated when duplicate link is clicked', async () => {
	
  store.$patch({
    livingSpaceFabric: {
      floors: {
        data: {
          groundFloor: {
            data:[ground1, ground2]
          }
        }
      }
    }
  });

  await renderSuspended(Floors);
  await userEvent.click(screen.getByTestId('ground_duplicate_0'))
  await userEvent.click(screen.getByTestId('ground_duplicate_0'))
  await userEvent.click(screen.getByTestId('ground_duplicate_2'))
  await userEvent.click(screen.getByTestId('ground_duplicate_2'))

expect(screen.queryAllByTestId('ground_item').length).toBe(6)
expect(screen.getByText('ground1 name')).toBeDefined();
expect(screen.getByText('ground1 name (1)')).toBeDefined();
expect(screen.getByText('ground1 name (2)')).toBeDefined();
expect(screen.getByText('ground1 name (1) (1)')).toBeDefined();
expect(screen.getByText('ground1 name (1) (2)')).toBeDefined();
})

})