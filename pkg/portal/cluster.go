package portal

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"encoding/json"
	"net/http"
	"regexp"
	"sort"
	"strings"
)

type AdminOpenShiftCluster struct {
	Key          string `json:"key"`
	Name         string `json:"name"`
	Id           string `json:"id"`
	State        string `json:"state"`
	FailedState  string `json:"failedState"`
	Subscription string `json:"subscription"`
}

func (p *portal) clusters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	docs, err := p.dbOpenShiftClusters.ListAll(ctx)
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	clusters := make([]*AdminOpenShiftCluster, 0, len(docs.OpenShiftClusterDocuments))

	re := regexp.MustCompile(`(?m)^/subscriptions/([^/]*)/resourceGroups/([^/]*)/providers/Microsoft.RedHatOpenShift/openShiftClusters/(.*)`)
	for _, doc := range docs.OpenShiftClusterDocuments {
		ps := doc.OpenShiftCluster.Properties.ProvisioningState
		fps := doc.OpenShiftCluster.Properties.FailedProvisioningState
		subscription := "Unknown"
		name := "Unknown"
		if m := re.FindAllStringSubmatch(doc.OpenShiftCluster.ID, -1); len(m) == 1 && len(m[0]) == 4 {
			subscription = m[0][1]
			name = m[0][3]
		}
		clusters = append(clusters, &AdminOpenShiftCluster{
			Key:          doc.ID,
			Id:           doc.OpenShiftCluster.ID,
			Name:         name,
			Subscription: subscription,
			State:        ps.String(),
			FailedState:  fps.String(),
		})
	}

	sort.SliceStable(clusters, func(i, j int) bool { return strings.Compare(clusters[i].Key, clusters[j].Key) < 0 })

	b, err := json.MarshalIndent(clusters, "", "    ")
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}
