import React from 'react';
import {useHistory} from 'react-router-dom';

import {DaoConstants} from '../../components/adapters-extensions/enums';
import FadeIn from '../../components/common/FadeIn';
import Proposals from '../../components/proposals/Proposals';
import Wrap from '../../components/common/Wrap';

export default function Membership() {
  /**
   * Their hooks
   */

  const history = useHistory();

  /**
   * Functions
   */

  function handleClickProposalDetails(proposalHash: string) {
    proposalHash && history.push(`/membership/${proposalHash}`);
  }

  /**
   * Render
   */

  return (
    <RenderWrapper>
      <Proposals
        adapterName={DaoConstants.ONBOARDING}
        onProposalClick={handleClickProposalDetails}
      />
    </RenderWrapper>
  );
}

function RenderWrapper(props: React.PropsWithChildren<any>): JSX.Element {
  /**
   * Their hooks
   */

  const history = useHistory();

  /**
   * Functions
   */

  function viewMembers(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    history.push('/members');
  }

  /**
   * Render
   */

  return (
    <Wrap className="section-wrapper">
      <FadeIn>
        <div className="titlebar">
          <h2 className="titlebar__title">Membership</h2>
          <button className="titlebar__action" onClick={viewMembers}>
            View members
          </button>
        </div>

        {/* RENDER CHILDREN */}
        {props.children}
      </FadeIn>
    </Wrap>
  );
}
