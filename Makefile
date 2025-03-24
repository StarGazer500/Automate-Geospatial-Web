runenvoy:
	sudo docker run --rm -p 8080:8080 -p 9901:9901 -v /home/martin/Desktop/Automate-Geospatial-Web/envoy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:v1.18.3