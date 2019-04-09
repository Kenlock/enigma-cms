import React, { Component } from 'react';
import SEOHeader from '../reusables/SEOHeader';
import DropdownMenu from '../reusables/DropdownMenu';
import { TextHeader } from '../reusables/styled';

class MainMenu extends Component {
  render() {
    var staticContext = staticContext || window.__INITIAL_DATA__;

    return <div>
      <SEOHeader title={staticContext.config ?
        staticContext.config.siteName :
        'My Website'}
      description={staticContext.config ?
        staticContext.config.description :
        'Welcome to my website!'}
      image={staticContext.config ?
        staticContext.config.image : ''}/>
      <div>
        <TextHeader>{staticContext.config ?
          staticContext.config.siteName :
          'My Website'}</TextHeader>
        {staticContext.user ?
          <DropdownMenu menuNodes={staticContext.user.roleId === 0 ?
            [{ url: '/admin/config', text: 'Site Settings' },
              { url: '/', text: 'View Front End' },
              { url: '/admin/register_type', text: 'Register Document Type' },
              { url: '', text: 'Edit Document Type...', childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/edit_type/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'New...', childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Existing...', childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              },
              { url: '', text: 'Edit Display Template For...',  childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/edit_template/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
              }] : [{ url: '', text: 'New...', childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/new/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            },{ url: '', text: 'Edit Existing...', childNodes:
                staticContext.docTypes.map((docType) => {
                  return { url: `/admin/edit/${docType.docTypeId}`,
                    text: docType.docTypeName };
                })
            }] } /> : null}
      </div>
    </div>;
  }
}

export default MainMenu;
