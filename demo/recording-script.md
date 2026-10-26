# Voice recording script

Record the numbered sections in order. Say the section number, pause briefly, then read the paragraph in your own words. Leave two seconds between sections. The spoken numbers can be removed during editing. A single M4A, MP3 or WAV file is enough. Record in a quiet room at a steady pace.

This script describes the existing recordings. It does not claim that the removed Azure deployment is running today.

## 1. Introduction

This is Homework Tracker, my DevOps capstone. The application tracks course assignments. It uses React, FastAPI and PostgreSQL, with an Azure deployment running Kubernetes through K3s.

## 2. Application

Each assignment has a course session, deadline, assignee, priority and status. The frontend supports creating and editing assignments, filtering them, and tracking progress.

## 3. Architecture

GitHub Actions tests and scans the code, builds the images, and publishes them to GHCR. CI verifies the Helm chart in Kind. The cloud deployment uses approved images on Azure K3s. Ingress routes browser requests to the frontend and API. PostgreSQL keeps the assignment data on a persistent volume.

## 4. API and database

FastAPI exposes the CRUD endpoints and Swagger documentation. Alembic manages schema changes. The recorded database check shows an assignment row and the migration version. Another check verified that data survived the application upgrade.

## 5. Testing

The backend suite passed eleven API and migration tests. Tests use a separate database. The run also reported one deprecation warning. Test failures stop the pipeline before image publication.

## 6. Docker

Compose runs the frontend, backend and PostgreSQL together. The frontend uses a multi-stage build. Both application images run as non-root users. Health checks verify readiness before testing the application.

## 7. CI/CD

The pipeline tests the backend and builds the frontend. It then builds and scans both images and publishes them with commit SHA tags. These tags identify the exact application release. Documentation-only changes do not trigger the application workflow.

## 8. Security

Bandit checks Python source. Dependency audits check the backend and frontend packages. Trivy checks for secrets and scans both container images. HIGH or CRITICAL image findings fail the build. The saved release scans passed.

## 9. Azure infrastructure

Terraform provisions the Azure network, security rules and a small virtual machine. K3s runs the Kubernetes workload. Access to the Kubernetes API uses an SSH tunnel. This project uses Azure instead of the reference AWS architecture.

## 10. Kubernetes and Helm

Helm manages the frontend, backend and database configuration. The chart includes Services, Ingress, configuration, probes and persistent database storage. CI verifies a disposable Kind deployment separately from the recorded Azure deployment.

## 11. Autoscaling

The load test increases backend CPU use. Metrics Server supplies CPU measurements to the HPA. In the recorded Azure test, the backend scaled from two Pods to four.

## 12. Monitoring

The backend exposes Prometheus metrics. Prometheus scrapes the application, and Grafana displays request metrics. The saved evidence shows the application target UP and a populated dashboard.

## 13. GitOps

Argo CD compares the configuration in Git with the cluster state. The isolated CI exercise changed a replica count. Reconciliation restored the desired state, and the Application reported Synced and Healthy.

## 14. Troubleshooting

The recovery exercises used an invalid image tag and an incorrect Service selector. Pod events explained the image failure. Labels and EndpointSlices helped diagnose Service connectivity. The corrected resources passed the recovery checks.

## 15. Cleanup

Terraform destroyed all nine cloud resources after verification. The saved resource-group check returned false. The Azure endpoint is no longer hosted. The recordings preserve the deployment evidence without keeping the VM running.

## 16. Key learnings

Database readiness must come before traffic. A ready Pod does not prove that a Service works. Image SHA tags make deployments traceable. Raw test results matter, and temporary cloud infrastructure needs cleanup.

## 17. Walkthrough introduction

The following sections show the source code and recorded project demonstrations. The cloud and CI footage comes from the October verification. The source review was recorded separately on 26 October.

## 18. Codebase

The repository separates the backend, frontend, infrastructure and deployment files. The model defines assignment fields. FastAPI implements the routes. The workflow defines the delivery checks. Terraform and Helm define the cloud resources and application configuration.

## 19. Commit and push

This recording shows the application change being committed and pushed. The commit SHA connects the code change to the image tags and the approved release.

## 20. Tests and local application

The recorded verification runs the tests, starts a clean Compose stack, and checks the APIs. PostgreSQL stores the created assignment, and the frontend communicates with the backend.

## 21. Pipeline result

This is the successful standalone pipeline and its artifacts. It completed the build, security and deployment checks. The full run remains linked in the README.

## 22. Terraform demonstration

The recorded Terraform run provisions Azure infrastructure from code. Its plan shows the resources before apply. The project keeps private state and credentials out of the public repository.

## 23. Cluster and GitOps

The cluster recording shows Kubernetes resources, the Helm release and the isolated Argo CD Application. Synced and Healthy confirms that the declared application state was reconciled in that exercise.

## 24. Prometheus

The recorded Targets page reports the backend UP. This confirms that Prometheus could scrape the configured application metrics endpoint during the demonstration.

## 25. Grafana

Grafana displays the application's request count. A populated panel confirms that the dashboard received data from Prometheus during the recorded test.

## 26. Load test

The recorded load test produces enough HTTP traffic to increase CPU use. The HPA responds by adding backend replicas, reaching four Pods.

## 27. Failure and recovery

The deliberate image and Service failures are investigated and corrected. Recovery checks require both working endpoints and a successful HTTP response.

## 28. Application upgrade

The approved image release is deployed through Helm. The verification checks that the existing PostgreSQL assignment remains available after the update.

## 29. Updated frontend

The browser shows the updated frontend with the existing assignment. This checks both the visible application change and the preserved data.

## 30. Final cleanup

The final Terraform destroy removes the temporary cloud infrastructure. This keeps the demonstration reproducible without leaving Azure resources running. The code, screenshots and original recordings remain in the repository.
