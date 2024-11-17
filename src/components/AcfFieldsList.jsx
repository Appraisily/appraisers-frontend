import React from 'react';
import AcfField from './AcfField';
import './AcfFieldsList.css';

const ACF_FIELDS_TO_DISPLAY = [
  'value', 'description', 'main', 'signature', 'age', 'similar', 'customer_email', 
  'secondary_email', 'customer_name', 'customer_address', 'session_id', 'googlevision', 
  '_gallery_populated', 'table', 'ad_copy', 'age_text', 'age1', 'condition', 
  'signature1', 'signature2', 'style', 'valuation_method', 'authorship', 'conclusion1', 
  'conclusion2', 'test', 'pdflink', 'doclink', 'glossary', 'shortcodes_inserted'
];

const TEXTAREA_FIELDS = [
  'customer_description', 'iaDescription', 'customer_address', 'ad_copy',
  'conclusion1', 'conclusion2', 'glossary', 'description'
];

const AcfFieldsList = ({ acfData, images, onFieldUpdate }) => {
  const validateField = (fieldName, value) => {
    if (!value || value.trim() === '') {
      throw new Error('Field value cannot be empty');
    }

    if (['main', 'signature', 'age'].includes(fieldName)) {
      try {
        new URL(value);
      } catch (_) {
        throw new Error('Please enter a valid URL for images');
      }
    }

    const emailFields = ['customer_email', 'secondary_email'];
    if (emailFields.includes(fieldName)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Please enter a valid email address');
      }
    }

    if (fieldName === 'value') {
      if (isNaN(value) || Number(value) <= 0) {
        throw new Error('Appraisal Value must be a positive number');
      }
    }

    return true;
  };

  return (
    <ul id="acf-fields-list">
      {ACF_FIELDS_TO_DISPLAY.map(fieldName => {
        let fieldValue = 'N/A';

        if (acfData[fieldName] !== undefined && acfData[fieldName] !== null) {
          if (['main', 'signature', 'age'].includes(fieldName)) {
            fieldValue = images[fieldName] || '';
          } else {
            fieldValue = acfData[fieldName];
          }
        }

        return (
          <AcfField
            key={fieldName}
            fieldName={fieldName}
            fieldValue={fieldValue}
            isTextarea={TEXTAREA_FIELDS.includes(fieldName)}
            isImage={['main', 'signature', 'age'].includes(fieldName)}
            onSave={async (value) => {
              try {
                validateField(fieldName, value);
                await onFieldUpdate(fieldName, value);
              } catch (error) {
                alert(error.message);
              }
            }}
          />
        );
      })}
    </ul>
  );
};

export default AcfFieldsList;