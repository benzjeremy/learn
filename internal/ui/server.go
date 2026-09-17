package ui

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os/exec"
    "strconv"
    "strings"

    "github.com/benzjeremy/learn/internal/domain"
)

// QueryRequest represents a minimal request payload for the tutor service.
type QueryRequest struct {
    Prompt string `json:"prompt"`
    // Optional explicit model name; if empty the service selects the best model.
    Model string `json:"model,omitempty"`
}

// QueryResponse is a simple echo‑style response used for the MVP prototype.
type QueryResponse struct {
    Answer string `json:"answer"`
    Model  string `json:"model"`
}

// handleQuery is the HTTP handler for POST /tutor/query.
func handleQuery(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        return
    }
    var rq QueryRequest
    if err := json.NewDecoder(r.Body).Decode(&rq); err != nil {
        http.Error(w, "bad request", http.StatusBadRequest)
        return
    }

    // Determine which model to use.
    var chosen string
    if rq.Model != "" {
        chosen = rq.Model
    } else {
    // Try to discover installed Ollama models. If that fails, fall back to a static list.
    candidates := discoverOllamaModels()
    if len(candidates) == 0 {
        // Static fallback list.
        candidates = []domain.ModelInfo{{Name: "mistral-7b-instruct", SupportsCodeAnalysis: true, PerformanceScore: 8}, {Name: "llama2-7b-chat", SupportsCodeAnalysis: true, PerformanceScore: 6}, {Name: "phi-2", SupportsCodeAnalysis: false, PerformanceScore: 4}}
    }
    best := domain.SelectBestModel(candidates)
    chosen = best.Name
    }

    // If the chosen model supports code analysis, attempt a real analysis call.
    answer := fmt.Sprintf("Echo: %s", rq.Prompt)
    if strings.Contains(strings.ToLower(chosen), "mistral") || strings.Contains(strings.ToLower(chosen), "code") {
        if out, err := domain.AnalyzeWithModel(rq.Prompt, chosen); err == nil {
            answer = out
        } // else keep echo answer.
    }
    resp := QueryResponse{Answer: answer, Model: chosen}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(resp)
}

// StartTutorServer launches the minimal tutor HTTP server on the given port.
// It blocks until the server stops; callers typically run it in a goroutine.
func StartTutorServer(port int) error {
    mux := http.NewServeMux()
    mux.HandleFunc("/tutor/query", handleQuery)
    addr := ":" + strconv.Itoa(port)
    log.Printf("Tutor server listening on %s", addr)
    return http.ListenAndServe(addr, mux)
}

// discoverOllamaModels attempts to run "ollama list --format json" and parses the output.
// It returns a slice of ModelInfo with a rudimentary heuristic for SupportsCodeAnalysis.
func discoverOllamaModels() []domain.ModelInfo {
    cmd := exec.Command("ollama", "list", "--format", "json")
    out, err := cmd.Output()
    if err != nil {
        // Ollama not running or not installed – return empty slice to trigger fallback.
        return nil
    }
    // Expected JSON array of objects with at least a "name" field.
    var raw []struct {
        Name string `json:"name"`
    }
    if err := json.Unmarshal(out, &raw); err != nil {
        return nil
    }
    var models []domain.ModelInfo
    for _, m := range raw {
        // Simple heuristics: models containing "mistral" or "code" are assumed to support code analysis.
        lower := strings.ToLower(m.Name)
        supports := strings.Contains(lower, "mistral") || strings.Contains(lower, "code")
        // PerformanceScore derived from name length (shorter may be faster) – purely illustrative.
        score := 5
        if strings.Contains(lower, "mistral") {
            score = 9
        } else if strings.Contains(lower, "llama") {
            score = 7
        }
        models = append(models, domain.ModelInfo{Name: m.Name, SupportsCodeAnalysis: supports, PerformanceScore: score})
    }
    return models
}

