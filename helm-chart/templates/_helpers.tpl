{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "slate-cbl.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "slate-cbl.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "slate-cbl.labels" -}}
helm.sh/chart: {{ include "slate-cbl.chart" . }}
{{ include "slate-cbl.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "slate-cbl.selectorLabels" -}}
app.kubernetes.io/name: {{ include "slate-cbl.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Cert Manager Annotations
*/}}
{{- define "slate-cbl.cert-manager-annotations" -}}
cert-manager.io/cluster-issuer: {{ .Values.cert_manager.annotations.cluster_issuer }}
{{- end }}
