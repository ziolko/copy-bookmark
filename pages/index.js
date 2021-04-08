import { useState } from "react";
import { minify } from "terser";
import { useAsync } from "react-async-hook";

import Head from "next/head";
import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [name, setName] = useState("Sample text");
  const [content, setContent] = useState("Hello world!");
  const sanitizedContent = content.replaceAll?.('"', '\\"');
  const sanitizedName = name.replaceAll?.('"', '\\"');
  const code = `
    (function (text) {
    var textarea = document.createElement('textarea');
    var selection = document.getSelection();
    var notification = document.createElement('div');
  
    textarea.textContent = text;
    document.body.appendChild(textarea);
  
    selection.removeAllRanges();
    textarea.select();
    document.execCommand('copy');
  
    selection.removeAllRanges();
    document.body.removeChild(textarea);
    
    notification.style.position = 'fixed';
    notification.style.font = '14px Arial, sans-serif;';
    notification.style.right = '15px';
    notification.style.top = '15px';
    notification.style.padding = '10px';
    notification.style.background = '#9d9';
    notification.style.color = '#333';
    notification.style.border = '1px dashed black';
    notification.style.opacity = 0.8;
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999999';
    notification.style.pointerEvents = 'none';
    notification.innerText = "Copied ${sanitizedName} to clipboard";
    document.body.appendChild(notification);
    setTimeout(function() {
        document.body.removeChild(notification);
    }, 2500);
    
  })("${sanitizedContent}")
  `;

  const result = useAsync(() => minify(code), [code]);
  const href = `javascript:${result.result?.code}`;

  return (
    <div>
      <Head>
        <title>Copy bookmarklet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1>Create copy bookmarklet</h1>
        <label>
          Name:
          <input value={name} onInput={e => setName(e.target.value)} />
        </label>
        <label>
          <div>Content:</div>
          <TextareaAutosize
            value={content}
            onInput={e => setContent(e.target.value)}
            style={{ width: 600 }}
          />
        </label>
        <div>
          <CopyText href={href}>Copy {name}</CopyText>
        </div>
      </Main>
    </div>
  );
}

const Main = styled.main`
  width: 800px;
  margin: auto;
`;

const CopyText = styled.a`
  border: 1px solid black;
  background: white;
  padding: 10px;
  color: black;
  text-decoration: none;
  border-radius: 10px;
  margin-top: 10px;
  display: inline-block;
`;
