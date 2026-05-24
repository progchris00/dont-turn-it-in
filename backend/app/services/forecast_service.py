from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Literal

from sqlmodel import Session

from app.models import Submission, User


RiskLevel = Literal["Low", "Moderate", "High"]


@dataclass(frozen=True)
class ThresholdConfig:

    # Predictive flag thresholds (percent)
    low_max: float = 20.0  # < low_max => Low; exactly low_max => Low (handled by caller)
    moderate_max: float = 50.0  # < moderate_max => Medium; >= => High

    # Risk scoring thresholds based on past-5 average AI% (percent)
    risk1_max: float = 20.0  # <= risk1_max => 1 (Low)
    risk2_max: float = 50.0  # < risk2_max => 2 (Moderate), else 3 (High)

    # Forecast window (last N values)
    forecast_window: int = 5

    def clamp(self, value: float) -> float:
        if value != value:  # NaN
            return 0.0
        return max(0.0, min(100.0, float(value)))


DEFAULT_THRESHOLDS = ThresholdConfig()


def predictive_flag(ai_percent: float, cfg: ThresholdConfig = DEFAULT_THRESHOLDS) -> RiskLevel:
    """Pedagogical risk flag for the *predicted* AI likelihood.

    Dashboard convention:
    - Low: < low_max
    - Moderate: [low_max, moderate_max)
    - High: >= moderate_max
    """

    ai_percent = cfg.clamp(ai_percent)
    if ai_percent < cfg.low_max:
        return "Low"
    if ai_percent < cfg.moderate_max:
        return "Moderate"
    return "High"




def risk_level_from_avg(avg_ai_percent: float, cfg: ThresholdConfig = DEFAULT_THRESHOLDS) -> tuple[int, RiskLevel]:

    avg_ai_percent = cfg.clamp(avg_ai_percent)
    if avg_ai_percent <= cfg.risk1_max:
        return 1, "Low"
    if avg_ai_percent < cfg.risk2_max:
        return 2, "Moderate"
    return 3, "High"


def actionable_remark(risk_score: int) -> str:
    if risk_score == 1:
        return "Continue monitoring; maintain current writing support"
    if risk_score == 2:
        return "Schedule periodic check-ins; targeted practice sessions may help"
    return "High risk: schedule 1 on 1 meeting and tutoring support"


def forecast_next_ai_percent(ai_series: list[float], *, window: int) -> float:
    """Deterministic baseline forecast using weighted moving average."""
    if not ai_series:
        return 0.0

    recent = ai_series[-window:]
    if len(recent) == 1:
        return recent[0]

    # More weight to later values.
    weights = list(range(1, len(recent) + 1))
    weighted_sum = sum(v * w for v, w in zip(recent, weights))
    return weighted_sum / sum(weights)


def build_student_forecast(
    *,
    session: Session,
    user: User,
    past_submissions: list[Submission],
    cfg: ThresholdConfig = DEFAULT_THRESHOLDS,
) -> dict:
    # Order by time.
    past_submissions_sorted = sorted(past_submissions, key=lambda s: s.submitted_at)
    ai_values = [cfg.clamp(float(s.ai_probability)) for s in past_submissions_sorted]

    # Past-5 submissions average for risk.
    window_for_risk = 5
    last5 = ai_values[-window_for_risk:] if len(ai_values) >= window_for_risk else ai_values
    avg_past_5 = (sum(last5) / len(last5)) if last5 else 0.0

    risk_score, risk_label = risk_level_from_avg(avg_past_5, cfg=cfg)

    predicted_next = forecast_next_ai_percent(ai_values, window=cfg.forecast_window)

    predictive = predictive_flag(predicted_next, cfg=cfg)

    return {
        "student_id": user.id,
        "student_name": user.full_name or user.email,
        "risk_score": risk_score,
        "risk_level": risk_label,
        "num_submissions": len(past_submissions_sorted),
        "avg_ai_percent": round(avg_past_5, 2),
        "predicted_ai_percent": round(predicted_next, 2),
        "predictive_flag": predictive,
        "actionable_remark": actionable_remark(risk_score),
    }


def compute_class_trend_points(
    *,
    ai_series_by_activity: list[tuple[str, float]],
    cfg: ThresholdConfig = DEFAULT_THRESHOLDS,
) -> list[dict]:
    """Build class trend points based on per-activity averages.

    Input is a list of (activityTitle, avgAiPercent) ordered chronologically.
    Output is [{ week: 1..n, avgAiPercent }, ..., forecastWeekPoint].
    """
    points: list[dict] = []
    recent_values = [v for _, v in ai_series_by_activity]

    for i, (_, avg_ai) in enumerate(ai_series_by_activity, start=1):
        points.append({"week": i, "avgAiPercent": round(cfg.clamp(avg_ai), 2)})

    # Forecast next point (deterministic baseline)
    predicted = forecast_next_ai_percent(recent_values, window=cfg.forecast_window)
    points.append({"week": len(ai_series_by_activity) + 1, "avgAiPercent": round(predicted, 2)})
    return points


