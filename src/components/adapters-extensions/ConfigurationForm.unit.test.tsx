import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Web3 from 'web3';

import {ethBlockNumber} from '../../test/web3Responses';
import {FakeHttpProvider} from '../../test/helpers';
import {getAdapterOrExtensionId} from './helpers';
import {DaoAdapterConstants} from './enums';
import ConfigurationForm from './ConfigurationForm';
import Wrapper from '../../test/Wrapper';

describe('<ConfigurationForm /> unit tests', () => {
  const onboardingContractConfig = {
    name: DaoAdapterConstants.ONBOARDING,
    adapterId: getAdapterOrExtensionId(DaoAdapterConstants.ONBOARDING),
    contractAddress: '0xd07Aa695e8379dc3F9369686DC0ffA1407325D21',
    abiFunctionName: 'configureDao',
    description:
      'Triggers the process of minting internal tokens in exchange of a specific token at a fixed price.',
  };

  const configureDao = {
    inputs: [
      {
        internalType: 'contract DaoRegistry',
        name: 'dao',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'signerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenAddrToMint',
        type: 'address',
      },
    ],
    name: 'configureDao',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  test('missing abi configuration parameters', async () => {
    render(
      <Wrapper useInit>
        <ConfigurationForm
          abiConfigurationInputs={[]}
          abiMethodName={onboardingContractConfig.abiFunctionName}
          adapterOrExtension={onboardingContractConfig}
          closeHandler={() => jest.fn()}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/configuration unavailable. abi is missing/i)
      ).toBeInTheDocument();
    });
  });

  test('should render form errors for blank fields', async () => {
    render(
      <Wrapper useInit>
        <ConfigurationForm
          abiConfigurationInputs={configureDao.inputs}
          abiMethodName={onboardingContractConfig.abiFunctionName}
          adapterOrExtension={onboardingContractConfig}
          closeHandler={() => jest.fn()}
        />
      </Wrapper>
    );

    // Form fields
    await waitFor(() => {
      // Buttons
      expect(
        screen.getByRole('button', {name: /^submit$/i})
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {name: /^remove$/i})
      ).toBeInTheDocument();

      // Input labels
      expect(screen.getByLabelText(/dao/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/signerAddress/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tokenAddrToMint/i)).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText(/dao/i));
    userEvent.click(screen.getByLabelText(/signerAddress/i));
    userEvent.click(screen.getByLabelText(/tokenAddrToMint/i));
    userEvent.click(screen.getByLabelText(/dao/i));

    await waitFor(() => {
      expect(screen.getAllByText(/this field is required\.$/i).length).toBe(3);
    });
  });

  test('should submit configuration form', async () => {
    let mockWeb3Provider: FakeHttpProvider;
    let web3Instance: Web3;

    render(
      <Wrapper
        useWallet
        useInit
        getProps={(p) => {
          mockWeb3Provider = p.mockWeb3Provider;
          web3Instance = p.web3Instance;
        }}>
        <ConfigurationForm
          abiConfigurationInputs={configureDao.inputs}
          abiMethodName={onboardingContractConfig.abiFunctionName}
          adapterOrExtension={onboardingContractConfig}
          closeHandler={() => jest.fn()}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/dao/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/signerAddress/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tokenAddrToMint/i)).toBeInTheDocument();
    });

    // Type in the inputs
    await userEvent.type(
      screen.getByLabelText(/dao/i),
      '0xC51545cc825d23a7b7B7c8Da45AB6F2f62479a46',
      {
        delay: 100,
      }
    );

    await userEvent.type(
      screen.getByLabelText(/signerAddress/i),
      '0x88D33a637C9f797B58dA89FfD1f96546b7e8cceC',
      {
        delay: 100,
      }
    );

    await userEvent.type(
      screen.getByLabelText(/tokenAddrToMint/i),
      '0x971819d64e329c78735B84f39Fb4e261B814F170',
      {delay: 100}
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(/0xC51545cc825d23a7b7B7c8Da45AB6F2f62479a46/i)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/0x88D33a637C9f797B58dA89FfD1f96546b7e8cceC/i)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/0x971819d64e329c78735B84f39Fb4e261B814F170/i)
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      // Mock the RPC calls
      mockWeb3Provider.injectResult(...ethBlockNumber({web3Instance}));
      // Mock tx call
      mockWeb3Provider.injectResult(
        web3Instance.eth.abi.encodeParameter('uint256', 123)
      );
    });

    act(() => {
      // Click submit
      userEvent.click(screen.getByRole('button', {name: /submit/i}));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /submit/i})).toBeDisabled();
    });
  }, 50000);

  test('should remove adapter or extension', async () => {
    let mockWeb3Provider: FakeHttpProvider;
    let web3Instance: Web3;

    render(
      <Wrapper
        useWallet
        useInit
        getProps={(p) => {
          mockWeb3Provider = p.mockWeb3Provider;
          web3Instance = p.web3Instance;
        }}>
        <ConfigurationForm
          abiConfigurationInputs={configureDao.inputs}
          abiMethodName={onboardingContractConfig.abiFunctionName}
          adapterOrExtension={onboardingContractConfig}
          closeHandler={() => jest.fn()}
        />
      </Wrapper>
    );

    await waitFor(() => {
      // Mock the RPC calls
      mockWeb3Provider.injectResult(...ethBlockNumber({web3Instance}));
      // Mock tx call
      mockWeb3Provider.injectResult(
        web3Instance.eth.abi.encodeParameter('uint256', 123)
      );
    });

    act(() => {
      // Click remove
      userEvent.click(screen.getByRole('button', {name: /remove/i}));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /remove/i})).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /removed/i})).toBeDisabled();
    });
  }, 50000);
});
