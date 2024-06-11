import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const { kakao } = window;

/* x, y, markerName 받아와서 kakaoMap 단순히 보여주는 용도로만 사용할 예정 */
export function KakaoMap1({ x, y, markerName }) {
  const mapRef = useRef(null);

  function reloadMap() {
    if (!mapRef.current) {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(x, y),
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;
    }

    const map = mapRef.current;
    const coords = new kakao.maps.LatLng(x, y);
    const marker = new kakao.maps.Marker({
      map: map,
      position: coords,
    });

    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div id="customInfoWindow" style="width:150px;text-align:center;padding:6px 0; border-radius:15px;">${markerName}</div>`,
    });
    infoWindow.open(map, marker);
    map.setCenter(coords);
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=c9b3b5ea56ef481752e865cdbbb0335c&libraries=services,clusterer,drawing&autoload=false";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        reloadMap();
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [x, y, markerName]);

  return (
    <>
      <Box>가게 주소</Box>
      <Box id="map" w="500px" h="400px" />
    </>
  );
}
