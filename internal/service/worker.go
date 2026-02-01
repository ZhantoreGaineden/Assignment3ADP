package service

import (
	"log"
	"math/rand"
	"time"
)

// StartDailyCurrencyWorker runs indefinitely.
func (s *AdminService) StartDailyCurrencyWorker() {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	log.Println("[Worker] Daily Currency Updater started. Waiting for next cycle...")

	for {
		<-ticker.C

		log.Println("[Worker] Waking up to update currency rates...")
		s.performDailyUpdate()
	}
}

// performDailyUpdate contains the core business logic for the worker
func (s *AdminService) performDailyUpdate() {
	rate, err := s.fetchExchangeRateUSD()
	if err != nil {
		log.Printf("[Worker Error] Failed to fetch rates: %v", err)
		return
	}
	log.Printf("[Worker] Current Exchange Rate: 1 USD = %.2f KZT", rate)

	cars, err := s.Repo.GetCarsInTransit()
	if err != nil {
		log.Printf("[Worker Error] DB fetch failed: %v", err)
		return
	}

	updatesCount := 0
	for _, car := range cars {
		newPriceKZT := car.PriceUSD * rate

		if diff := newPriceKZT - car.PriceKZT; diff > 100 || diff < -100 {
			err := s.Repo.UpdatePrice(car.ID, newPriceKZT)
			if err != nil {
				log.Printf("[Worker Error] Failed to update Car %d: %v", car.ID, err)
			} else {
				updatesCount++
			}
		}
	}

	log.Printf("[Worker] Cycle Complete. Updated prices for %d cars.", updatesCount)
}

// fetchExchangeRateUSD simulates calling the National Bank API
func (s *AdminService) fetchExchangeRateUSD() (float64, error) {

	time.Sleep(500 * time.Millisecond)

	mini := 520.0
	maxi := 530.0
	rate := mini + rand.Float64()*(maxi-mini)

	return rate, nil
}
