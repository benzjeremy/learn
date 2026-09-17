package domain

import (
    "bytes"
    "os/exec"
    "strings"
)

// AnalyzeWithModel sends the given prompt to the specified Ollama model and returns the generated response.
// It uses the "ollama run <model>" command, writes the prompt to stdin and captures stdout.
// The function trims trailing newlines and returns an error if the command fails.
func AnalyzeWithModel(prompt, modelName string) (string, error) {
    // Ensure Ollama is available.
    cmd := exec.Command("ollama", "run", modelName)
    var out bytes.Buffer
    var errBuf bytes.Buffer
    cmd.Stdout = &out
    cmd.Stderr = &errBuf
    cmd.Stdin = strings.NewReader(prompt)
    if err := cmd.Run(); err != nil {
        return "", err
    }
    // Trim possible trailing newlines/spaces.
    result := strings.TrimSpace(out.String())
    return result, nil
}

