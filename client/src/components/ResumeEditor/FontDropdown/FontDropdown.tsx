import { Select } from "@base-ui-components/react";
import { FaAngleDown, FaCheck } from "react-icons/fa";

function FontDropdown() {
  return (
    <>
     <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Sans-serif" />
        <Select.Icon>
          <FaAngleDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={8}>
          <Select.ScrollUpArrow />
          <Select.Popup>
            <Select.Item value="sans">
              <Select.ItemIndicator>
                <FaCheck />
              </Select.ItemIndicator>
              <Select.ItemText>
                Sans-serif
              </Select.ItemText>
            </Select.Item>
            <Select.Item value="serif">
              <Select.ItemIndicator>
                <FaCheck />
              </Select.ItemIndicator>
              <Select.ItemText>Serif</Select.ItemText>
            </Select.Item>
            <Select.Item value="mono">
              <Select.ItemIndicator>
                <FaCheck />
              </Select.ItemIndicator>
              <Select.ItemText>
                Monospace
              </Select.ItemText>
            </Select.Item>
            <Select.Item value="cursive">
              <Select.ItemIndicator>
                <FaCheck />
              </Select.ItemIndicator>
              <Select.ItemText>Cursive</Select.ItemText>
            </Select.Item>
          </Select.Popup>
          <Select.ScrollDownArrow />
        </Select.Positioner>
      </Select.Portal>
     </Select.Root>
    </>
  )
}

export default FontDropdown;