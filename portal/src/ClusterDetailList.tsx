import { IShimmerStyles, Shimmer, ShimmerElementsGroup, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
import { Component } from "react"
import { Stack, Text, IStackStyles, IStackItemStyles } from '@fluentui/react';
import { contentStackStylesNormal } from "./App"

interface ClusterDetailComponentProps {
  item: any
  clusterName: string
  isDataLoaded: boolean
  detailPanelVisible: string
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
}

export interface IClusterDetails {
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
  installStatus: string
}

const clusterDetailHeadings : IClusterDetails = {
  apiServerVisibility: 'ApiServer Visibility',
  apiServerURL: 'ApiServer URL',
  architectureVersion: 'Architecture Version',
  consoleLink: 'Console Link',
  createdAt: 'Created At',
  createdBy: 'Created By',
  failedProvisioningState: 'Failed Provisioning State',
  infraId: 'Infra Id',
  lastAdminUpdateError: 'Last Admin Update Error',
  lastModifiedAt: 'Last Modified At',
  lastModifiedBy: 'Last Modified By',
  lastProvisioningState: 'Last Provisioning State',
  location: 'Location',
  name: 'Name',
  provisioningState: 'Provisioning State',
  resourceId: 'Resource Id',
  version: 'Version',
  installStatus: 'Installation Status'
}

const ShimmerStyle: Partial<IShimmerStyles> = {
  root: {
    margin: "11px 0"
  }
}

const headShimmerStyle: Partial<IShimmerStyles> = {
  root: {
    margin: "15px 0"
  }
}

const headerShimmer = [
  { type: ShimmerElementType.line, height: 32, width: '25%' },
]

const rowShimmer = [
  { type: ShimmerElementType.line, height: 18, width: '75%' },
]

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
  }
};

export class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
  }

  public render() {
    const headerEntries = Object.entries(clusterDetailHeadings)
    switch (this.props.detailPanelVisible) {
      case "Overview":
        {
          var filteredHeaders: Array<[string, any]> = []
          if (this.props.item.length != 0) {
            headerEntries.filter((element: [string, any]) => {
              if (this.props.item[element[0]] != null &&
                  this.props.item[element[0]].toString().length > 0) {
                    filteredHeaders.push(element)
                  }
            })
          return (
            <Stack styles={contentStackStylesNormal}>
              <Text variant="xxLarge">{this.props.clusterName}</Text>
                <Stack horizontal>
                  <Stack styles={KeyColumnStyle}>
                    {filteredHeaders.map((value: [string, any], index: number) => (
                      <ClusterDetailCell style={KeyStyle} key={index} value={value[1]} />
                    )
                    )}
                  </Stack>

                  <Stack styles={KeyColumnStyle}>
                    {Array(filteredHeaders.length).fill(':').map((value: [string], index: number) => (
                      <ClusterDetailCell style={KeyStyle} key={index} value={value} />
                    )
                    )}
                  </Stack>

                  <Stack styles={ValueColumnStyle}>
                    {filteredHeaders.map((value: [string, any], index: number) => (
                      <ClusterDetailCell style={ValueStyle}
                        key={index}
                        value={this.props.item[value[0]]} />
                      )
                    )}
                  </Stack>
                </Stack>
            </Stack>
          );
          } else {
            return (
              <Stack>
                <Shimmer styles={headShimmerStyle} shimmerElements={headerShimmer} width="25%"></Shimmer>
                {headerEntries.map(() => (
                  <Shimmer styles={ShimmerStyle} shimmerElements={rowShimmer} width="75%"></Shimmer>
                  )
                )}
              </Stack>
            )
          }
        } break;
      case "Nodes":
        {
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