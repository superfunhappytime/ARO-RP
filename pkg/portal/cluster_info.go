package portal

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// TODO: Commented out fields contain complex objects
type AdminOpenShiftClusterDocument struct {
	ResourceID              string `json:"resourceId"`
	Name                    string `json:"name"`
	Location                string `json:"location"`
	CreatedBy               string `json:"createdBy"`
	CreatedAt               string `json:"createdAt"`
	LastModifiedBy          string `json:"lastModifiedBy"`
	LastModifiedAt          string `json:"lastModifiedAt"`
	ArchitectureVersion     string `json:"architectureVersion"`
	ProvisioningState       string `json:"provisioningState"`
	LastProvisioningState   string `json:"lastProvisioningState"`
	FailedProvisioningState string `json:"failedProvisioningState"`
	LastAdminUpdateError    string `json:"lastAdminUpdateError"`
	Version                 string `json:"version"`
	ConsoleLink             string `json:"consoleLink"`
	InfraId                 string `json:"infraId"`
	ApiServerVisibility     string `json:"apiServerVisibility"`
	ApiServerURL            string `json:"apiServerURL"`
	InstallPhase            string `json:"installStatus"`
}

func (p *portal) clusterInfo(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	apiVars := mux.Vars(r)

	subscription := apiVars["subscription"]
	resourceGroup := apiVars["resourceGroup"]
	clusterName := apiVars["name"]

	resourceId := strings.ToLower("/subscriptions/" + subscription + "/resourceGroups/" + resourceGroup + "/providers/Microsoft.RedHatOpenShift/openShiftClusters/" + clusterName)

	doc, err := p.dbOpenShiftClusters.Get(ctx, resourceId)

	if err != nil {
		http.Error(w, "Cluster not found", http.StatusNotFound)
		return
	}

	createdAt := "Unknown"
	if doc.OpenShiftCluster.SystemData.CreatedAt != nil {
		createdAt = doc.OpenShiftCluster.SystemData.CreatedAt.Format("2006-01-02 15:04:05")
	}

	lastModifiedAt := "Unknown"
	if doc.OpenShiftCluster.SystemData.CreatedAt != nil {
		lastModifiedAt = doc.OpenShiftCluster.SystemData.LastModifiedAt.Format("2006-01-02 15:04:05")
	}

	installPhase := "Installed"
	if doc.OpenShiftCluster.Properties.Install != nil {
		installPhase = doc.OpenShiftCluster.Properties.Install.Phase.String()
	}

	// TODO: Commented out fields contain complex objects
	clusterInfo := AdminOpenShiftClusterDocument{
		ResourceID:              resourceId,
		Name:                    clusterName,
		Location:                doc.OpenShiftCluster.Location,
		CreatedBy:               doc.OpenShiftCluster.SystemData.CreatedBy,
		CreatedAt:               createdAt,
		LastModifiedBy:          doc.OpenShiftCluster.SystemData.LastModifiedBy,
		LastModifiedAt:          lastModifiedAt,
		ArchitectureVersion:     string(rune(doc.OpenShiftCluster.Properties.ArchitectureVersion)),
		ProvisioningState:       doc.OpenShiftCluster.Properties.ProvisioningState.String(),
		LastProvisioningState:   doc.OpenShiftCluster.Properties.LastProvisioningState.String(),
		FailedProvisioningState: doc.OpenShiftCluster.Properties.FailedProvisioningState.String(),
		LastAdminUpdateError:    doc.OpenShiftCluster.Properties.LastAdminUpdateError,
		Version:                 doc.OpenShiftCluster.Properties.ClusterProfile.Version,
		ConsoleLink:             doc.OpenShiftCluster.Properties.ConsoleProfile.URL,
		InfraId:                 doc.OpenShiftCluster.Properties.InfraID,
		ApiServerVisibility:     string(doc.OpenShiftCluster.Properties.APIServerProfile.Visibility),
		ApiServerURL:            doc.OpenShiftCluster.Properties.APIServerProfile.URL,
		InstallPhase:            installPhase,
	}

	b, err := json.MarshalIndent(clusterInfo, "", "    ")
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}