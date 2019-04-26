import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from '../../reusables/DropdownMenu';

class MainMenu extends Component {
  static propTypes = {
    staticContext: PropTypes.object
  };

  render() {
    let staticContext = this.props.staticContext,
      isAdmin = staticContext.user && staticContext.user.roleId === 0 || false,
      menuNodes = [];
    if (isAdmin) menuNodes.push({ url: '/admin/edit-config',
      text: 'Site Settings' }, { url: '/admin/register-type',
      text: 'Register Document Type' }, {
      url: '', text: 'Edit Document Type...', childNodes:
          staticContext.types.map((docType) => {
            return { url: `/admin/edit-type/${docType.docTypeId}`,
              text: docType.docTypeName };
          })
    });

    menuNodes.push({ url: '', text: 'New...', childNodes:
          staticContext.types.map((docType) => {
            return { url: `/admin/new/${docType.docTypeId}`,
              text: docType.docTypeName };
          })
    },
    { url: '', text: 'Edit Existing...', childNodes:
          staticContext.types.map((docType) => {
            return { url: `/admin/edit/${docType.docTypeId}`,
              text: docType.docTypeName };
          })
    },
    { url: '', text: 'Edit Display Template For...',  childNodes:
          staticContext.types.map((docType) => {
            return { url: `/admin/edit-template/${docType.docTypeId}`,
              text: docType.docTypeName };
          })
    }, {
      url: '/admin/file-mgmt', text: 'Manage Files'
    }, {
      url: '/admin/upload-file', text: 'Upload File'
    });

    return <div>
      {staticContext.user ?
        <DropdownMenu menuNodes={menuNodes} /> : null}
    </div>;
  }
}

export default MainMenu;
