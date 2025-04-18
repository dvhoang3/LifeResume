import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import styles from './FontDropdown.module.css'

interface FontDropdownProps {
  selectedFont: string | null,
  setFont: React.Dispatch<React.SetStateAction<string | null>>,
}

export const fontOptions: string[] = [
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
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon>
            <FaAngleDown size={12} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner sideOffset={3}>
            <Select.ScrollUpArrow />
            <Select.Popup className={styles.popup}>
              {fontOptions.map((font: string) =>
                <Select.Item className={styles.item} value={font} key={font}>
                  <Select.ItemIndicator className={styles.itemIndicator}>
                    <FaCheck size={12} />
                  </Select.ItemIndicator>
                  <Select.ItemText className={styles.itemText}>
                    {font}
                  </Select.ItemText>
                </Select.Item>
              )}
            </Select.Popup>
            <Select.ScrollDownArrow />
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </>
  )
}

export default FontDropdown;