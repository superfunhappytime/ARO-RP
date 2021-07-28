import { Shimmer } from '@fluentui/react/lib/Shimmer';
import { Component } from "react"
import { Stack, Text, IStackStyles, IStackItemStyles } from '@fluentui/react';
import { contentStackStylesNormal } from "./App"

interface IClusterDetails {
  apiServerVisibility: string
  apiServerURL: string
  architectureVersion: string
  consoleLink: string
  createdAt: string
  createdBy: string
  failedProvisioningState: string
  infraId: string
  lastAdminUpdateError: string
  lastModifiedAt: string
  lastModifiedBy: string
  lastProvisioningState: string
  location: string
  name: string
  provisioningState: string
  resourceId: string
  version: string
}

interface ClusterDetailComponentProps {
  item: IClusterDetails
  clusterName: string
  isDataLoaded: boolean
  detailPanelVisible: string
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
}

const KeyColumnStyle: Partial<IStackStyles> = {
  root: {
    paddingTop: 10,
    paddingRight: 15,
  }
}

const ValueColumnStyle: Partial<IStackStyles> = {
  root: {
    paddingTop: 10,
  }
}

const KeyStyle: IStackItemStyles = {
  root: {
    fontStyle: "bold",
    alignSelf: "flex-start",
    fontVariantAlternates: "bold",
    color: "grey",
    paddingBottom: 10
  }
}

const ValueStyle: IStackItemStyles = {
  root: {
    paddingBottom: 10
  }
}

function ClusterDetailCell(
  value: any,
): any {
  if (typeof (value.value) == typeof (" ")) {
    return <Stack.Item styles={value.style}>
      <Text styles={value.style} variant={'medium'}>{value.value}</Text>
    </Stack.Item>
  } else {
    value.style.paddingLeft += 40;
    return Object.entries(value.value).map((innerValue: any, index: number) => (
      <ClusterDetailCell style={value.style} value={innerValue[1]} />
    )
    )
  }
};

export class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
  }

  public render() {
    switch (this.props.detailPanelVisible) {
      case "Overview":
        {
          const entries = Object.entries(this.props.item)

          return (
            <Stack styles={contentStackStylesNormal}>
              <Text variant="xxLarge">{this.props.clusterName}</Text>
              <Shimmer isDataLoaded={this.props.isDataLoaded} cols={3} rows={16}>
                <Stack horizontal>
                  <Stack styles={KeyColumnStyle}>
                    {entries.map((value: any, index: number) => (
                      <ClusterDetailCell style={KeyStyle} key={index} value={value[0]} />
                    )
                    )}
                  </Stack>

                  <Stack styles={KeyColumnStyle}>
                    {Array(entries.length).fill(':').map((value: any, index: number) => (
                      <ClusterDetailCell style={KeyStyle} key={index} value={value} />
                    )
                    )}
                  </Stack>

                  <Stack styles={ValueColumnStyle}>
                    {entries.map((value: [string, string | Object | null], index: number) => (
                      <ClusterDetailCell style={ValueStyle}
                        key={index}
                        value={value[1] != null && value[1].toString().length > 0 ? value[1] : "Undefined"} />
                    )
                    )}
                  </Stack>
                </Stack>
              </Shimmer>
            </Stack>
          );
        } break;
      case "Nodes":
        {
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
                  Node detail
                </Stack>

                <Stack styles={KeyColumnStyle}>
                  Node detail2
                </Stack>

                <Stack styles={ValueColumnStyle}>
                  Node detail3
                </Stack>
              </Stack>
            </Stack>
          );
        } break;
    }
  }
};
