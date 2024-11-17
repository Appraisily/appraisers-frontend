import React, { useState, useEffect, useRef } from 'react';
import './AcfField.css';

const AcfField = ({ fieldName, fieldValue, isTextarea, isImage, onSave }) => {
  const [value, setValue] = useState(fieldValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    setValue(fieldValue);
  }, [fieldValue]);

  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [value]);

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (isTextarea) {
      autoResizeTextarea(e.target);
    }
  };

  const handleSave = async () => {
    await onSave(value);
  };

  return (
    <li>
      <span className="field-name">{fieldName}</span>
      {isTextarea ? (
        <textarea
          ref={textareaRef}
          className="field-value"
          value={value}
          onChange={handleChange}
        />
      ) : (
        <input
          type="text"
          className="field-value"
          value={value}
          onChange={handleChange}
          placeholder={isImage ? 'URL de la imagen' : ''}
        />
      )}
      <button className="edit-button" onClick={handleSave}>
        Save
      </button>
    </li>
  );
};

export default AcfField;