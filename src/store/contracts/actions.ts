import Web3 from 'web3';
import {Dispatch} from 'redux';

import {ContractAdapterNames} from '../../components/web3/types';
import {DEFAULT_CHAIN, DAO_REGISTRY_CONTRACT_ADDRESS} from '../../config';
import {getAdapterAddress} from '../../components/web3/helpers';
import {StoreState} from '../types';

export const CONTRACT_DAO_REGISTRY = 'CONTRACT_DAO_REGISTRY';
export const CONTRACT_VOTING = 'CONTRACT_VOTING';
export const CONTRACT_ONBOARDING = 'CONTRACT_ONBOARDING';

/**
 * @todo Add inits for Transfer and Tribute when ready
 */

export function initContractDaoRegistry(web3Instance: Web3) {
  return async function (dispatch: Dispatch<any>) {
    try {
      if (web3Instance) {
        const lazyDaoRegistryABI = await import(
          '../../truffle-contracts/DaoRegistry.json'
        );
        const daoRegistryContract: Record<string, any> = lazyDaoRegistryABI;
        const contractAddress = DAO_REGISTRY_CONTRACT_ADDRESS[DEFAULT_CHAIN];
        const instance = new web3Instance.eth.Contract(
          daoRegistryContract.abi,
          contractAddress
        );

        dispatch({
          type: CONTRACT_DAO_REGISTRY,
          abi: daoRegistryContract.abi,
          contractAddress,
          instance,
        });
      }
    } catch (error) {
      throw error;
    }
  };
}

export function initContractOffchainVoting(web3Instance: Web3) {
  return async function (dispatch: Dispatch<any>, getState: () => StoreState) {
    try {
      if (web3Instance) {
        const lazyOffchainVotingABI = await import(
          '../../truffle-contracts/OffchainVotingContract.json'
        );
        const offchainVotingContract: Record<
          string,
          any
        > = lazyOffchainVotingABI;
        /**
         * Get address via DAO Registry.
         *
         * @note The `DaoRegistryContract` must be set in Redux first.
         */
        const contractAddress = await getAdapterAddress(
          ContractAdapterNames.voting,
          getState().contracts.DaoRegistryContract?.instance
        );
        const instance = new web3Instance.eth.Contract(
          offchainVotingContract.abi,
          contractAddress
        );

        dispatch({
          type: CONTRACT_VOTING,
          abi: offchainVotingContract.abi,
          contractAddress,
          instance,
        });
      }
    } catch (error) {
      throw error;
    }
  };
}

export function initContractOnboarding(web3Instance: Web3) {
  return async function (dispatch: Dispatch<any>, getState: () => StoreState) {
    try {
      if (web3Instance) {
        const lazyOnboardingABI = await import(
          '../../truffle-contracts/OnboardingContract.json'
        );
        const onboardingContract: Record<string, any> = lazyOnboardingABI;
        /**
         * Get address via DAO Registry.
         *
         * @note The `DaoRegistryContract` must be set in Redux first.
         */
        const contractAddress = await getAdapterAddress(
          ContractAdapterNames.onboarding,
          getState().contracts.DaoRegistryContract?.instance
        );
        const instance = new web3Instance.eth.Contract(
          onboardingContract.abi,
          contractAddress
        );

        dispatch({
          type: CONTRACT_ONBOARDING,
          abi: onboardingContract.abi,
          contractAddress,
          instance,
        });
      }
    } catch (error) {
      throw error;
    }
  };
}
