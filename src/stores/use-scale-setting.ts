import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingRecord {
  key: string;
  label: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
  icon: string;
}

interface ScaleSettingState {
  settings: {
    continueWeighing: SettingRecord;
    manualEdit: SettingRecord;
    balanceValue: SettingRecord;
    takeWeighingPhoto: SettingRecord;
    autoPrint: SettingRecord;
  };
  setSetting: (key: string, value: any) => void;
}

export const useScaleSetting = create<ScaleSettingState>()(
  persist<ScaleSettingState>(
    (set) => ({
      settings: {
        continueWeighing: {
          key: 'continueWeighing',
          label: 'Cho phép ghi đè',
          value: false,
          type: 'boolean',
          icon: 'codicon:replace',
        },
        manualEdit: {
          key: 'manualEdit',
          label: 'Cho phép sửa tay',
          value: false,
          type: 'boolean',
          icon: 'fa-solid:edit',
        },

        balanceValue: {
          key: 'balanceValue',
          label: 'Giá trị cân bằng',
          value: 0,
          type: 'number',
          icon: 'material-symbols:balance',
        },

        takeWeighingPhoto: {
          key: 'takeWeighingPhoto',
          label: 'Chụp ảnh khi cân',
          value: false,
          type: 'boolean',
          icon: 'typcn:camera',
        },

        autoPrint: {
          key: 'autoPrint',
          label: 'In tự động',
          value: false,
          type: 'boolean',
          icon: 'ic:sharp-print',
        },
      },
      setSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: { ...state.settings[key], value },
          },
        })),
    }),
    {
      name: 'scale-setting',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
