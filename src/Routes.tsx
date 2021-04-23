import {Route, Switch} from 'react-router-dom';

import CreateGovernanceProposal from './pages/governance/CreateGovernanceProposal';
import CreateMembershipProposal from './pages/membership/CreateMembershipProposal';
import CreateTransferProposal from './pages/transfers/CreateTransferProposal';
import CreateTributeProposal from './pages/tributes/CreateTributeProposal';
import GetStarted from './pages/start/GetStarted';
import GovernanceProposalDetails from './pages/governance/GovernanceProposalDetails';
import GovernanceProposals from './pages/governance/GovernanceProposals';
import MemberProfile from './pages/members/MemberProfile';
import Members from './pages/members/Members';
import Membership from './pages/membership/Membership';
import MembershipDetails from './pages/membership/MembershipDetails';
import NotFound from './pages/subpages/NotFound';
import TransferDetails from './pages/transfers/TransferDetails';
import Transfers from './pages/transfers/Transfers';
import TributeDetails from './pages/tributes/TributeDetails';
import Tributes from './pages/tributes/Tributes';
import AdapterOrExtensionManager from './components/adapters-extensions/AdapterOrExtensionManager';
import CouponOnboarding from './pages/membership/CouponOnboarding';

const proposalIdParameter: string = ':proposalId';

export default function Routes() {
  return (
    <Switch>
      {[
        <Route key="splash" exact path="/" render={() => <GetStarted />} />,
        <Route
          key="join"
          exact
          path="/join"
          render={() => <CreateMembershipProposal />}
        />,
        <Route
          key="membership"
          exact
          path="/membership"
          render={() => <Membership />}
        />,
        <Route
          key="membership-details"
          exact
          path={`/membership/${proposalIdParameter}`}
          render={() => <MembershipDetails />}
        />,
        <Route
          key="transfer"
          exact
          path="/transfer"
          render={() => <CreateTransferProposal />}
        />,
        <Route
          key="transfers"
          exact
          path="/transfers"
          render={() => <Transfers />}
        />,
        <Route
          key="transfer-details"
          exact
          path={`/transfers/${proposalIdParameter}`}
          render={() => <TransferDetails />}
        />,
        <Route
          key="tribute"
          exact
          path="/tribute"
          render={() => <CreateTributeProposal />}
        />,
        <Route
          key="tributes"
          exact
          path="/tributes"
          render={() => <Tributes />}
        />,
        <Route
          key="tribute-details"
          exact
          path={`/tributes/${proposalIdParameter}`}
          render={() => <TributeDetails />}
        />,
        <Route
          key="governance-proposal"
          exact
          path="/governance-proposal"
          render={() => <CreateGovernanceProposal />}
        />,
        <Route
          key="governance-proposals"
          exact
          path="/governance-proposals"
          render={() => <GovernanceProposals />}
        />,
        <Route
          key="governance-proposal-details"
          exact
          path={`/governance-proposals/${proposalIdParameter}`}
          render={() => <GovernanceProposalDetails />}
        />,
        <Route
          key="members"
          exact
          path="/members"
          render={() => <Members />}
        />,
        <Route
          key="member-profile"
          exact
          path="/members/:ethereumAddress"
          render={() => <MemberProfile />}
        />,
        <Route
          key="dao-manager"
          exact
          path="/dao-manager"
          render={() => <AdapterOrExtensionManager />}
        />,
        <Route
          key="coupon-onboarding"
          exact
          path="/onboard"
          render={() => <CouponOnboarding />}
        />,
        <Route key="no-match" component={NotFound} />,
      ]}
    </Switch>
  );
}
