import {useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import {truncateEthAddress} from '../../util/helpers';
import Wrap from '../../components/common/Wrap';
import FadeIn from '../../components/common/FadeIn';
import {Member} from './types';
import {fakeMembers} from './_mockData';

export default function MemberProfile() {
  /**
   * Their hooks
   */

  // Get ethereumAddress for fetching the member.
  // @todo Use this to check that active member exists.
  const {ethereumAddress} = useParams<{ethereumAddress: string}>();
  const history = useHistory();

  /**
   * Variables
   */

  // @todo replace with actual member fetch and member exists check
  const activeMember: Member | undefined = fakeMembers.find(
    (member) => member.address.toLowerCase() === ethereumAddress.toLowerCase()
  );

  /**
   * Effects
   */

  // Navigate to 404
  useEffect(() => {
    if (!activeMember) {
      history.push('/404');
    }
  }, [history, activeMember]);

  /**
   * Render
   */

  if (activeMember) {
    return (
      <RenderWrapper>
        <>
          <div className="memberprofile__header">Member Profile</div>
          <div className="proposaldetails">
            {/* LEFT COLUMN */}

            {/* MEMBER ADDRESS */}
            <div className="memberprofile__left-column">
              <h3>{truncateEthAddress((activeMember as Member).address, 7)}</h3>
              <div>MemberProfile Info @todo</div>
              <div>MemberProfile Actions @todo</div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="memberprofile__right-column">
              MemberProfile Voting History @todo
            </div>
          </div>
        </>
      </RenderWrapper>
    );
  }

  // Render nothing. Should never reach this case.
  return <></>;
}

function RenderWrapper(props: React.PropsWithChildren<any>): JSX.Element {
  /**
   * Their hooks
   */

  const history = useHistory();

  /**
   * Functions
   */

  function viewAll(event: React.MouseEvent<HTMLButtonElement>) {
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
          <h2 className="titlebar__title">Members</h2>
          <button className="titlebar__action" onClick={viewAll}>
            View all
          </button>
        </div>

        {/* RENDER CHILDREN */}
        {props.children}
      </FadeIn>
    </Wrap>
  );
}
