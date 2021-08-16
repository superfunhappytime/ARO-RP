package portal

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"

	"github.com/Azure/ARO-RP/pkg/api/validate"
	"github.com/Azure/ARO-RP/pkg/portal/cluster"
	"github.com/Azure/ARO-RP/pkg/proxy"
)

type AdminOpenShiftCluster struct {
	Key         string `json:"key"`
	Name        string `json:"name"`
	State       string `json:"state"`
	FailedState string `json:"failedState"`
}

func (p *portal) clusters(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	docs, err := p.dbOpenShiftClusters.ListAll(ctx)
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	clusters := make([]*AdminOpenShiftCluster, 0, len(docs.OpenShiftClusterDocuments))
	for _, doc := range docs.OpenShiftClusterDocuments {
		ps := doc.OpenShiftCluster.Properties.ProvisioningState
		fps := doc.OpenShiftCluster.Properties.FailedProvisioningState

		clusters = append(clusters, &AdminOpenShiftCluster{
			Key:         doc.ID,
			Name:        doc.OpenShiftCluster.ID,
			State:       ps.String(),
			FailedState: fps.String(),
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

func (p *portal) makeFetcher(ctx context.Context, r *http.Request) (cluster.FetchClient, error) {
	resourceID := strings.Join(strings.Split(r.URL.Path, "/")[:9], "/")
	if !validate.RxClusterID.MatchString(resourceID) {
		return nil, fmt.Errorf("invalid resource ID")
	}

	doc, err := p.dbOpenShiftClusters.Get(ctx, resourceID)
	if err != nil {
		return nil, err
	}

	// In development mode, we can have localhost "fake" APIServers which don't
	// get proxied, so use a direct dialer for this
	var dialer proxy.Dialer
	if p.env.IsLocalDevelopmentMode() && doc.OpenShiftCluster.Properties.APIServerProfile.IP == "127.0.0.1" {
		dialer, err = proxy.NewDialer(false)
		if err != nil {
			return nil, err
		}
	} else {
		dialer = p.dialer
	}

	return cluster.NewFetchClient(p.log, dialer, doc)
}

func (p *portal) clusterOperators(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	fetcher, err := p.makeFetcher(ctx, r)
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	res, err := fetcher.ClusterOperators(ctx)
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	b, err := json.MarshalIndent(res, "", "    ")
	if err != nil {
		p.internalServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}
