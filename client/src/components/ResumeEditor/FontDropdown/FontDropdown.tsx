import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import styles from './FontDropdown.module.css';
import ToolbarTooltip from "../ToolbarTooltip/ToolbarTooltip";

interface FontDropdownProps {
  selectedFont: string | null,
  setFont: (font: string | null) => void,
}

const fontOptions: string[] = [
  'Arial',
  'Arial Narrow',
  'Book Antiqua',
  'Calibri',
  'Cambria',
  'Garamond',
  'Georgia',
  'Helvetica',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

function FontDropdown({ selectedFont, setFont }: FontDropdownProps) {  
  return (
    <>
      <Select.Root value={selectedFont} onValueChange={(font) => setFont(font)}>
        <ToolbarTooltip tooltipText="Font">
          <Select.Trigger className={styles.trigger}>
            <Select.Value style={{ fontFamily: selectedFont ?? '' }} className={styles.value} />
            <Select.Icon>
              <FaAngleDown size={12} />
            </Select.Icon>
          </Select.Trigger>
        </ToolbarTooltip>

        <Select.Portal>
          <Select.Positioner sideOffset={3} align="start">
            <Select.Popup className={styles.popup}>
              {fontOptions.map((font: string) =>
                <Select.Item className={styles.item} value={font} key={font}>
                  <Select.ItemIndicator className={styles.itemIndicator}>
                    <FaCheck size={12} />
                  </Select.ItemIndicator>
                  <Select.ItemText className={styles.itemText} style={{ fontFamily: font }}>
                    {font}
                  </Select.ItemText>
                </Select.Item>
              )}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </>
  )
}

export default FontDropdown;