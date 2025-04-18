import { NumberField } from "@base-ui-components/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styles from './FontSizeInpput.module.css';

interface FontSizeInputProps {
  fontSize: number | null;
  setFontSize: (size: number | null) => void,
}

function FontSizeInput({ fontSize, setFontSize }: FontSizeInputProps) {
  return (
    <>
      <NumberField.Root value={fontSize} onValueChange={(size) => setFontSize(size)} className={styles.root}>
        <NumberField.Group className={styles.group}>
          <NumberField.Decrement className={styles.button}>
            <FaMinus size={10} />
          </NumberField.Decrement>
          <NumberField.Input className={styles.input} />
          <NumberField.Increment className={styles.button}>
            <FaPlus size={10} />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </>
  )
}

export default FontSizeInput;
