import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import React, { useState, useImperativeHandle, useEffect, forwardRef, MutableRefObject } from "react"

type ClusterDetailProps = {
  csrfToken: MutableRefObject<string>
}

export const ClusterDetail = forwardRef<any, ClusterDetailProps>(({ csrfToken }, ref) => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [resourceID, setResourceID] = useState("")

  useImperativeHandle(ref, () => ({
    LoadClusterDetailPanel: (item: any) => {
      setResourceID(item.name)
      openPanel()
    },
  }))

  return (
    <Panel
      isLightDismiss
      isOpen={isOpen}
      type={PanelType.large}
      onDismiss={dismissPanel}
      closeButtonAriaLabel="Close"
      headerText={resourceID}
    >
      <p>Test data</p>
    </Panel>
  );
});
