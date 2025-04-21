import { NumberField } from "@base-ui-components/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styles from './FontSizeInpput.module.css';
import ToolbarTooltip from "../ToolbarTooltip/ToolbarTooltip";
import { useRef } from "react";

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
  function handleOnBlurEvent(e: React.FocusEvent<HTMLInputElement>): void {
    setActiveFontSize(parseInt(e.currentTarget.value));
  }

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  function handlePointerDownEvent(action: () => void): void {
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 100);
    }, 300);
  }
  function handlePointerUpEvent(): void {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (displayedFontSize) {
      setActiveFontSize(displayedFontSize);
    }
  }

  return (
    <>
      <NumberField.Root className={styles.root}
        value={displayedFontSize}
      >
        <NumberField.Group className={styles.group}>
          <ToolbarTooltip tooltipText="Decrease Font Size">
            <button className={styles.button}
              onClick={handleDecrementFontSizes}
              onPointerDown={() => handlePointerDownEvent(handleDecrementFontSizes)}
              onPointerUp={handlePointerUpEvent}
            >
              <FaMinus size={10} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Font Size">
            <NumberField.Input className={styles.input} onKeyDown={(e) => handleKeyDownEvent(e)} onBlur={(e) => handleOnBlurEvent(e)} />
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Increase Font Size">
            <button className={styles.button}
              onClick={handleIncrementFontSizes}
              onPointerDown={() => handlePointerDownEvent(handleIncrementFontSizes)}
              onPointerUp={handlePointerUpEvent}
            >
              <FaPlus size={10} />
            </button>
          </ToolbarTooltip>
        </NumberField.Group>
      </NumberField.Root>
    </>
  )
}

export default FontSizeInput;
