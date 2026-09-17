package domain

import "testing"

func TestSelectBestModel(t *testing.T) {
    models := []ModelInfo{
        {Name: "model-a", SupportsCodeAnalysis: false, PerformanceScore: 5},
        {Name: "model-b", SupportsCodeAnalysis: true, PerformanceScore: 3},
        {Name: "model-c", SupportsCodeAnalysis: true, PerformanceScore: 8},
        {Name: "model-d", SupportsCodeAnalysis: true, PerformanceScore: 6},
    }
    best := SelectBestModel(models)
    if best.Name != "model-c" {
        t.Fatalf("expected model-c as best, got %s", best.Name)
    }

    // No model supports code analysis – should return first entry
    modelsNoCode := []ModelInfo{{Name: "fallback", SupportsCodeAnalysis: false, PerformanceScore: 10}}
    best = SelectBestModel(modelsNoCode)
    if best.Name != "fallback" {
        t.Fatalf("expected fallback model when none support code analysis, got %s", best.Name)
    }

    // Empty slice – should return zero value
    var empty []ModelInfo
    best = SelectBestModel(empty)
    if best != (ModelInfo{}) {
        t.Fatalf("expected zero value ModelInfo for empty input, got %+v", best)
    }
}

