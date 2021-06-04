import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getApiStatus as getSnapshotAPIStatus} from '@openlaw/snapshot-js-erc712';

import {AsyncStatus} from './util/types';
import {getConnectedMember} from './store/actions';
import {ReduxDispatch, StoreState} from './store/types';
import {SNAPSHOT_HUB_API_URL} from './config';
import {useInitContracts} from './components/web3/hooks';
import {useIsMounted} from './hooks';
import {useWeb3Modal} from './components/web3/hooks';
import ErrorMessageWithDetails from './components/common/ErrorMessageWithDetails';
import FadeIn from './components/common/FadeIn';
import Header from './components/Header';
import Wrap from './components/common/Wrap';

type InitPropsRenderProps = {
  error: Error | undefined;
  isInitComplete: boolean;
};

type InitProps = {
  render: (p: InitPropsRenderProps) => React.ReactElement | null;
};

type InitErrorProps = {
  error: Error;
};

/**
 * Register any new async process names here.
 * It is mainly to check their progress before rendering.
 *
 * If the app is not dependent on a process before starting
 * do not add it here.
 */
enum ProcessName {
  initSnapshotAPI = 'initSnapshotAPI',
}

/**
 * Init Component
 *
 * Init will run any designated sync/async
 * setup processes and then render any child component
 * upon completion.
 *
 * In our case the children prop component to render is our app.
 *
 * @param {InitProps} props
 */
export default function Init(props: InitProps) {
  const {render} = props;

  /**
   * Selectors
   */

  const daoRegistryContract = useSelector(
    (s: StoreState) => s.contracts.DaoRegistryContract
  );

  /**
   * State
   */

  const [error, setError] = useState<Error>();
  const [isInitComplete, setIsInitComplete] = useState<boolean>(false);
  const [processReadyMap, setProcessReadyMap] = useState<
    Record<ProcessName, AsyncStatus>
  >({
    [ProcessName.initSnapshotAPI]: AsyncStatus.STANDBY,
  });

  /**
   * Our hooks
   */

  const initContracts = useInitContracts();
  const {account, web3Instance} = useWeb3Modal();
  const {isMountedRef} = useIsMounted();

  /**
   * Their hooks
   */

  const dispatch = useDispatch<ReduxDispatch>();

  /**
   * Cached callbacks
   */

  const handleInitContractsCached = useCallback(handleInitContracts, [
    initContracts,
  ]);

  const handleGetMemberCached = useCallback(handleGetMember, [
    account,
    daoRegistryContract,
    dispatch,
    web3Instance,
  ]);

  const handleGetSnapshotAPIStatusCached = useCallback(
    handleGetSnapshotAPIStatus,
    [isMountedRef]
  );

  /**
   * Effects
   */

  useEffect(() => {
    setIsInitComplete(
      Object.values(processReadyMap).every((fs) => fs === AsyncStatus.FULFILLED)
    );
  }, [processReadyMap]);

  useEffect(() => {
    web3Instance && handleInitContractsCached();
  }, [handleInitContractsCached, web3Instance]);

  useEffect(() => {
    handleGetMemberCached();
  }, [handleGetMemberCached]);

  useEffect(() => {
    handleGetSnapshotAPIStatusCached();
  }, [handleGetSnapshotAPIStatusCached]);

  /**
   * Functions
   */

  async function handleGetSnapshotAPIStatus() {
    try {
      if (!SNAPSHOT_HUB_API_URL) {
        throw new Error('No Snapshot Hub API URL was found.');
      }

      const {data} = await getSnapshotAPIStatus(SNAPSHOT_HUB_API_URL);

      // Choosing a slice of the data to make sure we have a response, not just 200 OK.
      if (!data.version) {
        throw new Error('Snapshot API is not ready.');
      }

      if (!isMountedRef.current) return;

      setProcessReadyMap((p) => ({
        ...p,
        [ProcessName.initSnapshotAPI]: AsyncStatus.FULFILLED,
      }));
    } catch (error) {
      if (!isMountedRef.current) return;

      setError(new Error('Snapshot API is not responding.'));
    }
  }

  async function handleInitContracts() {
    try {
      await initContracts();
    } catch (error) {
      setError(error);
    }
  }

  async function handleGetMember() {
    try {
      if (!account || !daoRegistryContract || !web3Instance) {
        return;
      }

      await dispatch(
        getConnectedMember({account, daoRegistryContract, web3Instance})
      );
    } catch (error) {
      setError(error);
    }
  }

  // Render children
  return render({error, isInitComplete});
}

/**
 * InitError
 *
 * An error component that is meant to be used if the <Init /> component
 * could not complete any of its processes to provide the app with vital data.
 *
 * @param {InitErrorProps} props
 */
export function InitError(props: InitErrorProps) {
  const {error} = props;

  return (
    <>
      <Header />

      <Wrap className="section-wrapper">
        <main>
          <FadeIn>
            <div
              style={{
                padding: '2em 1em 1em',
                textAlign: 'center',
              }}>
              <h1 style={{fontSize: '2rem'}}>
                <span
                  className="pulse"
                  role="img"
                  aria-label="Emoji with eyes crossed out."
                  style={{display: 'inline-block'}}>
                  😵
                </span>{' '}
                Oops, something went wrong.
              </h1>
            </div>

            <div
              style={{
                textAlign: 'center',
                maxWidth: 600,
                display: 'block',
                margin: '0 auto',
              }}>
              <ErrorMessageWithDetails error={error} renderText="" />
            </div>
          </FadeIn>
        </main>
      </Wrap>
    </>
  );
}
