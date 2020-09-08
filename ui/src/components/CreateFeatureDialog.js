import React, { useState, useCallback, useRef } from 'react';
import { Dialog, TextInputField } from 'evergreen-ui';

export default function CreateFeatureDialog({ isShown, onClosed, onSubmit }) {
  const [newFeatureName, setFeatureName] = useState('');
  const [featureNameInvalid, setInvalid] = useState(false);
  const nameInputEl = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const handleChange = useCallback(
    ({ target }) => {
      if (!target.value) {
        setInvalid(true);
        return;
      }

      setInvalid(false);
      setFeatureName(target.value);
    },
    [setFeatureName]
  );

  return (
    <Dialog
      isShown={isShown}
      intent="success"
      title="Create new feature"
      confirmLabel="Create"
      hasCancel={false}
      isConfirmLoading={isLoading}
      onOpenComplete={() => {
        setLoading(false);
        nameInputEl.current && nameInputEl.current.focus();
      }}
      onConfirm={() => {
        if (!newFeatureName) {
          setInvalid(true);
        } else {
          setLoading(true);
          onSubmit(newFeatureName);
        }
      }}
      width={'100vw'}
      onCloseComplete={onClosed}
    >
      <TextInputField
        required
        inputHeight={40}
        ref={nameInputEl}
        isInvalid={featureNameInvalid}
        label="Feature name"
        placeholder="e.g. Magic link"
        onChange={handleChange}
      />
    </Dialog>
  );
}
