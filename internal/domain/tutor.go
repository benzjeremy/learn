package domain

// ModelInfo describes a language model candidate for the KI‑Tutor.
type ModelInfo struct {
    Name                string // e.g. "mistral-7b-instruct"
    SupportsCodeAnalysis bool   // true if the model can handle code‑analysis prompts
    PerformanceScore    int    // higher means faster / more accurate (arbitrary scale)
}

// SelectBestModel returns the most suitable model from the slice.
// Preference order:
//   1. Must support code analysis.
//   2. Highest PerformanceScore.
// If no model supports code analysis, the function returns the first entry
// (fallback) and a zero‑value ModelInfo if the slice is empty.
func SelectBestModel(models []ModelInfo) ModelInfo {
    if len(models) == 0 {
        return ModelInfo{}
    }
    var best ModelInfo
    found := false
    for _, m := range models {
        if m.SupportsCodeAnalysis {
            if !found || m.PerformanceScore > best.PerformanceScore {
                best = m
                found = true
            }
        }
    }
    if found {
        return best
    }
    // Fallback: return first model (no code‑analysis support)
    return models[0]
}

