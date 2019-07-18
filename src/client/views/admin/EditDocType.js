import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { GeneratedForm } from '../../reusables';
import { get as axget } from 'axios';

let EditDocType = ({ match: {
  params: { docTypeId }
}, staticContext }) => {
  let [state, setState] = useState({
      docType: docTypeId ? (staticContext.docType && docTypeId &&
      staticContext.docType.docTypeId === parseInt(docTypeId) &&
        staticContext.docType || null) : undefined,
      optionParams: staticContext.docType && docTypeId &&
      staticContext.docType.docTypeId === parseInt(docTypeId) &&
      staticContext.docType.attributes &&
      staticContext.docType.attributes.length
      && staticContext.docType.attributes.map(
        ({ attrName, attrType }) => ({
          attrName, attrType
        })) || ['']
    }), minMax = {
      type: (value) => (value === 'date') ? 'date' : 'number',
      attrDepends: { type: ['attributes.$.attrType'] }
    };

  function updateParams({ attributes }) {
    var newState = Object.assign({}, state);
    newState.optionParams = attributes.map(({ attrName, attrType }) => ({
      attrName, attrType
    }));
    setState(newState);
  }

  useEffect(function() {
    let { docType } = staticContext;
    if (!docType || (docType && docType.docTypeId !== parseInt(docTypeId))) {
      axget(`/api/documents/get_type/${docTypeId}`).then(({ data }) => {
        setState({
          docType: data,
          optionParams: data.attributes.map(({
            attrName, attrType }) => ({
            attrName, attrType
          }))
        });
      });
    }
  }, []);

  let { docType, optionParams } = state;

  if (docType !== null) {
    return <GeneratedForm currentValue={docType} title="Edit Document Type"
      params={{
        docTypeName: {
          label: 'Document Type Name',
          type: 'text',
        },
        docTypeNamePlural: {
          label: 'Document Type Name Plural',
          type: 'text'
        },
        attributes: {
          label: 'Attributes',
          type: '[object]',
          shape: {
            attrName: {
              label: 'Attribute Name',
              type: 'text'
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
            minimum: minMax,
            maximum: minMax,
            grammar: {
              label: 'Grammar',
              type: 'enum',
              enumList: [
                { text: '(None)', value: '' },
                { text: 'HTML', value: 'html' },
                { text: 'CSS', value: 'css' }
              ]
            },
            enumList: {
              label: 'Options',
              type: '[text]',
            }
          }
        },
        slugFrom: {
          label: 'Generate Slug From',
          type: 'enum',
          enumList: optionParams ?
            [{ text: '(None)', value: '' },
              optionParams.map(({ attrName }) => ({
                text: attrName, value: attrName
              }))].flat() : [
              { text: '(None)', value: '' }
            ],
          value: ''
        } }} method="post" parentCallback={updateParams} redirectUrl='/admin'
      formAction={docTypeId ? `/api/documents/update_type/${docTypeId}`
        : '/api/documents/register_type'}/>;
  }
  return null;
};

EditDocType.propTypes = {
  match: object,
  staticContext: object
};

export default EditDocType;
