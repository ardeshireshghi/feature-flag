import React, { useState, useCallback, useRef } from 'react';
import { Dialog, TextInputField, Textarea, Label, Pane } from 'evergreen-ui';

export default function CreateProductDialog({ isShown, onClosed, onSubmit }) {
  const [newProductAttributes, setProductAttributes] = useState({});
  const [productNameInvalid, setNameInvalid] = useState(false);
  const nameInputEl = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const handleNameChange = useCallback(
    ({ target }) => {
      if (!target.value) {
        setNameInvalid(true);
        return;
      }

      setNameInvalid(false);
      setProductAttributes(prevAttrs => ({ ...prevAttrs, name: target.value }));
    },
    [setProductAttributes]
  );

  const handleDescriptionChange = useCallback(
    ({ target }) => {
      setProductAttributes(prevAttrs => ({ ...prevAttrs, description: target.value }));
    },
    [setProductAttributes]
  );

  return (
    <Dialog
      isShown={isShown}
      intent="success"
      title="Create new product"
      confirmLabel="Create"
      hasCancel={false}
      isConfirmLoading={isLoading}
      onOpenComplete={() => {
        setLoading(false);
        nameInputEl.current && nameInputEl.current.focus();
      }}
      onConfirm={() => {
        if (!newProductAttributes.name) {
          setNameInvalid(true);
        } else {
          setLoading(true);
          onSubmit(newProductAttributes);
        }
      }}
      width={'100vw'}
      onCloseComplete={onClosed}
    >
      <TextInputField
        required
        inputHeight={40}
        isInvalid={productNameInvalid}
        label="Product name"
        placeholder="e.g. Email app"
        onChange={handleNameChange}
        ref={nameInputEl}
      />
      <Pane>
        <Label htmlFor="description" marginBottom={4} display="block">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="e.g. This product is used for internal users"
          onChange={handleDescriptionChange}
        />
      </Pane>
    </Dialog>
  );
}
