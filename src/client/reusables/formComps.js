import { createElement } from 'preact'; /** @jsx h **/
import fromCss from '../utils/component_from_css';
import CodeEditor from './CodeEditor';

export const FormContainer = fromCss('div', 'width:100%;');

export const FormBackground = fromCss('form',
  'background-color:cadetblue;width:45%;margin:auto;text-align:left;');

export const FormDiv = fromCss('div', ({ hidden }) => 'padding:8px;' +
    `display:${hidden ? 'none' : 'block'};`, ['hidden']);

export const FormHeader = fromCss('h2',
  'text-align:center;font-family:sans-serif;');

export const FormSubmit = fromCss('input',
  'font-family:sans-serif;text-transform:uppercase;margin:8px;border-radius:8px;font-size:16px;');

export const FormErrorMessage = fromCss('p',
  'font-family:sans-serif;text-transform:uppercase;text-align:center;');

let FormInput = fromCss('input', ({ hidden, isInvalid }) => (
    'border-radius:8px;vertical-align:top;height:16px;width:calc(100% - 16px);margin-top:5px;font-family:sans-serif;font-size:16px;padding:5px;'
    + `display:${hidden ? 'none' : 'block'};` +
      `box-shadow:${isInvalid ? 'red 2px 2px' : 'unset'};`), ['hidden',
    'isInvalid']), FormLabel = fromCss('label', ({ hidden, isInvalid }) => (
    'color:white;font-size:16px;padding-right:4px;font-family:sans-serif;text-transform:uppercase;' +
      `display:${hidden ? 'none' : 'block'};` +
      `text-shadow:${isInvalid ? 'red 2px 2px' : 'unset'};`), ['hidden',
    'isInvalid']), FormSubmitButton = fromCss('button',
    'font-size:16px;font-family:sans-serif;text-transform:uppercase;padding:8px;border-radius:8px;margin:8px;'),
  FormEnumInput = fromCss('select', 'font-family:sans-serif;font-size:16px;',
    ['hidden', 'isInvalid', 'enumList', 'type']), FormEnumInputOption = fromCss('option',
    'font-family:sans-serif;font-size:16px;', ['hidden', 'isInvalid']),
  FormObjectInputLabel = fromCss('p', ({ hidden }) =>
    'color:white;padding-right:4px;font-family:sans-serif;text-transform:uppercase;margin:8px;font-size:16px;width:calc(100% - 16px);' +
    `display:${hidden ? 'none' : 'block'};`,
  ['hidden', 'isInvalid']);

export default {
  FormInput,
  FormLabel,
  CodeEditor,
  FormSubmitButton,
  FormEnumInput,
  FormEnumInputOption,
  FormObjectInputLabel
};
