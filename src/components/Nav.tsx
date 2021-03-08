import React, {useState} from 'react';
import {Transition} from 'react-transition-group';
import ReactModal from 'react-modal';
import Media from 'react-media';
import {NavLink, useLocation, useHistory} from 'react-router-dom';

import Web3ModalButton from './web3/Web3ModalButton';
import {useWeb3Modal} from './web3/hooks';
import {ModalLogo} from './logo';
import TimesSVG from '../assets/svg/TimesSVG';
import HamburgerSVG from '../assets/svg/HamburgerSVG';

// see: http://reactcommunity.org/react-transition-group/transition
const duration = 200;

const defaultStyle = {
  transition: '0.1s',
};

const transitionOpeningStyles: Record<string, any> = {
  entering: {right: '-300px'},
  entered: {right: 0},
  exiting: {right: 0, opacity: 0},
  exited: {right: '-300px', opacity: 0},
};

const transitionClosingStyles: Record<string, any> = {
  entering: {right: 0, opacity: 1},
  entered: {right: '-300px', opacity: 1},
  exiting: {right: '-300px', opacity: 1},
  exited: {right: 0, opacity: 1},
};

// Nav links displayed on the landing page and main pages
export function NavLinks() {
  return (
    <nav role="navigation" id="navigation">
      <ul className="nav__list" data-testid="nav__list">
        <li tabIndex={0}>
          <NavLink to="/membership">
            <span>Membership</span>
          </NavLink>
        </li>
        <li tabIndex={0}>
          <NavLink to="/governance-proposals">
            <span>Governance</span>
          </NavLink>
        </li>
        <li tabIndex={0}>
          <NavLink to="/transfers">
            <span>Transfer</span>
          </NavLink>
        </li>
        <li tabIndex={0}>
          <NavLink to="/tributes">
            <span>Tribute</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default function Nav() {
  /**
   * State
   */

  const [shouldShowMenuModal, setShouldShowMenuModal] = useState(false);
  const [transitionStyles, setTransitionStyles] = useState<Record<string, any>>(
    transitionOpeningStyles
  );

  /**
   * Their hooks
   */

  const location = useLocation();
  const history = useHistory();

  /**
   * Our hooks
   */

  const {account} = useWeb3Modal();

  /**
   * Variables
   */

  const isIndexPath = location.pathname === '/';

  /**
   * Functions
   */

  function handleMenuModalClose(close: boolean) {
    // delay transition for closing
    if (close) {
      setShouldShowMenuModal(close);
      setTransitionStyles(transitionOpeningStyles);
    } else {
      setTransitionStyles(transitionClosingStyles);
      const closeMenu = setTimeout(() => setShouldShowMenuModal(close), 500);
      return () => clearTimeout(closeMenu);
    }
  }

  /**
   * Render
   */

  return (
    <>
      <Media query="(max-width: 62em)">
        {(matches: boolean) => (
          <div className="nav-header">
            <div className="nav-header__menu-container">
              {/* NAV */}
              {!isIndexPath && <NavLinks />}

              <div tabIndex={0} className="nav__hamburger-wrapper">
                <div
                  className="nav__hamburger"
                  aria-label="Menu"
                  aria-controls="navigation"
                  onClick={(event) => {
                    event.preventDefault();
                    handleMenuModalClose(true);
                  }}>
                  <HamburgerSVG />
                </div>
              </div>
              <div className="nav-header__walletconnect-button-container">
                <Web3ModalButton showWalletETHBadge />
              </div>
            </div>
          </div>
        )}
      </Media>
      {/** MODAL MENU */}
      <ReactModal
        ariaHideApp={false}
        className="nav-modal-container"
        isOpen={shouldShowMenuModal}
        onRequestClose={() => {
          handleMenuModalClose(false);
        }}
        overlayClassName="nav-modal-overlay"
        role="dialog"
        style={{overlay: {zIndex: '99'}} as any}>
        <Transition appear in={shouldShowMenuModal} timeout={duration}>
          {(transition) => (
            <nav role="navigation" id="navigation">
              <div
                style={{
                  ...defaultStyle,
                  ...transitionStyles[transition],
                }}
                className="nav-modal">
                <button
                  className="modal__close-button modal__close-button--icon"
                  onClick={(event) => {
                    event.preventDefault();
                    handleMenuModalClose(false);
                  }}>
                  <TimesSVG />
                </button>

                <ModalLogo />

                <div className="nav-modal__walletconnect-button-container">
                  <Web3ModalButton showWalletETHBadge />
                  <button
                    className="button"
                    onClick={() => {
                      handleMenuModalClose(false);
                      history.push('/join');
                    }}>
                    Join
                  </button>
                </div>
                <ul className="nav__list">
                  <li
                    onClick={() => {
                      handleMenuModalClose(false);
                    }}>
                    <NavLink to="/membership">
                      <span>Membership</span>
                    </NavLink>
                  </li>
                  <li
                    onClick={() => {
                      handleMenuModalClose(false);
                    }}>
                    <NavLink to="/governance-proposals">
                      <span>Governance</span>
                    </NavLink>
                  </li>
                  <li
                    onClick={() => {
                      handleMenuModalClose(false);
                    }}>
                    <NavLink to="/transfers">
                      <span>Transfer</span>
                    </NavLink>
                  </li>
                  <li
                    onClick={() => {
                      handleMenuModalClose(false);
                    }}>
                    <NavLink to="/tributes">
                      <span>Tribute</span>
                    </NavLink>
                  </li>
                  <li
                    onClick={() => {
                      handleMenuModalClose(false);
                    }}>
                    {/* @todo Add docs link when it's ready */}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" rel="noopener noreferrer" target="_blank">
                      <span>Help</span>
                    </a>
                  </li>
                  {/* @todo Display Profile link only if user is an active member */}
                  {account && (
                    <li
                      className="link-separated"
                      onClick={() => {
                        handleMenuModalClose(false);
                      }}>
                      <NavLink to={`/members/${account}`}>
                        <span>Profile</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
          )}
        </Transition>
      </ReactModal>
    </>
  );
}
