import {renderHook, act} from '@testing-library/react-hooks';
import {createMockClient} from 'mock-apollo-client';

import {GET_ADAPTERS_AND_EXTENSIONS} from '../../../gql';

import {AsyncStatus} from '../../../util/types';
import Wrapper from '../../../test/Wrapper';

import {useAdaptersOrExtensions} from './useAdaptersOrExtensions';

const mockClient = createMockClient();

describe('useAdaptersOrExtensions unit tests', () => {
  mockClient.setRequestHandler(GET_ADAPTERS_AND_EXTENSIONS, () =>
    Promise.resolve({data: 'test'})
  );

  test('should return correct data when wallet is disconnected', async () => {
    await act(async () => {
      const {result, waitForNextUpdate} = renderHook(
        () => useAdaptersOrExtensions(),
        {
          initialProps: {
            useInit: true,
            mockApolloClient: mockClient,
          },
          wrapper: Wrapper,
        }
      );

      await waitForNextUpdate();

      // Assert initial state
      expect(result.current.adapterExtensionStatus).toBe(AsyncStatus.STANDBY);
      expect(result.current.getAdapterOrExtensionFromRedux).toBeInstanceOf(
        Function
      );
      expect(result.current.registeredAdaptersOrExtensions).toBe(undefined);
      expect(result.current.unRegisteredAdaptersOrExtensions).toBe(undefined);
    });
  });
});
