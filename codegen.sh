$protocGenTsPath = Join-Path $PWD "node_modules/.bin/protoc-gen-ts.cmd"
grpc_tools_node_protoc `
--plugin=protoc-gen-ts=$protocGenTsPath `
--js_out=import_style=commonjs,binary:./generated `
--ts_out=service=true:./generated `
--grpc_out=grpc_js:./generated `
-I ./proto `
./proto/input_service.proto