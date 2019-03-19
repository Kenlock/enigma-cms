import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class ConfigPage extends Component {
  static propTypes = {
    config: PropTypes.object
  }

  render() {
    return <GeneratedForm title="Site Settings" params={{
      siteName: {
        type: 'text',
        label: 'Site Name',
        value: this.props.config ? this.props.config.siteName : ''
      },
      description: {
        type: 'text',
        label: 'Site Description',
        value: this.props.config ? this.props.config.description : ''
      },
      aboutBody: {
        type: 'text',
        label: 'About Body',
        value: this.props.config ? this.props.config.aboutBody : ''
      },
      stylesheet: {
        type: 'text',
        label: 'Stylesheet',
        grammar: 'css',
        value: this.props.config ? this.props.config.stylesheet : ''
      },
      profileTemplate: {
        type: 'text',
        label: 'Profile Template',
        grammar: 'html',
        value: this.props.config ? this.props.config.profileTemplate : ''
      },
      menuLinks: {
        type: '[object]',
        label: 'Menu Links',
        shape: {
          linkText: {
            type: 'text',
            label: 'Link Text'
          },
          linkUrl: {
            type: 'text',
            label: 'Link URL'
          }
        },
        value: this.props.config && this.props.config.menuLinks || [
          {
            linkText: '',
            linkUrl: ''
          }
        ]
      },
      useSlug: {
        type: 'enum',
        label: 'Use Slug',
        enumList: [{
          text: 'Yes', value: true }, {
          text: 'No', value: false
        }],
        value: this.props.config !== undefined ?
          this.props.config.useSlug : false
      },
      shortcodes: {
        type: '[object]',
        label: 'Shortcodes',
        shape: {
          name: {
            type: 'text',
            label: 'Name'
          },
          args: {
            type: 'text',
            label: 'Args (comma-separated)'
          },
          code: {
            type: 'text',
            label: 'Body',
            grammar: 'js'
          }
        },
        value: this.props.config && this.props.config.shortcodes || [{
          name: '',
          args: '',
          code: ''
        }]
      }
    }} method="post"
    formAction={urlUtils.serverInfo.path('/api/site_config/update')} />
  }
}

export default ConfigPage;
