import React from 'react';
import styled from 'styled-components';
import useGeneralContext from '../hooks/useGeneralContext';

function SamePageAnchor({
  children, href, target, className, id, style, component
}) {
  let { generalState, setGeneralState } = useGeneralContext(),
    Anchor = component || styled.a``, AlreadyOn = styled.span`
    text-decoration: underline;
    font-weight: 900;
    margin: 0;
    width: fit-content;
    height: fit-content;
  `;

  function handleClick(event) {
    if (generalState && href.startsWith('/')) {
      let newState = Object.assign({}, generalState);
      event.preventDefault();
      newState.history.push(href);
      setGeneralState(newState);
    }
  }

  return (generalState && generalState.history &&
    generalState.history.location.pathname !== href) ?
    <Anchor {...{ href, target, className, id, style
    }} onClick={handleClick}>{children}</Anchor> :
    <AlreadyOn>{children}</AlreadyOn>;
}

export default SamePageAnchor;
