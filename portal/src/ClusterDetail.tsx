import { DefaultButton } from '@fluentui/react/lib/Button';
import { IPanelStyles, Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
import React, { useState, useImperativeHandle, useEffect, Component, useRef, forwardRef, MutableRefObject } from "react"
import { IMessageBarStyles, MessageBar, MessageBarType } from '@fluentui/react';
import { AxiosResponse } from 'axios';
import { FetchClusterInfo } from './Request';
import { IClusterDetail } from "./App"

// does the controller need props?
type ClusterDetailPanelProps = {
  csrfToken: MutableRefObject<string>
  name: any
  subscription: any
  resourceGroup: any
  loaded: string
}

interface IClusterDetails {
  key: string
  name: string
  subscription: string
  resourceGroup: string
  id: string
  version: string
  createdDate: string
  provisionedBy: string
  lastModified: string
  state: string
  failed: string
  consoleLink: string
}

interface ClusterDetailComponentProps {
  item: IClusterDetails
  isDataLoaded: boolean
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
}


class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
    // this.state = { item: this.props.item };
  }

  public render() {
    return (
      <div>
        <Shimmer />
        <Shimmer isDataLoaded={this.props.isDataLoaded}>key: {this.props.item.key}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>name: {this.props.item.name}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>subscription: {this.props.item.subscription}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>resourceGroup: {this.props.item.resourceGroup}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>id: {this.props.item.id}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>version: {this.props.item.version}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>createdDate: {this.props.item.createdDate}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>provisionedBy: {this.props.item.provisionedBy}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>lastModified: {this.props.item.lastModified}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>state: {this.props.item.state}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>failed: {this.props.item.failed}</Shimmer>
        <Shimmer isDataLoaded={this.props.isDataLoaded}>consoleLink: {this.props.item.consoleLink}</Shimmer>
      </div>
    );
  }
};

const customPanelStyle: Partial<IPanelStyles> = {
  root: { top: "40px", left: "225px" },
}

const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

export function ClusterDetailPanel(props: {
  csrfToken: MutableRefObject<string>
  currentCluster: IClusterDetail
  onClose: any // TODO: function ptr .. any probably bad
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<ClusterDetailComponent>(null)
  const [fetching, setFetching] = useState("")
  const [resourceID, setResourceID] = useState("")
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false); // panel controls
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const errorBar = (): any => {
    return (
      <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={false}
        onDismiss={() => setError(null)}
        dismissButtonAriaLabel="Close"
        styles={errorBarStyles}
      >
        {error?.statusText}
      </MessageBar>
    )
  }

  // updateData - updates the state of the component
  // can be used if we want a refresh button.
  // api/clusterdetail returns a single item.
  const updateData = (newData: any) => {
    setData(newData)
    if (state && state.current) {
      state.current.setState({ item: newData })
    }
  }

  const _dismissPanel = () => {
    dismissPanel()
    props.currentCluster.clusterName = ""
    props.onClose() // useEffect?
    setDataLoaded(false);
  }

  useEffect(() => {
    const onData = (result: AxiosResponse | null) => {
      if (result?.status === 200) {
        updateData(result.data)
        setDataLoaded(true);
      } else {
        setError(result)
      }
      setFetching(props.currentCluster.clusterName)
    }

    if (fetching === "" && props.loaded === "DONE" && props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchClusterInfo(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData) // TODO: fetchClusterInfo accepts IClusterDetail
    }
  }, [data, fetching, setFetching])


  useEffect(() => {
    if (props.currentCluster.clusterName != "") {
      if (props.currentCluster.clusterName == fetching) {
        openPanel()
        setDataLoaded(true);
      } else {
        setData([])
        setFetching("")
        setDataLoaded(false); // activate shimmer
        openPanel()
      }
    }
  }, [props.currentCluster.clusterName])

  // TODO: props.loaded rename to CSRFTokenAvailable

  return (
    <Panel
      isOpen={isOpen}
      type={PanelType.custom}
      onDismiss={_dismissPanel}
      isBlocking={false}
      styles={customPanelStyle}
      closeButtonAriaLabel="Close"
      headerText={resourceID}
    >
      {error && errorBar()}
      <ClusterDetailComponent
        item={data}
        isDataLoaded={dataLoaded}
      />
    </Panel>
  )
}
