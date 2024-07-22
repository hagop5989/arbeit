# react project build
cd ../frontend
npm run build

# index.html, main.js 복사(이동) : dist -> static
cd ../backend
rm -rf src/main/resources/static
mv ../frontend/dist src/main/resources/static
cp -r ../frontend/public src/main/resources/static/.

# spring project build
./gradlew bootJar

# build image
docker build -t zang5989/arbeit .

# push image
docker push zang5989/arbeit

# remote 에서

# 컨테이너 멈추고
ssh -i src/main/resources/secret/key0527.pem ubuntu@43.201.105.97 'docker stop arbeit'
# 컨테이너 삭제
ssh -i src/main/resources/secret/key0527.pem ubuntu@43.201.105.97 'docker rm arbeit'
# pull image
ssh -i src/main/resources/secret/key0527.pem ubuntu@43.201.105.97 'docker pull zang5989/arbeit'
# 컨테이너 실행
ssh -i src/main/resources/secret/key0527.pem ubuntu@43.201.105.97 'docker run -d -p 8080:8080 --restart always --name arbeit zang5989/arbeit'
# 안쓰는 docker image 가지치기
ssh -i src/main/resources/secret/key0527.pem ubuntu@43.201.105.97 'docker image prune -f'