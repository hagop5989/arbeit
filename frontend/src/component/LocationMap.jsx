import React, { useEffect, useRef, useState } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";

const { kakao } = window;

function LocationMap({ address, height }) {
  const mapRef = useRef(null);
  const [x, setX] = useState(126.945184);
  const [y, setY] = useState(37.556441);
  const { onClose, onOpen } = useDisclosure();

  const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.kakao !== "undefined") {
        // 카카오맵 로드 확인, 됐으면 resolve 함수로 Promise 호출하여 끝냄.
        resolve();
        return;
      }
      // 로드 안됐으면 async 를 통해 비동기적으로 로드 시도, 실패하면 onerror, 성공하면 onload 호출 후 resolve 호출하여 Promise 완료처리.
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c9b3b5ea56ef481752e865cdbbb0335c&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Kakao Maps SDK load error"));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!address) return;
    loadKakaoMapScript()
      // 주소가 있고 카카오 맵이 로드 됨을 위에서 확정 지음.

      .then(() => {
        window.kakao.maps.load(() => {
          if (
            window.kakao.maps.services &&
            window.kakao.maps.services.Geocoder
          ) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const newX = result[0].x;
                const newY = result[0].y;
                setX(newX);
                setY(newY);
                onOpen();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        onClose();
      });

    onClose();
  }, [address]);

  useEffect(() => {
    if (!address) return;

    loadKakaoMapScript()
      .then(() => {
        window.kakao.maps.load(() => {
          reloadMap(y, x);
        });
      })
      .catch((error) => {
        console.error(error);
        onClose();
      });
  }, [x, y]);

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
    <Box
      id={"map"}
      w={"100%"}
      h={height}
      maxHeight={"400px"}
      border={"3px solid gray"}
      borderRadius={"20px"}
    />
  );
}

export default LocationMap;
