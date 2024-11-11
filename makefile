docker-up:
	docker compose down
	docker compose up -d --build

run-port:
	python .\reference\emulator-scale\virtualCom.py com10
