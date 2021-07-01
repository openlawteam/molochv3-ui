import {memo, useEffect, useState} from 'react';
import {isMobile} from 'react-device-detect';
import {useLocation} from 'react-router';

import {AsyncStatus} from '../../util/types';
import {CHAINS} from '../../config';
import {CycleEllipsis} from '../feedback';
import {truncateEthAddress} from '../../util/helpers';
import {useIsDefaultChain} from './hooks';
import {useWeb3Modal} from './hooks';
import {WalletIcon} from './WalletIcon';
import LoaderLarge from '../feedback/LoaderLarge';
import Modal from '../common/Modal';

import TimesSVG from '../../assets/svg/TimesSVG';

type Web3ModalButtonProps = {
  // determines whether button should show account badge or custom text to
  // trigger wallet moodal
  showWalletETHBadge?: boolean;
  customWalletText?: string;
};

type ConnectWalletProps = {
  customWalletText?: string;
  showWalletETHBadge?: boolean;
};

function ConnectWallet({
  customWalletText,
  showWalletETHBadge,
}: ConnectWalletProps): JSX.Element {
  /**
   * Our hooks
   */

  const {
    // @todo Use and handle error in the UI
    // error,
    account,
    connected,
    connectWeb3Modal,
    disconnectWeb3Modal,
    initialCachedConnectorCheckStatus,
    networkId,
    providerOptions,
    web3Modal,
  } = useWeb3Modal();

  const {defaultChainError, isDefaultChain} = useIsDefaultChain();

  /**
   * Their hooks
   */

  const {pathname} = useLocation();

  /**
   * State
   */

  const [openModal, setOpenModal] = useState<boolean>(false);

  /**
   * Variables
   */

  const isWrongNetwork: boolean = isDefaultChain === false;
  const isChainGanache = networkId === CHAINS.GANACHE;
  const displayWalletText: string = getWalletText();

  /**
   * Effects
   */

  /**
   * If the `web3Modal` is ready, and/or the `pathname` changes,
   * then open or close the modal based on the current chain.
   *
   * When open, the user will be alerted to change chains.
   */
  useEffect(() => {
    if (initialCachedConnectorCheckStatus === AsyncStatus.FULFILLED) {
      setOpenModal(isDefaultChain ? false : true);
    }
  }, [isDefaultChain, initialCachedConnectorCheckStatus, pathname]);

  /**
   * Functions
   */

  function getWalletText(): string {
    if (isMobile) {
      if (account) {
        return truncateEthAddress(account);
      }

      return 'Connect';
    } else {
      if (showWalletETHBadge && account) {
        return truncateEthAddress(account);
      }

      return customWalletText || '';
    }
  }

  function displayProviders(): JSX.Element {
    const providerOptionsFiltered = Object.entries(providerOptions).filter(
      (p) => p[0] !== 'injected'
    );
    const maybeProviderOptions = isMobile
      ? providerOptionsFiltered
      : Object.entries(providerOptions);

    const displayOptions: JSX.Element[] = maybeProviderOptions.map(
      (provider: Record<number, any>) => (
        <button
          key={provider[0]}
          className={`walletconnect__options-button 
            ${
              connected && web3Modal?.cachedProvider === provider[0]
                ? 'walletconnect__options-button--connected'
                : ''
            }`}
          onClick={() => connectWeb3Modal(provider[0])}
          // disable WalletConnect button on Ganache network
          disabled={isChainGanache && provider[0] === 'walletconnect'}>
          <span className="wallet-name">{provider[1].display.name}</span>

          <WalletIcon providerName={provider[0]} />
        </button>
      )
    );

    return (
      <Modal
        keyProp="web3modal"
        isOpen={openModal}
        isOpenHandler={() => {
          setOpenModal(false);
        }}>
        {/* MODEL CLOSE BUTTON */}
        <span
          className="modal__close-button"
          onClick={() => {
            setOpenModal(false);
          }}>
          <TimesSVG />
        </span>
        <div>
          {/* TITLE */}
          <div className="modal__title">Connect Wallet</div>

          {/* SUBTITLE */}
          {connected && isWrongNetwork ? null : (
            <div className="modal__subtitle">Choose Your Wallet</div>
          )}

          {/* CONNECTED ACCOUNT TEXT */}
          {account && (
            <div className="walletconnect__connected-address-text">
              {truncateEthAddress(account, 7)}
            </div>
          )}

          {/* SHOW; WRONG NETWORK MSG || PROVIDER OPTIONS */}
          {connected && isWrongNetwork ? (
            <DisplayChainError
              defaultChainError={defaultChainError?.message || ''}
            />
          ) : (
            <div className="walletconnect__options">{displayOptions}</div>
          )}

          {/* DISCONNECT BUTTON LINK */}
          {connected && (
            <button
              className="walletconnect__disconnect-link-button"
              onClick={disconnectWeb3Modal}>
              {'Disconnect Wallet'}
            </button>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <>
      <button
        className={`walletconnect__connect-button 
        ${
          isWrongNetwork && connected
            ? 'walletconnect__connect-button--error'
            : ''
        }`}
        onClick={() => setOpenModal(true)}>
        <span
          className={`connect-button-text ${
            connected ? 'connect-button-text--ethAddress' : ''
          }`}>
          {displayWalletText || 'Connect'}
        </span>

        {showWalletETHBadge && isWrongNetwork && connected && (
          <span>Wrong Network</span>
        )}

        {showWalletETHBadge && (
          <WalletIcon providerName={web3Modal?.cachedProvider} />
        )}
      </button>

      {openModal && displayProviders()}
    </>
  );
}

type DisplayChainErrorProps = {
  defaultChainError: string;
};

function DisplayChainError({
  defaultChainError,
}: DisplayChainErrorProps): JSX.Element {
  return (
    <>
      <div className="error-message">
        <small>{defaultChainError}</small>
      </div>
      <div className="loader--large-container">
        <LoaderLarge />
      </div>
      <div>
        <small>Waiting for the right network</small>
        <CycleEllipsis />
        <br />
        <small>Switch networks from your wallet</small>
      </div>
    </>
  );
}

/**
 * Web3ModalButton
 * @param props: Web3ModalButtonProps
 */
export default memo(function Web3ModalButton({
  customWalletText,
  showWalletETHBadge,
}: Web3ModalButtonProps): JSX.Element {
  return (
    <ConnectWallet
      customWalletText={customWalletText}
      showWalletETHBadge={showWalletETHBadge}
    />
  );
});
