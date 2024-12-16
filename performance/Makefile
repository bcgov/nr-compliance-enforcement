
.PHONY: backend_perf_test
backend_perf_test: ## run backend performance tests
backend_perf_test: SERVER_HOST=http://127.0.0.1:3000
backend_perf_test: LOAD=test_run
backend_perf_test: REQUESTS_PER_SECOND=1 ## If setting above 50, inform platform services first
backend_perf_test:
	@k6 -e SERVER_HOST=$(SERVER_HOST) -e LOAD=$(LOAD) -e RPS=${REQUESTS_PER_SECOND} run ./backend_script.js --out csv=k6_results/backend_test_results.csv

.PHONY: frontend_perf_test
frontend_perf_test: ## run frontend performance tests
frontend_perf_test: APP_HOST=http://127.0.0.1:3001
frontend_perf_test: LOAD=test_run
frontend_perf_test: REQUESTS_PER_SECOND=1 ## If setting above 50, inform platform services first
frontend_perf_test:
	@k6 -e APP_HOST=$(APP_HOST) -e LOAD=$(LOAD) -e RPS=${REQUESTS_PER_SECOND} run ./frontend_script.js --out csv=k6_results/test_results_frontend.csv
