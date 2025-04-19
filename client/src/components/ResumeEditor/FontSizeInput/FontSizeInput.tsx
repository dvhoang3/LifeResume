import { NumberField } from "@base-ui-components/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styles from './FontSizeInpput.module.css';
import ToolbarTooltip from "../ToolbarTooltip/ToolbarTooltip";
import { useState } from "react";

interface FontSizeInputProps {
  displayedFontSize: number | null;
  setActiveFontSize: (size: number | null) => void,
  handleDecrementFontSizes: () => void,
  handleIncrementFontSizes: () => void,
}

function FontSizeInput({ displayedFontSize, setActiveFontSize, handleDecrementFontSizes, handleIncrementFontSizes }: FontSizeInputProps) {
  function handleKeyDownEvent(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Enter') return;
    
    e.currentTarget.blur();
  }
  function handleOnBlurEvent(): void {
    console.log(userInputtedFontSize)
  }

  const [userInputtedFontSize, setUserInputtedFontSize] = useState<number | null>(null);

  return (
    <>
      <NumberField.Root className={styles.root}
        value={displayedFontSize}
        onValueChange={(value) => setUserInputtedFontSize(value)}
      >
        <NumberField.Group className={styles.group}>
          <ToolbarTooltip tooltipText="Decrease Font Size (Ctrl+Shift+,)">
            <NumberField.Decrement className={styles.button} onClick={handleDecrementFontSizes}>
              <FaMinus size={10} />
            </NumberField.Decrement>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Font Size">
            <NumberField.Input className={styles.input} onKeyDown={(e) => handleKeyDownEvent(e)} onBlur={handleOnBlurEvent} />
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
