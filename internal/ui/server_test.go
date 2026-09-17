package ui

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "net/http/httptest"
    "testing"
)

// TestServerQuery ensures the /tutor/query endpoint returns a well‑formed JSON
// response and that the answer field is populated.
func TestServerQuery(t *testing.T) {
    // Set up a test HTTP server using the handler directly.
    ts := httptest.NewServer(http.HandlerFunc(handleQuery))
    defer ts.Close()

    payload := map[string]string{"prompt": "Test Prompt"}
    data, err := json.Marshal(payload)
    if err != nil {
        t.Fatalf("marshal error: %v", err)
    }
    resp, err := http.Post(ts.URL+"/tutor/query", "application/json", bytes.NewReader(data))
    if err != nil {
        t.Fatalf("post request failed: %v", err)
    }
    defer resp.Body.Close()
    if resp.StatusCode != http.StatusOK {
        t.Fatalf("expected status 200, got %d", resp.StatusCode)
    }
    var out struct {
        Answer string `json:"answer"`
        Model  string `json:"model"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
        t.Fatalf("decode error: %v", err)
    }
    if out.Answer == "" {
        t.Fatalf("empty answer in response")
    }
    if out.Model == "" {
        t.Fatalf("empty model in response")
    }
    fmt.Printf("Received model %s with answer %s\n", out.Model, out.Answer)
}

