import React, { Component } from 'react';
import GeneratedForm from '../../reusables/GeneratedForm';
import { default as urlUtils } from '../../../lib/utils';

class RegisterDocType extends Component {
  constructor(props) {
    super(props);

    this.updateParams = this.updateParams.bind(this);
    this.minMax = this.minMax.bind(this);
    this.state = {
      optionParams: ['']
    }
  }

  redirect() {
    window.location.href = '/admin';
  }

  updateParams(values) {
    this.setState({
      optionParams: values.attributes.map(attr => ({
        attrName: attr.attrName,
        attrType: attr.attrType
      }))
    });
  }

  minMax(value) {
    return (value.attrType === 'date') ?
      'date' : 'number';
  }

  render() {
    let minMax = this.minMax;

    return <GeneratedForm title="Register Document Type" params={{
      docTypeName: {
        label: 'Document Type Name',
        type: 'text'
      },
      attributes: {
        type: '[object]',
        shape: {
          attrName: {
            label: 'Attribute Name',
            type: 'text',
          },
          attrType: {
            label: 'Attribute Type',
            type: 'enum',
            enumList: [
              { 'text': 'Text', 'value': 'text' },
              { 'text': 'Datetime', 'value': 'date' },
              { 'text': 'Number', 'value': 'number' }
            ]
          },
          enumList: {
            label: 'Options',
            type: '[text]',
          },
          minimum: {
            type: minMax
          },
          maximum: {
            type: minMax
          },
          grammar: {
            type: 'enum',
            enumList: [
              { text: '(None)', value: '' },
              { text: 'HTML', value: 'html' },
              { text: 'CSS', value: 'css' }
            ]
          }
        }
      },
      slugFrom: {
        label: 'Generate Slug From',
        type: 'enum',
        enumList: [{ text: '(None)', value: '' },
          this.state.optionParams.map(param => ({
            text: param.attrName, value: param.attrName
          }))].flat() || [
          { text: '(None)', value: '' }
        ]
      }
    }} method="post" parentCallback={this.updateParams}
    successCallback={this.redirect}
    formAction={urlUtils.info.path('/api/documents/register_type')} />;
  }
}

export default RegisterDocType;
