import { Shimmer } from '@fluentui/react/lib/Shimmer';
import React, { Component } from "react"
import { Stack, Text, IStackStyles, IStackItemStyles } from '@fluentui/react';
import { contentStackStylesNormal } from "./App"

// TODO: Commented out fields contain complex objects
interface IClusterDetails {
  // apiServer: any
  // architectureVersion: string
  consoleLink: string
  createdAt: string
  createdBy: string
  failedProvisioningState: string
  infraId: string
  // ingressProfiles: any
  lastAdminUpdateError: string
  lastModifiedAt: string
  lastModifiedBy: string
  lastProvisioningState: string
  location: string
  // masterProfile: string
  name: string
  provisioningState: string
  resourceId: string
  // tags: any
  version: string
  // workerProfile: any
}

interface ClusterDetailComponentProps {
  item: IClusterDetails
  clusterName: string
  isDataLoaded: boolean
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
}

const KeyColumnStyle: Partial<IStackStyles> = {
  root: {
    paddingTop: "10px",
    paddingRight: "15px",
  }
}

const ValueColumnStyle: Partial<IStackStyles> = {
  root: {
    paddingTop: "10px",
  }
}

const KeyStyle: IStackItemStyles = {
  root: {
    fontStyle: "bold",
    alignSelf: "flex-start",
    fontVariantAlternates: "bold",
    color: "grey",
    paddingBottom: "10px"
  }
}

const ValueStyle: IStackItemStyles = {
  root: {
    paddingBottom: "10px"
  }
}

export class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
  }

  public render() {
    const ClusterDetailCell = (
      value: any,
    ) => (
      <Shimmer isDataLoaded={this.props.isDataLoaded}>
        <Stack.Item styles={value.style}>
          <Text styles={value.style} variant={'medium'}>{value.value}</Text>
        </Stack.Item>
      </Shimmer>
    );
    const entries = Object.entries(this.props.item)
    return (
      <Stack styles={contentStackStylesNormal}>
        <Text variant="xxLarge">{this.props.clusterName}</Text>
          <Stack horizontal>
            <Stack styles={KeyColumnStyle}>
              {entries.map((value: any, index: number) => (
                  <ClusterDetailCell style={KeyStyle} key={index} value={value[0]}/>
                )
              )}
            </Stack>

            <Stack styles={KeyColumnStyle}>
            {Array(entries.length).fill(':').map((value: any, index: number) => (
                <ClusterDetailCell style={KeyStyle} key={index} value={value}/>
              )
            )}
            </Stack>
            
            <Stack styles={ValueColumnStyle}>
              {entries.map((value: string[], index: number) => (
                  <ClusterDetailCell style={ValueStyle} key={index} value={value[1].length > 0 ? value[1] : "Undefined"}/>
                )
              )}
            </Stack>
          </Stack>
      </Stack>
    );
  }
};
