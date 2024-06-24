import React, { useEffect, useRef, useState } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";

const { kakao } = window;

function LocationMap({ address, height }) {
  const mapRef = useRef(null);
  const [x, setX] = useState(126.945184);
  const [y, setY] = useState(37.556441);
  const { onClose, onOpen } = useDisclosure();

  const loadKakaoMapScript = (callback) => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=c9b3b5ea56ef481752e865cdbbb0335c&libraries=services,clusterer,drawing&autoload=false";
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  };

  useEffect(() => {
    const removeScript = loadKakaoMapScript(() => {
      kakao.maps.load(() => {
        reloadMap(y, x);
      });
    });

    onClose();

    return removeScript;
  }, [x, y]);

  useEffect(() => {
    const removeScript = loadKakaoMapScript(() => {
      if (address) {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const newX = result[0].x;
            const newY = result[0].y;
            setX(newX);
            setY(newY);
            onOpen();
          }
        });
      }
    });

    return removeScript;
  }, [address]);

  function reloadMap(lat, lng) {
    if (!mapRef.current) {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        draggable: false,
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;
    }
    const map = mapRef.current;
    const coords = new kakao.maps.LatLng(lat, lng);

    const marker = new kakao.maps.Marker({
      position: coords,
    });
    marker.setMap(map);
    map.setCenter(coords);
  }

  return (
    <>
      <Box
        id={"map"}
        w={"100%"}
        h={height}
        maxHeight={"400px"}
        border={"3px solid gray"}
        borderRadius={"20px"}
      />
    </>
  );
}

export default LocationMap;
