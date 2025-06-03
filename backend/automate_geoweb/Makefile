
RASTER_CONST_PATH = $(shell python3 -c "import raster; print(raster.__path__[0])")/algebra/const.py

createpyproto:
	python -m grpc_tools.protoc -I./grpc_backend/proto --python_out=./grpc_backend --grpc_python_out=./grpc_backend ./grpc_backend/proto/file_upload.proto

createpyproto1:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload1.proto


createpyproto2:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload2.proto

createpyproto3:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload3.proto

createpyproto4:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload4.proto

createpyproto5:
	python -m grpc_tools.protoc -I./grpc_backend/proto  --python_out=./grpc_backend ./grpc_backend/proto/file_upload5.proto

rungrpc:
	python manage.py run_grpc_server &

# Stop the Redis container

# stoptileservergl:
# 	-@docker stop tileservergl-container 2>/dev/null || true
# 	-@docker rm tileservergl-container 2>/dev/null || true

# run this prerequisite before run thr the tileservergl
# runprerequisite:
# 	@mkdir -p /home/martin/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media/fonts
# 	@chmod 755 /home/martin/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media/fonts

# runtileservergl: stoptileservergl

# 	@echo '{"options":{"paths":{"root":"/data","mbtiles":"/data/tiles"}},"styles":{}}' > /home/martin/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media/config.json
# 	@docker run -d --name tileservergl-container -v /home/martin/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media:/data -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
stopmbtileserver:
	@docker stop mbtileserver 2>/dev/null || true
	@docker rm mbtileserver 2>/dev/null || true

runmbtileserver: stopmbtileserver
	@docker run -d --name mbtileserver \
	-p 8080:8000 \
	-v /home/rbgh-officer-server/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media/tiles:/tiles \
	consbio/mbtileserver:0.11 \
	--dir /tiles --enable-fs-watch --cors "*"

stopmartintileserver:
	@docker stop martin-container 2>/dev/null || true
	@docker rm martin-container 2>/dev/null || true

runmartintileserver: stopmartintileserver

	@docker run -d --name martin-container \
  -v /home/rbgh-officer-server/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media/tiles:/data/tiles \
  -p 8080:3000 \
  ghcr.io/maplibre/martin /data/tiles

stoptitiler:
	-@docker stop titiler-container 2>/dev/null || true
	-@docker rm titiler-container 2>/dev/null || true

runtitiler: stoptitiler
	@docker run -d --name titiler-container \
	--platform=linux/amd64 \
	-p 8001:80 \
	-v /home/rbgh-officer-server/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media:/media \
	-e TITILER_CORS="http://192.168.1.200:3000" \
	-e LOG_LEVEL=debug \
	--memory="2g" --cpus="4" \
	--rm \
	ghcr.io/developmentseed/titiler:latest

# -@docker run -d --name titiler-container \
#     --platform=linux/amd64 \
#     -p 8001:8000 \
#     -v /home/martin/Desktop/Automate-Geospatial-Web/backend/automate_geoweb/media:/media \
#     -e TITILER_CORS="http://192.168.1.200:3000" \
#     -e LOG_LEVEL=debug \
#     --memory="2g" --cpus="2" \
#     --rm \
#     ghcr.io/developmentseed/titiler:latest


# Stop any running Celery processes



stopredis:
	-@docker stop redis-server 2>/dev/null || true
	-@docker rm redis-server 2>/dev/null || true

# Start the Redis container
# runredis: stopredis
# 	-@docker run -d --name redis-server -p 6379:6379 redis || echo "Failed to start Redis"

runredis: stopredis
	-@docker run -d --name redis-server -p 192.168.1.200:6379:6379 redis || echo "Failed to start Redis"

# This solves raster numpy int issue by changing int:int to int:int64
patchdjangoraster:
	-@grep -q "numpy.int" $(RASTER_CONST_PATH) && sed -i 's/numpy.int/numpy.int64/g' $(RASTER_CONST_PATH) || echo "django-raster already patched or not found"
	-@echo "Patched django-raster to use numpy.int64"

stopcelery:
	-@pkill -9 -f "celery.*-A automate_geoweb" || true
	-@sleep 2  # Give time for processes to terminate
	-@ps aux | grep "celery.*-A automate_geoweb" | grep -v grep | awk '{print $$2}' | xargs -r kill -9 || true
	-@echo "Stopped existing Celery processes" || true
# Run the Celery worker
runcelery: stopcelery 
	-@celery -A automate_geoweb worker -l info --concurrency=2 & echo "Celery worker started" || echo "Failed to start Celery"
	
runflower: stopflower
	celery -A automate_geoweb flower --loglevel=info &> flower.log & \
	[ $$? -eq 0 ] && echo "Flower started" || echo "Failed to start Flower"

stopflower:
	-pkill -f "celery -A automate_geoweb flower" || echo "No Flower running"




# Run the Django server with Gunicorn and Channels
runserver: runredis runcelery runtitiler 
	@kill -9 $(shell lsof -t -i :8000) || true
	@gunicorn --worker-class uvicorn_worker.UvicornWorker \
	--workers 2 \
	--bind 0.0.0.0:8000 \
	--log-level debug \
	--reload \
	--error-logfile - \
	--access-logfile - \
	automate_geoweb.asgi:application


migrate-db:
	python manage.py makemigrations
	python manage.py migrate
#install gdal for linux
# install_gdal
# 	sudo apt update && sudo apt install gdal-bin libgdal-dev && sudo apt install python3-dev build-essential

#if failed ce