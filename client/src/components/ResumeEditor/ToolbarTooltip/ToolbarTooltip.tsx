import { Tooltip } from "@base-ui-components/react";
import { JSX } from "react";
import styles from './ToolbarTooltip.module.css';

interface TooltipProps {
  children: JSX.Element,
  tooltipText: string,
}

function ToolbarTooltip({ children, tooltipText }: TooltipProps) {
  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root delay={300}>
          <Tooltip.Trigger render={children} />
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={3}>
              <Tooltip.Popup className={styles.popup}>
                {tooltipText}
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </>
  )
}

export default ToolbarTooltip;
