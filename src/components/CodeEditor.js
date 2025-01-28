import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { LiveProvider, LivePreview, LiveError } from "react-live";

const CodeEditor = () => {
  const [code, setCode] = useState(`const App = () => (
    <div>
        <h1>Hello, React Live!</h1>
        <p>Start editing the code to see changes.</p>
    </div>
);
render(<App />);`);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [importStatement, setImportStatement] = useState("");

  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...messages) => {
      const processedMessages = messages.map((msg) =>
        typeof msg === "object" ? JSON.stringify(msg) : msg
      );
      setConsoleOutput((prevOutput) => [...prevOutput, processedMessages.join(" ")]);
      originalConsoleLog(...messages);
    };
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
  };

//   const handlePackageInstall = () => {
//     if (packageName) {
//       const dynamicImport = `import {${packageName}} from 'https://cdn.skypack.dev/${packageName}';\n`;
//       setImportStatement(dynamicImport);
//     }
//   };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#d0d0d0", padding: "10px" }}>
      <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", padding: "10px", backgroundColor: "#333", color: "#fff", borderRadius: "5px" }}>
        React Compiler
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <input
          type="text"
          placeholder="Enter package name (e.g., lodash)"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
        <button  style={{ padding: "5px 10px" }}>Install Package</button>
      </div>

      <div style={{ flex: 1, borderBottom: "2px solid #ccc", marginTop: "10px" }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{ autoClosingBrackets: "always", formatOnType: true }}
        />
      </div>

      <div style={{ display: "flex", flex: 1, padding: "10px", gap: "10px" }}>
        <div style={{ flex: 1, background: "#333", color: "#fff", padding: "10px", borderRadius: "5px" }}>
          <strong>Console</strong>
          <div>
            {consoleOutput.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, background: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}>
          <strong>Web View</strong>
          <LiveProvider code={code} noInline>
            <LivePreview />
            <LiveError style={{ color: "red", marginTop: "10px" }} />
          </LiveProvider>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
