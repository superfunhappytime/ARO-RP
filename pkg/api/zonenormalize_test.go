package api

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"testing"
)

func TestNormalizePhysicalZone(t *testing.T) {
	for _, tt := range []struct {
		name    string
		input   string
		want    string
		wantErr bool
	}{
		{name: "bare number", input: "2", want: "2"},
		{name: "lowercase region-prefixed (real ARM)", input: "eastus-az1", want: "1"},
		{name: "lowercase region-prefixed az2 (real ARM)", input: "eastus-az2", want: "2"},
		{name: "uppercase zero-padded", input: "uscentral-AZ02", want: "2"},
		{name: "region name containing a digit", input: "eastus2-az3", want: "3"},
		{name: "zone 4", input: "eastus2euap-az4", want: "4"},
		{name: "empty", input: "", wantErr: true},
		{name: "no number", input: "eastus-az", wantErr: true},
		{name: "garbage", input: "not-a-zone", wantErr: true},
	} {
		t.Run(tt.name, func(t *testing.T) {
			got, err := normalizePhysicalZone(tt.input)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("expected error for %q, got %q", tt.input, got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error for %q: %v", tt.input, err)
			}
			if got != tt.want {
				t.Fatalf("normalizePhysicalZone(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestMapPhysicalZonesAcceptsBothFormats(t *testing.T) {
	// Sub-doc populated with REAL ARM data (from the live `az rest .../locations`
	// call): physical zones in "<region>-az<N>" form, scrambled per subscription.
	realARM := &SubscriptionProperties{
		AvailabilityZones: &AvailabilityZonesProfile{
			Location: "eastus",
			ZoneMappings: []AvailabilityZoneMapping{
				{LogicalZone: "1", PhysicalZone: "eastus-az2"},
				{LogicalZone: "2", PhysicalZone: "eastus-az1"},
				{LogicalZone: "3", PhysicalZone: "eastus-az3"},
			},
		},
	}

	for _, tt := range []struct {
		name          string
		props         *SubscriptionProperties
		physicalZones []string
		want          []string
		wantErr       bool
	}{
		{
			name:          "config bare numbers against real ARM physical zones",
			props:         realARM,
			physicalZones: []string{"1", "2", "3"},
			// logical for physical "1"(=eastus-az1)->2, "2"(=eastus-az2)->1, "3"(=eastus-az3)->3
			want: []string{"2", "1", "3"},
		},
		{
			name:          "non-zonal returns empty",
			props:         realARM,
			physicalZones: []string{},
			want:          []string{},
		},
		{
			name: "config bare numbers against bare-number sub-doc (legacy shape)",
			props: &SubscriptionProperties{
				AvailabilityZones: &AvailabilityZonesProfile{
					ZoneMappings: []AvailabilityZoneMapping{
						{LogicalZone: "2", PhysicalZone: "1"},
						{LogicalZone: "1", PhysicalZone: "2"},
						{LogicalZone: "3", PhysicalZone: "3"},
					},
				},
			},
			physicalZones: []string{"1", "2", "3"},
			want:          []string{"2", "1", "3"},
		},
		{
			name:          "no mapping on subscription",
			props:         &SubscriptionProperties{},
			physicalZones: []string{"1"},
			wantErr:       true,
		},
	} {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.props.MapPhysicalZonesToLogicalZonesForSubscription("eastus", tt.physicalZones)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("expected error, got %v", got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if len(got) != len(tt.want) {
				t.Fatalf("got %v, want %v", got, tt.want)
			}
			for i := range got {
				if got[i] != tt.want[i] {
					t.Fatalf("got %v, want %v", got, tt.want)
				}
			}
		})
	}
}
