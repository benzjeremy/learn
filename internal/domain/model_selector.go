package domain

import "strings"

// ChooseModelForCodeAnalysis picks the preferred model for code analysis from a list of model names.
// Preference order (hard‑coded based on current benchmarks):
//   1. any model containing "mistral" (case‑insensitive)
//   2. any model containing "llama" (case‑insensitive)
//   3. fall back to the first entry.
func ChooseModelForCodeAnalysis(models []string) string {
    if len(models) == 0 {
        return ""
    }
    for _, m := range models {
        if strings.Contains(strings.ToLower(m), "mistral") {
            return m
        }
    }
    for _, m := range models {
        if strings.Contains(strings.ToLower(m), "llama") {
            return m
        }
    }
    // fallback
    return models[0]
}

