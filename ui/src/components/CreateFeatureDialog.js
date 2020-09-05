import React, { useState, useCallback } from 'react';
import { Dialog, TextInputField, Button } from 'evergreen-ui';

export default function CreateFeatureDialog({ isShown, onClosed, onSubmit }) {
  const [newFeatureName, setFeatureName] = useState('');
  const [featureNameInvalid, setInvalid] = useState(false);
  const [ isLoading, setLoading ] = useState(false);

  const handleChange = useCallback(
    ({ target }) => {
      if (!target.value) {
        setInvalid(true);
        return;
      }

      setInvalid(false);
      setFeatureName(target.value);
    },
    [newFeatureName]
  );

  return (
    <Dialog
      isShown={isShown}
      intent="success"
      title="Create new feature"
      confirmLabel="Create"
      hasCancel={false}
      isConfirmLoading={isLoading}
      onOpenComplete={() => setLoading(false)}
      onConfirm={() => {
        if (!newFeatureName) {
          setInvalid(true);
        } else {
          setLoading(true);
          onSubmit(newFeatureName);
        }
      }}
      width={'100vw'}
      onCloseComplete={onClosed}>
      <TextInputField
        required
        isInvalid={featureNameInvalid}
        label="Feature name"
        placeholder="e.g. Magic link"
        onChange={handleChange}
      />
    </Dialog>
  );
}
