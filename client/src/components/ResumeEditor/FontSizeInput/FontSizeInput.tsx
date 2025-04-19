import { NumberField } from "@base-ui-components/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styles from './FontSizeInpput.module.css';
import ToolbarTooltip from "../ToolbarTooltip/ToolbarTooltip";

interface FontSizeInputProps {
  fontSize: number | null;
  setFontSize: (size: number | null) => void,
  handleDecrementFontSizes: () => void,
  handleIncrementFontSizes: () => void,
}

function FontSizeInput({ fontSize, setFontSize, handleDecrementFontSizes, handleIncrementFontSizes }: FontSizeInputProps) {
  function handleKeyDownEvent(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') e.currentTarget.blur();
  }

  return (
    <>
      <NumberField.Root className={styles.root}
        value={fontSize}
        onValueChange={(size) => setFontSize(size)}
      >
        <NumberField.Group className={styles.group}>
          <ToolbarTooltip tooltipText="Decrease Font Size (Ctrl+Shift+,)">
            <NumberField.Decrement className={styles.button} onClick={handleDecrementFontSizes}>
              <FaMinus size={10} />
            </NumberField.Decrement>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Font Size">
            <NumberField.Input className={styles.input} onKeyDown={(e) => handleKeyDownEvent(e)} />
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Increase Font Size (Ctrl+Shift+.)">
            <NumberField.Increment className={styles.button} onClick={handleIncrementFontSizes}>
              <FaPlus size={10} />
            </NumberField.Increment>
          </ToolbarTooltip>
        </NumberField.Group>
      </NumberField.Root>
    </>
  )
}

export default FontSizeInput;
