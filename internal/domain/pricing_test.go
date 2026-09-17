package domain

import "testing"

func TestValidatePriceForCurrency(t *testing.T) {
    cases := []struct {
        priceEUR float64
        cur      string
        expect   float64
        wantErr  bool
    }{
        {5.0, "EUR", 5.00, false},
        {5.0, "usd", 5.45, false}, // 5*1.09=5.45
        {5.0, "GBP", 4.30, false}, // 5*0.86=4.30
        {5.0, "JPY", 770.00, false}, // 5*154=770
        {5.0, "ABC", 0, true},
    }
    for _, c := range cases {
        got, err := ValidatePriceForCurrency(c.priceEUR, c.cur)
        if c.wantErr && err == nil {
            t.Fatalf("expected error for currency %s, got none", c.cur)
        }
        if !c.wantErr {
            if err != nil {
                t.Fatalf("unexpected error for %s: %v", c.cur, err)
            }
            if got != c.expect {
                t.Fatalf("price conversion %s: expected %.2f, got %.2f", c.cur, c.expect, got)
            }
        }
    }
}

