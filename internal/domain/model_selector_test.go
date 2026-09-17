package domain

import "testing"

func TestChooseModelForCodeAnalysis(t *testing.T) {
    cases := []struct {
        models []string
        want   string
    }{
        {[]string{"llama2-7b-chat", "mistral-7b-instruct", "phi-2"}, "mistral-7b-instruct"},
        {[]string{"llama2-7b-chat", "phi-2"}, "llama2-7b-chat"},
        {[]string{"phi-2", "other"}, "phi-2"},
        {[]string{}, ""},
    }
    for _, c := range cases {
        got := ChooseModelForCodeAnalysis(c.models)
        if got != c.want {
            t.Fatalf("ChooseModelForCodeAnalysis(%v) = %s, want %s", c.models, got, c.want)
        }
    }
}

