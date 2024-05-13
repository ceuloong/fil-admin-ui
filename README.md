# go-admin

## 📦 Local development

### Environmental requirements

go 1.17 

nodejs: v14.16.0

npm: 6.14.11

### Development directory creation

```bash

# Create a development directory
mkdir goadmin
cd goadmin
```

### Get the code

> Important note: the two projects must be placed in the same folder;

```bash
# Get backend code
git clone https://github.com/go-admin-team/go-admin.git

# Get the front-end code
git clone https://github.com/go-admin-team/go-admin-ui.git

```

### Startup instructions

#### Server startup instructions

```bash
# Enter the go-admin backend project
cd ./go-admin

# Compile the project
go build

# Change setting 
# File path go-admin/config/settings.yml
vi ./config/setting.yml 

# 1. Modify the database information in the configuration file
# Note: The corresponding configuration data under settings.database
# 2. Confirm the log path
```

:::tip ⚠️Note that this problem will occur if CGO is not installed in the windows environment;

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

[Solve the cgo problem and enter](https://doc.go-admin.dev/guide/other/faq.html#_5-cgo-exec-missing-cc-exec-missing-cc-file-does-not-exist)

:::

#### Initialize the database, and start the service

``` bash
# The first configuration needs to initialize the database resource information
# Use under macOS or linux
$ ./go-admin migrate -c=config/settings.dev.yml

# ⚠️Note: Use under windows
$ go-admin.exe migrate -c=config/settings.dev.yml

# Start the project, you can also use the IDE for debugging
# Use under macOS or linux
$ ./go-admin server -c config/settings.yml

# ⚠️Note: Use under windows
$ go-admin.exe server -c config/settings.yml
```

#### Use docker to compile and start

```shell
# Compile the image
docker build -t go-admin .


# Start the container, the first go-admin is the container name, and the second go-admin is the image name
# -v Mapping configuration file Local path: container path
docker run --name go-admin -p 8000:8000 -v /config/settings.yml:/config/settings.yml -d go-admin-server
```



#### Generation Document

```bash
go generate
```

#### Cross compile
```bash
# windows
env GOOS=windows GOARCH=amd64 go build main.go

# or
# linux
env GOOS=linux GOARCH=amd64 go build main.go
```

### UI interactive terminal startup instructions

```bash
# Installation dependencies
npm install   # or cnpm install

# Start service
npm run dev
```
