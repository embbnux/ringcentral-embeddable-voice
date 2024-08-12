import React, { useEffect, useState } from 'react';

import { RcButton } from '@ringcentral/juno';
import { styled } from '@ringcentral/juno/foundation';

import { BackHeaderView } from '../BackHeaderView';
import { SettingParamInput } from './SettingParamInput';

const StyledPanel = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px 16px;
  overflow-y: auto;
`;

const StyledParamInput = styled(SettingParamInput)`
  margin-bottom: 15px;

  &.RcSwitch-formControlLabel {
    .MuiFormControlLabel-label {
      font-size: 0.875rem;
    }
  }
`;

const StyledButton = styled(RcButton)`
  margin-top: 20px;
`;

function allRequiredFilled(items) {
  let allFilled = true;
  items.forEach((item) => {
    if (
      item.required && (
        item.value === '' ||
        item.value === null ||
        item.value === undefined
      )
    ) {
      allFilled = false;
    }
  });
  return allFilled;
}

export function ThirdPartySettingSection({
  onSave,
  section,
  onBackButtonClick,
}) {
  const [newSection, setNewSection] = useState(section);
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    if (!section || !section.items) {
      return;
    }
    let changed = false;
    section.items.forEach((item, index) => {
      if (item.value !== newSection.items[index].value) {
        changed = true;
      }
    });
    setValueChanged(changed);
  }, [section, newSection]);

  if (!newSection || !newSection.items) {
    return null;
  }

  return (
    <BackHeaderView
      onBack={onBackButtonClick}
      title={section.name}
    >
      <StyledPanel>
        {
          newSection.items.map((setting) => {
            return (
              <StyledParamInput
                setting={setting}
                key={setting.id}
                onChange={(value) => {
                  const newItems = newSection.items.map((item) => {
                    if (item.id === setting.id) {
                      return {
                        ...item,
                        value,
                      };
                    }
                    return item;
                  });
                  setNewSection({
                    ...newSection,
                    items: newItems,
                  });
                }}
              />
            );
          })
        }
        <StyledButton
          fullWidth
          variant="contained"
          radius="round"
          onClick={() => {
            onSave(newSection);
          }}
          color="action.primary"
          disabled={!valueChanged || !allRequiredFilled(newSection.items)}
        >
          Save
        </StyledButton>
      </StyledPanel>
    </BackHeaderView>
  );
}
