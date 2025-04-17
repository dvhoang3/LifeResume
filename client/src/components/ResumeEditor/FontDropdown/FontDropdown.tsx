import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import styles from './FontDropdown.module.css'

interface FontDropdownProps {
  selectedFont: string | null,
  setEditorFontHandler: (font: string) => void,
}

export const fontOptions: string[] = [
  'Calibri',
  'Arial',
  'Cambria',
  'Times New Roman',
  'Garamond',
  'Trebuchet MS',
  'Book Antiqua',
  'Arial Narrow',
  'Georgia',
  'Helvetica',
  'Verdana',
].sort((a, b) => a.localeCompare(b));

function FontDropdown({ selectedFont, setEditorFontHandler }: FontDropdownProps) {  
  return (
    <>
      <Select.Root value={selectedFont} onValueChange={(value) => setEditorFontHandler(value)}>
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