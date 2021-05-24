/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const pfWebpackOptions = require("@kogito-tooling/patternfly-base/patternflyWebpackOptions");
const externalAssets = require("@kogito-tooling/external-assets-base");

const commonConfig = {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    library: "BpmnEditor",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    vscode: "commonjs vscode"
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      ...pfWebpackOptions.patternflyRules
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("../../node_modules"), path.resolve("./node_modules"), path.resolve("./src")]
  }
};

module.exports = async (argv) => [
  {
    ...commonConfig,
    target: "node",
    entry: {
      "extension/extension": "./src/extension/extension.ts"
    },
    plugins: []
  },
  {
    ...commonConfig,
    target: "web",
    entry: {
      "webview/BpmnEditorEnvelopeApp": "./src/webview/BpmnEditorEnvelopeApp.ts"
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: externalAssets.bpmnEditorPath(argv), to: "webview/editors/bpmn", ignore: ["WEB-INF/**/*"] }
      ])
    ]
  }
];
