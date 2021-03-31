import {render, screen, waitFor} from '@testing-library/react';
import {
  SnapshotProposalResponseData,
  SnapshotType,
} from '@openlaw/snapshot-js-erc712';

import {BURN_ADDRESS} from '../../util/constants';
import {DEFAULT_ETH_ADDRESS, FakeHttpProvider} from '../../test/helpers';
import {rest, server} from '../../test/server';
import {SNAPSHOT_HUB_API_URL} from '../../config';
import {snapshotAPIProposalResponse} from '../../test/restResponses';
import GovernanceProposalsList from './GovernanceProposalsList';
import MulticallABI from '../../truffle-contracts/Multicall.json';
import userEvent from '@testing-library/user-event';
import Wrapper from '../../test/Wrapper';
import Web3 from 'web3';

describe('GovernanceProposalsList unit tests', () => {
  const defaultProposalVotes: SnapshotProposalResponseData['votes'] = [
    {
      DEFAULT_ETH_ADDRESS: {
        address: DEFAULT_ETH_ADDRESS,
        msg: {
          version: '0.2.0',
          timestamp: '1614264732',
          token: '0x8f56682a50becb1df2fb8136954f2062871bc7fc',
          type: SnapshotType.vote,
          payload: {
            choice: 1, // Yes
            proposalHash:
              '0x1679cac3f54777f5d9c95efd83beff9f87ac55487311ecacd95827d267a15c4e',
            metadata: {
              memberAddress: DEFAULT_ETH_ADDRESS,
            },
          },
        },
        sig:
          '0xdbdbf122734b34ed5b10542551636e4250e98f443e35bf5d625f284fe54dcaf80c5bc44be04fefed1e9e5f25a7c13809a5266fcdbdcd0b94c885f2128544e79a1b',
        authorIpfsHash:
          '0xfe8f864ef475f60c7e01d5425df332199c5ae7ab712b8545f07433c68f06c644',
        relayerIpfsHash: '',
        actionId: '0xFCB86F90bd7b30cDB8A2c43FB15bf5B33A70Ea4f',
      },
    },
    {
      '0xc0437e11094275376defbe51dc6e04598403d276': {
        address: '0xc0437e11094275376defbe51dc6e04598403d276',
        msg: {
          version: '0.2.0',
          timestamp: '1614264732',
          token: '0x8f56682a50becb1df2fb8136954f2062871bc7fc',
          type: SnapshotType.vote,
          payload: {
            choice: 2, // No
            proposalHash:
              '0x1679cac3f54777f5d9c95efd83beff9f87ac55487311ecacd95827d267a15c4e',
            metadata: {
              memberAddress: '0xc0437e11094275376defbe51dc6e04598403d276',
            },
          },
        },
        sig:
          '0xdbdbf122734b34ed5b10542551636e4250e98f443e35bf5d625f284fe54dcaf80c5bc44be04fefed1e9e5f25a7c13809a5266fcdbdcd0b94c885f2128544e79a1b',
        authorIpfsHash:
          '0xfe8f864ef475f60c7e01d5425df332199c5ae7ab712b8545f07433c68f06c644',
        relayerIpfsHash: '',
        actionId: '0xFCB86F90bd7b30cDB8A2c43FB15bf5B33A70Ea4f',
      },
    },
  ];

  const defaultProposalBody = Object.values(snapshotAPIProposalResponse)[0];

  const proposalsResponse: typeof snapshotAPIProposalResponse = {
    // Proposal passed
    '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c3333': {
      ...defaultProposalBody,
      msg: {
        ...defaultProposalBody.msg,
        payload: {
          ...defaultProposalBody.msg.payload,
          name: 'Another cool one',
        },
      },
      data: {
        erc712DraftHash:
          '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c3434',
        authorIpfsHash: '',
      },
      votes: defaultProposalVotes,
    },
    // Proposal failed
    '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c4444': {
      ...defaultProposalBody,
      msg: {
        ...defaultProposalBody.msg,
        payload: {
          ...defaultProposalBody.msg.payload,
          name: 'Another rad one',
        },
      },
      data: {
        erc712DraftHash:
          '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c4545',
        authorIpfsHash: '',
      },
      votes: defaultProposalVotes,
    },
    // Proposal voting
    '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c5555': {
      ...defaultProposalBody,
      msg: {
        ...defaultProposalBody.msg,
        payload: {
          ...defaultProposalBody.msg.payload,
          name: 'Another awesome one',
          start: Date.now() / 1000 - 86400,
          end: Date.now() / 1000 + 86400,
        },
      },
      data: {
        erc712DraftHash:
          '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c5656',
        authorIpfsHash: '',
      },
      votes: defaultProposalVotes,
    },
  };

  const getWeb3Results = ({
    mockWeb3Provider,
    web3Instance,
  }: {
    mockWeb3Provider: FakeHttpProvider;
    web3Instance: Web3;
  }) => {
    /**
     * Inject voting results. The order should align with the order above of fake responses.
     */

    // 1. Inject passed result
    mockWeb3Provider.injectResult(
      web3Instance.eth.abi.encodeParameters(
        ['uint256', 'bytes[]'],
        [
          0,
          [
            web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
            web3Instance.eth.abi.encodeParameter('uint256', '200000'),
            web3Instance.eth.abi.encodeParameter('uint256', '100000'),
          ],
        ]
      ),
      {abi: MulticallABI, abiMethodName: 'aggregate'}
    );

    // 2. Inject failed result
    mockWeb3Provider.injectResult(
      web3Instance.eth.abi.encodeParameters(
        ['uint256', 'bytes[]'],
        [
          0,
          [
            web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
            web3Instance.eth.abi.encodeParameter('uint256', '200000'),
            web3Instance.eth.abi.encodeParameter('uint256', '300000'),
          ],
        ]
      ),
      {abi: MulticallABI, abiMethodName: 'aggregate'}
    );

    // 3. Inject voting result
    mockWeb3Provider.injectResult(
      web3Instance.eth.abi.encodeParameters(
        ['uint256', 'bytes[]'],
        [
          0,
          [
            web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
            web3Instance.eth.abi.encodeParameter('uint256', '100000'),
            web3Instance.eth.abi.encodeParameter('uint256', '100000'),
          ],
        ]
      ),
      {abi: MulticallABI, abiMethodName: 'aggregate'}
    );
  };

  test('should render proposal cards', async () => {
    const spy = jest.fn();

    server.use(
      ...[
        rest.get(
          `${SNAPSHOT_HUB_API_URL}/api/:spaceName/proposals/:adapterAddress`,
          async (_req, res, ctx) => res(ctx.json(proposalsResponse))
        ),
      ]
    );

    render(
      <Wrapper
        useInit
        useWallet
        getProps={({mockWeb3Provider, web3Instance}) => {
          /**
           * Inject voting results. The order should align with the order above of fake responses.
           */

          // 1. Inject passed result
          mockWeb3Provider.injectResult(
            web3Instance.eth.abi.encodeParameters(
              ['uint256', 'bytes[]'],
              [
                0,
                [
                  web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '200000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '100000'),
                ],
              ]
            ),
            {abi: MulticallABI, abiMethodName: 'aggregate'}
          );

          // 2. Inject failed result
          mockWeb3Provider.injectResult(
            web3Instance.eth.abi.encodeParameters(
              ['uint256', 'bytes[]'],
              [
                0,
                [
                  web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '200000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '300000'),
                ],
              ]
            ),
            {abi: MulticallABI, abiMethodName: 'aggregate'}
          );

          // 3. Inject voting result
          mockWeb3Provider.injectResult(
            web3Instance.eth.abi.encodeParameters(
              ['uint256', 'bytes[]'],
              [
                0,
                [
                  web3Instance.eth.abi.encodeParameter('uint256', '10000000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '100000'),
                  web3Instance.eth.abi.encodeParameter('uint256', '100000'),
                ],
              ]
            ),
            {abi: MulticallABI, abiMethodName: 'aggregate'}
          );
        }}>
        <GovernanceProposalsList
          actionId={BURN_ADDRESS}
          onProposalClick={spy}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/loading content/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      // Proposal headers
      expect(screen.getByText(/^voting$/i)).toBeInTheDocument();
      expect(screen.getByText(/^passed$/i)).toBeInTheDocument();
      expect(screen.getByText(/^failed$/i)).toBeInTheDocument();

      // Proposal names
      expect(screen.getByText(/^another awesome one$/i)).toBeInTheDocument();
      expect(screen.getByText(/^another cool one$/i)).toBeInTheDocument();
      expect(screen.getByText(/^another rad one$/i)).toBeInTheDocument();
    });

    // Click on a proposal
    userEvent.click(screen.getByText(/^another awesome one$/i));

    // Expect correct proposal id to come through in function args
    await waitFor(() => {
      expect(spy.mock.calls[0][0]).toBe(
        '0xb22ca9af120bfddfc2071b5e86a9edee6e0e2ab76399e7c2d96a9d502f5c5555'
      );
    });
  });

  test('should render no proposals text', async () => {
    server.use(
      ...[
        rest.get(
          `${SNAPSHOT_HUB_API_URL}/api/:spaceName/proposals/:adapterAddress`,
          async (_req, res, ctx) => res(ctx.json({}))
        ),
      ]
    );

    render(
      <Wrapper useInit useWallet getProps={getWeb3Results}>
        <GovernanceProposalsList
          actionId={BURN_ADDRESS}
          onProposalClick={() => {}}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/loading content/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/no proposals, yet!/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      // Proposal headers
      expect(() => screen.getByText(/^passed$/i)).toThrow();
      expect(() => screen.getByText(/^failed$/i)).toThrow();
      expect(() => screen.getByText(/^voting$/i)).toThrow();

      // Proposal names
      expect(() => screen.getByText(/another cool one/i)).toThrow();
      expect(() => screen.getByText(/another rad one/i)).toThrow();
      expect(() => screen.getByText(/another awesome one/i)).toThrow();
    });
  });

  test('should render error', async () => {
    server.use(
      ...[
        rest.get(
          `${SNAPSHOT_HUB_API_URL}/api/:spaceName/proposals/:adapterAddress`,
          async (_req, res, ctx) => res(ctx.status(500))
        ),
      ]
    );

    render(
      <Wrapper useInit useWallet getProps={getWeb3Results}>
        <GovernanceProposalsList
          actionId={BURN_ADDRESS}
          onProposalClick={() => {}}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/something went wrong while getting the proposals/i)
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/^details$/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      // Proposal headers
      expect(() => screen.getByText(/^proposals$/i)).toThrow();
      expect(() => screen.getByText(/^passed$/i)).toThrow();
      expect(() => screen.getByText(/^failed$/i)).toThrow();
      expect(() => screen.getByText(/^voting$/i)).toThrow();

      // Proposal names
      expect(() => screen.getByText(/another cool one/i)).toThrow();
      expect(() => screen.getByText(/another rad one/i)).toThrow();
      expect(() => screen.getByText(/another awesome one/i)).toThrow();
    });
  });

  test('should render custom proposal card', async () => {
    const spy = jest.fn();

    server.use(
      ...[
        rest.get(
          `${SNAPSHOT_HUB_API_URL}/api/:spaceName/proposals/:adapterAddress`,
          async (_req, res, ctx) => res(ctx.json(proposalsResponse))
        ),
      ]
    );

    render(
      <Wrapper useInit useWallet getProps={getWeb3Results}>
        <GovernanceProposalsList
          actionId={BURN_ADDRESS}
          onProposalClick={spy}
          renderProposalCard={({proposal, votingResult}) => (
            <div>
              <h2>{`custom card: ${proposal.msg.payload.name}`}</h2>
              <p>Yes votes: {votingResult?.Yes.shares}</p>
              <p>No votes: {votingResult?.No.shares}</p>
            </div>
          )}
        />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/loading content/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      // Proposal headers
      expect(screen.getByText(/^voting$/i)).toBeInTheDocument();
      expect(screen.getByText(/^passed$/i)).toBeInTheDocument();
      expect(screen.getByText(/^failed$/i)).toBeInTheDocument();

      // Proposal names
      expect(
        screen.getByText(/^custom card: another awesome one$/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^custom card: another cool one$/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^custom card: another rad one$/i)
      ).toBeInTheDocument();

      // Voting result
      expect(screen.getAllByText(/^yes votes: \d+$/i).length).toBe(3);
      expect(screen.getAllByText(/^no votes: \d+$/i).length).toBe(3);
    });
  });
});
