import Web3 from 'web3';

import {ContractsStateEntry} from '../../../store/contracts/types';
import {ContractExtensionNames} from '../types';

export async function getExtensionAddress(
  extensionName: ContractExtensionNames,
  daoContractInstance: ContractsStateEntry['instance'] | undefined
): Promise<string> {
  try {
    if (!daoContractInstance) {
      throw new Error('No DaoRegistry contract instance provided.');
    }

    return await daoContractInstance.methods
      .getExtensionAddress(Web3.utils.sha3(extensionName))
      .call();
  } catch (error) {
    throw error;
  }
}
