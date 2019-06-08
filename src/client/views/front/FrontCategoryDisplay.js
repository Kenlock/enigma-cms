import React from 'react';
import { object } from 'prop-types';
import Handlebars from 'handlebars';
import { Redirect } from 'react-router-dom';
import { Metamorph } from 'react-metamorph';

function FrontCategoryDisplay({ staticContext }) {
  let { config, dataObj } = staticContext;
  if (!dataObj) return <Redirect to='/not-found' />;
  let  { categoryTemplateBody, items, typeName } = dataObj;

  if (categoryTemplateBody && items) {
    config.shortcodes.forEach(
      function(shortcode) {
        Handlebars.registerHelper(shortcode.name,
          new Function(shortcode.args.join(','), shortcode.code));
      });

    let template = Handlebars.compile(categoryTemplateBody),
      newItems = items.map(item => ({
        ...item.content,
        slug: item.slug,
        createdAt: item.createdAt,
        editedAt: item.editedAt
      }));
    return [<Metamorph title={
      `${typeName.charAt(0).toUpperCase() +
        typeName.slice(1)} | ${config.siteName}`}
    description={
      `${typeName.charAt(0).toUpperCase() +
        typeName.slice(1)} on ${config.siteName}`} />,
    <div dangerouslySetInnerHTML=
      {{ __html: template({ items: newItems }) }} />];
  }

  return <Redirect to='/not-found' />;
}

FrontCategoryDisplay.propTypes = {
  match: object,
  staticContext: object
}

export default FrontCategoryDisplay;
