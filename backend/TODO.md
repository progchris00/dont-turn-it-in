# Backend TODO

## Admin Dashboard analytics (3 visual graphs)
- [x] Implement deterministic forecasting + risk scoring utilities in `app/services/forecast_service.py`.
- [x] Implement admin analytics endpoints in `app/api/routes/admin_analytics.py`:
  - [x] GET `/api/v1/admin/analytics/overview`
  - [x] GET `/api/v1/admin/analytics/ai-distribution`
  - [x] GET `/api/v1/admin/analytics/student-forecast-line`
  - [x] GET `/api/v1/admin/analytics/student-table`
- [ ] Ensure frontend placeholder renders only 3 analytics charts (weekly, predictive forecast, AI distribution) and does not include a 4th graph.

## DB/test blockers (local dev)
- [ ] Fix local Postgres credentials/auth so tests can run (`password authentication failed for user postgres`).

