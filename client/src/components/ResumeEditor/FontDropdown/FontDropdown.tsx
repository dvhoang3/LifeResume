import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import styles from './FontDropdown.module.css'

const fontOptions: string[] = [
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
];

function FontDropdown() {

  return (
    <>
      <Select.Root>
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon>
            <FaAngleDown size={12} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.ScrollUpArrow />
            <Select.Popup>
              {fontOptions.map((font: string) =>
                <Select.Item value={font} key={font}>
                  <Select.ItemIndicator>
                    <FaCheck />
                  </Select.ItemIndicator>
                  <Select.ItemText>
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