import {
  CONTRACT_BANK_EXTENSION,
  CONTRACT_CONFIGURATION,
  CONTRACT_DAO_FACTORY,
  CONTRACT_DAO_REGISTRY,
  CONTRACT_DISTRIBUTE,
  CONTRACT_FINANCING,
  CONTRACT_GUILDKICK,
  CONTRACT_MANAGING,
  CONTRACT_ONBOARDING,
  CONTRACT_RAGEQUIT,
  CONTRACT_TRIBUTE,
  CONTRACT_VOTING_OP_ROLLUP,
  CONTRACT_VOTING,
  CONTRACT_WITHDRAW,
} from '../actions';
import {ContractsState} from '../types';

const initialState = {
  BankExtensionContract: null,
  ConfigurationContract: null,
  DaoFactoryContract: null,
  DaoRegistryContract: null,
  DistributeContract: null,
  FinancingContract: null,
  GuildBankContract: null,
  ManagingContract: null,
  OnboardingContract: null,
  RagequitContract: null,
  TributeContract: null,
  VotingContract: null,
  WithdrawContract: null,
};

export default function reducer(
  state: ContractsState = initialState,
  action: any
) {
  const {type, ...payload} = action;

  switch (type) {
    case CONTRACT_BANK_EXTENSION:
      return contractBankExtension(state, payload);
    case CONTRACT_CONFIGURATION:
      return contractConfiguration(state, payload);
    case CONTRACT_DAO_FACTORY:
      return contractDAOFactory(state, payload);
    case CONTRACT_DAO_REGISTRY:
      return contractDAORegistry(state, payload);
    case CONTRACT_DISTRIBUTE:
      return contractDistribute(state, payload);
    case CONTRACT_FINANCING:
      return contractFinancing(state, payload);
    case CONTRACT_GUILDKICK:
      return contractGuildBank(state, payload);
    case CONTRACT_MANAGING:
      return contractManaging(state, payload);
    case CONTRACT_ONBOARDING:
      return contractOnboarding(state, payload);
    case CONTRACT_RAGEQUIT:
      return contractRagequit(state, payload);
    case CONTRACT_TRIBUTE:
      return contractTribute(state, payload);
    case CONTRACT_VOTING:
      return contractVoting(state, payload);
    case CONTRACT_VOTING_OP_ROLLUP:
      return contractVoting(state, payload);
    case CONTRACT_WITHDRAW:
      return contractWithdraw(state, payload);
    default:
      return state;
  }
}

function contractDAOFactory(state: ContractsState, payload: any) {
  return {...state, DaoFactoryContract: {...payload}};
}

function contractDAORegistry(state: ContractsState, payload: any) {
  return {...state, DaoRegistryContract: {...payload}};
}

function contractBankExtension(
  state: ContractsState,
  payload: any
): ContractsState {
  return {...state, BankExtensionContract: {...payload}};
}

function contractConfiguration(state: ContractsState, payload: any) {
  return {...state, ConfigurationContract: {...payload}};
}

function contractDistribute(
  state: ContractsState,
  payload: any
): ContractsState {
  return {...state, DistributeContract: {...payload}};
}

function contractFinancing(state: ContractsState, payload: any) {
  return {...state, FinancingContract: {...payload}};
}

function contractGuildBank(state: ContractsState, payload: any) {
  return {...state, GuildBankContract: {...payload}};
}

function contractOnboarding(state: ContractsState, payload: any) {
  return {...state, OnboardingContract: {...payload}};
}

function contractRagequit(state: ContractsState, payload: any) {
  return {...state, RagequitContract: {...payload}};
}

function contractTribute(state: ContractsState, payload: any): ContractsState {
  return {...state, TributeContract: {...payload}};
}

function contractVoting(state: ContractsState, payload: any): ContractsState {
  return {...state, VotingContract: {...payload}};
}

function contractManaging(state: ContractsState, payload: any): ContractsState {
  return {...state, ManagingContract: {...payload}};
}

function contractWithdraw(state: ContractsState, payload: any): ContractsState {
  return {...state, WithdrawContract: {...payload}};
}
