import { h } from 'preact'; /** @jsx h **/
import { useEffect, useState } from 'preact/hooks';
import { TheRedirect } from '../../the_router';
import { Fedora } from '../../reusables/front_exports';
import InnerHtmlRenderer from '../../utils/inner_html_renderer';
import useFrontContext from '../../hooks/useFrontContext';
import useTheRouterContext from '../../hooks/useTheRouterContext';

function FrontDisplay({ dataParams, urlParams, apiUrl }) {
  let { state: { dataObj } } = useFrontContext({
      dataParams,
      urlParams,
      apiUrl
    }), { match: { params } } = useTheRouterContext(), [,setP] = useState(params);

  useEffect(function() {
    setP(params);
  }, [params]);

  if (dataObj === undefined) return <TheRedirect to='/not-found' />;
  else if (dataObj && dataObj.metadata && dataObj.rendered) {
    return [<Fedora {...dataObj.metadata} />, <div><InnerHtmlRenderer
      innerHtml={dataObj.rendered} /></div>];
  }
  return null;
}

export function FrontCategoryDisplay() {
  let o = {
    dataParams: ['docTypeNamePlural'],
    urlParams: ['docType'],
    apiUrl: function({ docType }) {
      return `documents/get_rendered_documents_by_type_name/${docType}`;
    }
  };
  return <FrontDisplay {...o} />;
}

export function FrontDocumentDisplay() {
  let o = {
    dataParams: ['slug'],
    urlParams: ['docNode'],
    apiUrl: function({ docType, docNode }) {
      return `documents/get_rendered_document_by_type_and_slug/${docType
      }/${docNode}`;
    }
  };
  return <FrontDisplay {...o} />;
}

export function FrontProfileDisplay() {
  let o = {
    dataParams: ['username'],
    urlParams: ['username'],
    apiUrl: function({ username }) {
      return `users/get_user_profile/${username}`;
    }
  };
  return <FrontDisplay {...o} />;
}
