# Moloch v3 DApp

Related supporting repositories:

- [openlawteam/molochv3-contracts](https://github.com/openlawteam/molochv3-contracts)
- [openlawteam/snapshot-hub (erc-712 branch)](https://github.com/openlawteam/snapshot-hub/tree/erc-712)
- [openlawteam/snapshot-js-erc712](https://github.com/openlawteam/snapshot-js-erc712)

## Developer Setup

### Local `.env` File

When running locally you'll need a `.env` file in the root directory with the following:

```
REACT_APP_ENVIRONMENT=localhost
REACT_APP_INFURA_PROJECT_ID_LOCAL=...
REACT_APP_DAO_REGISTRY_CONTRACT_ADDRESS=...
REACT_APP_MULTICALL_CONTRACT_ADDRESS=...
REACT_APP_SNAPSHOT_HUB_API_URL=http://localhost:8081
REACT_APP_SNAPSHOT_SPACE=tribute
REACT_APP_GRAPH_API_URL=...
```

NOTE:

- `REACT_APP_INFURA_PROJECT_ID_LOCAL` can be the same value you use for LAO local development.
- `REACT_APP_DAO_REGISTRY_CONTRACT_ADDRESS` is the address of the `DaoRegistry` smart contract deployed to your network.
- `REACT_APP_MULTICALL_CONTRACT_ADDRESS` is the address of the `Multicall` smart contract deployed to your network.
- `REACT_APP_SNAPSHOT_HUB_API_URL` is the url of [snaphot-hub](https://github.com/openlawteam/snapshot-hub/tree/erc-712) running locally in a container.
- `REACT_APP_SNAPSHOT_SPACE` is the unique name registered in Snapshot Hub under which proposals, votes, etc. will be stored.
- `REACT_APP_GRAPH_API_URL` is the url of the [subgraph](#running-the-local-graph-node) running locally in a container.

#### Optional env vars for local development

`REACT_APP_DEFAULT_CHAIN_NAME_LOCAL=<MAINNET | ROPSTEN | RINKEBY | GOERLI | KOVAN | GANACHE>`

### Ganache Workspace Setup

When you set up your Ganache network workspace in the [Ganache GUI app](https://www.trufflesuite.com/ganache):

- Change the Network ID to `1337`. That is necessary in order to connect MetaMask to your Ganache network. The DApp is configured for Ganache to be `chainId` `1337`.
- Turn off Automine and set the Mining Block Time (Seconds) to `10`.

Alternatively (and for now the more stable method), you can run the network with the [Ganache CLI](https://github.com/trufflesuite/ganache-cli):

- `npm install -g ganache-cli` (if not already installed)
- `ganache-cli --port 7545 --networkId 1337 --blockTime 10`

**Remember**: After you deploy the `DaoRegistry` smart contract on your local Ganache network you must include the deployed contract's address in your local root `.env` file.

## Running the local graph-node

Clone the https://github.com/openlawteam/molochv3-contracts repo and from the root open up a terminal, `npm ci`.

Follow the instructions [here](https://github.com/openlawteam/molochv3-contracts/tree/master/docker) to setup and run the local graph-node.

## GitHub Pages Deployments

Deployments for the development environment are handled automatically with a GitHub Action:

- `GitHub Pages development deployment`: push to `main` branch -> https://molochv3.org

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
