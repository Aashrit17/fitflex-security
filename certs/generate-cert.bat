@echo off
cd /d %~dp0

echo [1] Generating Root Key...
openssl genrsa -out root.key 2048

echo [2] Generating Root Certificate...
openssl req -x509 -new -nodes -key root.key -sha256 -days 3650 -out root.crt -subj "/C=NP/ST=Bagmati/L=Baneshwor/O=VaultDesk/OU=Dev/CN=VaultDeskRootCA"

echo [3] Generating Server Key...
openssl genrsa -out server.key 2048

echo [4] Creating Config with SAN for localhost...
(
echo [req]
echo distinguished_name=req
echo [v3_req]
echo subjectAltName=DNS:localhost
echo basicConstraints=CA:FALSE
echo keyUsage = digitalSignature, keyEncipherment
echo extendedKeyUsage = serverAuth
) > cert.conf

echo [5] Creating CSR...
openssl req -new -key server.key -out server.csr -subj "/C=NP/ST=Bagmati/L=Baneshwor/O=VaultDesk/OU=Dev/CN=localhost"

echo [6] Signing Server Certificate...
openssl x509 -req -in server.csr -CA root.crt -CAkey root.key -CAcreateserial -out server.crt -days 825 -sha256 -extfile cert.conf -extensions v3_req

echo [7] Done. Import root.crt into Trusted Root Store.
pause
