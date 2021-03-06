import { h } from 'preact'; /** @jsx h **/
import { GeneratedForm } from '../../reusables/back_exports';
import useStaticContext from '../../hooks/useStaticContext';

export default function ConfigPage() {
  let { config } = useStaticContext(['config']);

  return <GeneratedForm title="Site Settings" currentValue={config}
    params={{
      siteName: { type: 'text' },
      iconFile: { type: 'file' },
      fileContent: { type: 'string', hidden: 'true' },
      description: { type: 'text', label: 'Site Description', },
      aboutBody: { type: 'text' },
      stylesheet: { type: 'text', grammar: 'css' },
      profileTemplate: { type: 'text', grammar: 'html' },
      menuLinks: {
        type: '[object]',
        shape: {
          linkText: { type: 'text' },
          linkUrl: { type: 'text' }
        }
      },
      useSlug: {
        type: 'enum',
        enumList: [{ text: 'Yes', value: true }, { text: 'No', value: false }]
      },
      shortcodes: {
        type: '[object]',
        shape: {
          name: { type: 'text' },
          args: { type: '[text]', label: 'Arguments' },
          code: { type: 'text', label: 'Body', grammar: 'js' }
        }
      },
      keywords: { type: '[text]' },
      gaTrackingId: { type: 'text' },
      language: {
        type: 'enum',
        enumList: [
          { text: 'English', value: 'en' },
          { text: '中文', value: 'zh' }]
      },
      themeColor: {
        type: 'color'
      },
      adSenseId: {
        type: 'text',
        label: 'Adsense ID'
      }
    }} redirectUrl='/admin' formAction='site_config/update' />
}
