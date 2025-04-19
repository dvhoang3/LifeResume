import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import styles from './FontDropdown.module.css';
import ToolbarTooltip from "../ToolbarTooltip/ToolbarTooltip";

interface FontDropdownProps {
  displayedFont: string | null,
  setActiveFont: (font: string) => void,
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

function FontDropdown({ displayedFont, setActiveFont }: FontDropdownProps) {  
  return (
    <>
      <Select.Root value={displayedFont} onValueChange={(font) => setActiveFont(font)}>
        <ToolbarTooltip tooltipText="Font">
          <Select.Trigger className={styles.trigger}>
            <Select.Value style={{ fontFamily: displayedFont ?? '' }} className={styles.value} />
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