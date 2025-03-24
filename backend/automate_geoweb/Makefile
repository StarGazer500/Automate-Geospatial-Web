
RASTER_CONST_PATH = $(shell python3 -c "import raster; print(raster.__path__[0])")/algebra/const.py

createpyproto:
	python -m grpc_tools.protoc -I./grpc_backend/proto --python_out=./grpc_backend --grpc_python_out=./grpc_backend ./grpc_backend/proto/file_upload.proto

createpyproto1:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload1.proto

rungrpc:
	python manage.py run_grpc_server &

# Stop the Redis container
stopredis:
	-@docker stop redis-server 2>/dev/null || true
	-@docker rm redis-server 2>/dev/null || true

# Stop any running Celery processes
stopcelery:
	-@pkill -9 -f "celery.*-A automate_geoweb" || true
	-@sleep 2  # Give time for processes to terminate
	-@ps aux | grep "celery.*-A automate_geoweb" | grep -v grep | awk '{print $$2}' | xargs -r kill -9 || true
	-@echo "Stopped existing Celery processes" || true

# Start the Redis container
runredis: stopredis
	-@docker run -d --name redis-server -p 6379:6379 redis || echo "Failed to start Redis"

# This solves raster numpy int issue by changing int:int to int:int64
patchdjangoraster:
	-@grep -q "numpy.int" $(RASTER_CONST_PATH) && sed -i 's/numpy.int/numpy.int64/g' $(RASTER_CONST_PATH) || echo "django-raster already patched or not found"
	-@echo "Patched django-raster to use numpy.int64"

# Run the Celery worker
runcelery: stopcelery 
	-@celery -A automate_geoweb worker -l info --concurrency=2 & echo "Celery worker started" || echo "Failed to start Celery"
	
runflower: stopflower
	celery -A automate_geoweb flower --loglevel=info &> flower.log & \
	[ $$? -eq 0 ] && echo "Flower started" || echo "Failed to start Flower"

stopflower:
	-pkill -f "celery -A automate_geoweb flower" || echo "No Flower running"

# Run the Django server with Gunicorn and Channels
runserver: runredis runcelery
	@kill -9 $(shell lsof -t -i :8000) || true
	@gunicorn --worker-class uvicorn_worker.UvicornWorker \
	--workers 2 \
	--bind 127.0.0.1:8000 \
	--log-level debug \
	--reload \
	--error-logfile - \
	--access-logfile - \
	automate_geoweb.asgi:application


migrate-db:
	python manage.py makemigrations
	python manage.py migrate
