import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';

class RegisterDocType extends Component {
  constructor(props) {
    super(props);

    this.updateParams = this.updateParams.bind(this);

    this.state = {
      optionParams: ['']
    }
  }

  updateParams(values) {
    this.setState({
      optionParams: values.attributes.map(attr => ({
        attrName: attr.attrName,
        attrType: attr.attrType
      }))
    });
  }

  render() {
    return <GeneratedForm title="Register Document Type" params={{
      docTypeName: {
        label: 'Document Type Name',
        type: 'text'
      },
      attributes: {
        label: 'Attributes',
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
          minimum: {
            label: 'Minimum',
            type: (value) => {
              console.log(value);
              return (value && value.attrType === 'date') ?
                'date' : 'number'
            }
          },
          maximum: {
            label: 'Maximum',
            type: (value) => (value && value.attrType === 'date') ?
              'date' : 'number'
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
    formAction={(process.env.SERVER_URL || 'http://localhost:' +
    (process.env.SERVER_PORT || 8080)) + '/api/documents/register_type'} />;
  }
}

export default RegisterDocType;
