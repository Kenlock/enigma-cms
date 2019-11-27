import React from 'react';
import { Metamorph } from 'react-metamorph';
import TheRedirect from '../../the_router/TheRedirect';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext.js';

function FrontProfileDisplay()
{
  let { state } = useFrontContext({
      dataParams: ['username'],
      urlParams: ['username'],
      apiUrl: function({ username }) {
        return `users/get_user_profile/${username}`;
      }
    }), { dataObj } = state;

  if (dataObj === undefined) return <TheRedirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    let { rendered, metadata } = dataObj;
    return [<Metamorph {...metadata} />,
      <div><InnerHtmlRenderer innerHtml={rendered} /></div>];
  }
  return null;
}

export default FrontProfileDisplay;
