package portal

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"encoding/json"
	"net/http"

	"github.com/Azure/ARO-RP/pkg/api"
	"github.com/gorilla/mux"
)

type AdminOpenShiftClusterDocument struct {
	ResourceID              string               `json:"resourceId"`
	Name                    string               `json:"name"`
	Location                string               `json:"location"`
	CreatedBy               string               `json:"createdBy"`
	CreatedAt               string               `json:"createdAt"`
	LastModifiedBy          string               `json:"lastModifiedBy"`
	LastModifiedAt          string               `json:"lastModifiedAt"`
	Tags                    map[string]string    `json:"tags"`
	ArchitectureVersion     int                  `json:"architectureVersion"`
	ProvisioningState       string               `json:"provisioningState"`
	LastProvisioningState   string               `json:"lastProvisioningState"`
	FailedProvisioningState string               `json:"failedProvisioningState"`
	LastAdminUpdateError    string               `json:"lastAdminUpdateError"`
	Version                 string               `json:"version"`
	ConsoleLink             string               `json:"consoleLink"`
	InfraId                 string               `json:"infraId"`
	MasterProfile           api.MasterProfile    `json:"masterProfile,omitempty"`
	WorkerProfiles          []api.WorkerProfile  `json:"workerProfile,omitempty"`
	ApiServerProfile        api.APIServerProfile `json:"apiServer,omitempty"`
	IngressProfiles         []api.IngressProfile `json:"ingressProfiles,omitempty"`
	Install                 api.Install          `json:"install,omitempty"`
}

func (p *portal) clusterInfo(w http.ResponseWriter, r *http.Request) {
	// TODO: Replace dummy data with actual data collection from APIs and other resources
	// ctx := r.Context()

	// doc, err := p.dbOpenShiftClusters.Get(ctx, "/subscriptions/225e02bc-43d0-43d1-a01a-17e584a4ef69/resourcegroups/v4-eastus/providers/microsoft.redhatopenshift/openshiftclusters/mjudeikis2")

	apiVars := mux.Vars(r)

	subscription := apiVars["subscription"]
	resourceGroup := apiVars["resourceGroup"]
	clusterName := apiVars["name"]

	resourceId := "/subscriptions/" + subscription + "/resourceGroups/" + resourceGroup + "/providers/Microsoft.RedHatOpenShift/openShiftClusters/" + clusterName

	masterProfile := api.MasterProfile{
		VMSize:   "Standard_D8s_v3",
		SubnetID: "/subscriptions/225e02bc-43d0-43d1-a01a-17e584a4ef69/resourceGroups/v4-eastus/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/mjudeikis2-master",
	}

	workerProfiles := []api.WorkerProfile{
		{
			VMSize:     "Standard_D2s_v3",
			SubnetID:   "/subscriptions/225e02bc-43d0-43d1-a01a-17e584a4ef69/resourceGroups/v4-eastus/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/mjudeikis2-worker",
			Name:       "workerProfile1",
			DiskSizeGB: 64,
			Count:      3,
		},
		{
			VMSize:     "Standard_D4s_v5",
			SubnetID:   "/subscriptions/225e02bc-43d0-43d1-a01a-17e584a4ef69/resourceGroups/v4-eastus/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/mjudeikis2-worker",
			Name:       "workerProfile2",
			DiskSizeGB: 128,
			Count:      2,
		},
		{
			VMSize:     "Standard_D6s_v7",
			SubnetID:   "/subscriptions/225e02bc-43d0-43d1-a01a-17e584a4ef69/resourceGroups/v4-eastus/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/mjudeikis2-worker",
			Name:       "workerProfile3",
			DiskSizeGB: 256,
			Count:      1,
		},
	}

	apiServerProfile := api.APIServerProfile{
		Visibility: "public",
		URL:        "https://api.dyz4807n.v4-eastus.osadev.cloud:6443/",
		IP:         "40.88.210.230",
		IntIP:      "192.168.0.1",
	}

	ingressProfile := []api.IngressProfile{
		{
			Name:       "ingressProfile1",
			Visibility: "Public",
			IP:         "20.72.148.25",
		},
		{
			Name:       "ingressProfile2",
			Visibility: "Public",
			IP:         "20.72.148.26",
		},
		{
			Name:       "ingressProfile3",
			Visibility: "Private",
			IP:         "20.72.148.27",
		},
	}

	// For installation of new clusters
	// install := api.Install{
	// 	Now:           time.Time{},
	// 	Phase:         api.InstallPhaseBootstrap,
	// }

	clusterInfo := AdminOpenShiftClusterDocument{
		ResourceID:            resourceId,
		Name:                  clusterName,
		Location:              "east-us",
		CreatedBy:             "Ellis",
		CreatedAt:             "01-01-0001",
		LastModifiedBy:        "Ellis",
		LastModifiedAt:        "02-07-2021",
		Tags:                  make(map[string]string),
		ArchitectureVersion:   1,
		ProvisioningState:     "Succeeded",
		LastProvisioningState: "Succeeded",
		Version:               "4.5.17",
		ConsoleLink:           "https://google.com",
		InfraId:               "testing-infra",
		MasterProfile:         masterProfile,
		WorkerProfiles:        workerProfiles,
		ApiServerProfile:      apiServerProfile,
		IngressProfiles:       ingressProfile,
	}

	b, err := json.MarshalIndent(clusterInfo, "", "    ")
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}
