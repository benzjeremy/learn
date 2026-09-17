package domain

import (
    "errors"
    "fmt"
    "strings"
)

// staticCurrencyRates provides a minimal set of conversion rates from EUR.
// In a real implementation this would be fetched from an external API.
var staticCurrencyRates = map[string]float64{
    "EUR": 1.0,
    "USD": 1.09, // approximate rate at time of writing
    "GBP": 0.86,
    "CHF": 1.02,
    "JPY": 154.0,
}

// ValidatePriceForCurrency converts a base price in Euro to the target currency
// and returns the converted amount rounded to two decimal places. It also
// validates that the provided currency is supported. The function is useful
// for the KI‑Tutor‑Abonnement‑Preis‑Validierung (5 €/Monat) when users pay in a
// different currency.
func ValidatePriceForCurrency(basePriceEUR float64, currency string) (float64, error) {
    cur := strings.ToUpper(strings.TrimSpace(currency))
    rate, ok := staticCurrencyRates[cur]
    if !ok {
        return 0, fmt.Errorf("unsupported currency: %s", cur)
    }
    // Simple conversion and rounding to cents.
    converted := basePriceEUR * rate
    // Round to two decimal places.
    rounded := float64(int(converted*100+0.5)) / 100
    if rounded < 0 {
        return 0, errors.New("price computation resulted in negative value")
    }
    return rounded, nil
}

