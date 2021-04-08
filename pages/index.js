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
    notification.style.font = '16px Arial, sans-serif;';
    notification.style.right = '15px';
    notification.style.top = '15px';
    notification.style.padding = '15px 20px';
    notification.style.background = '#eeffee';
    notification.style.color = '#333';
    notification.style.border = '2px solid #aaa';
    notification.style.boxShadow = '3px 3px 15px 0px rgba(0, 0, 0, 0.3)';
    notification.style.borderRadius = '10px';
    notification.style.fontStyle = 'italic';
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
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Linden+Hill:ital@1&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Main>
        <Heading>Create copy bookmarklet</Heading>
        <Field>
          <div>Name</div>
          <Input value={name} onInput={e => setName(e.target.value)} />
        </Field>
        <Field>
          <div>Content:</div>
          <Input
            as={TextareaAutosize}
            value={content}
            onInput={e => setContent(e.target.value)}
            placeholder="Type content here..."
          />
        </Field>
        <div>
          <CopyText href={href}>Copy {name}</CopyText>
        </div>
      </Main>
    </div>
  );
}

const Heading = styled.h1`
  font-family: "Linden Hill", serif;
  font-style: italic;
  font-weight: 400;
  font-size: 68px;
  margin-bottom: 20px;
`;

const Main = styled.main`
  width: 600px;
  margin: auto;
  font-family: "Linden Hill", serif;
  font-weight: 400;
  font-size: 20px;
`;

const CopyText = styled.a`
  border: 1px solid black;
  background: white;
  padding: 10px;
  color: black;
  text-decoration: none;
  border-radius: 10px;
  display: inline-block;
`;

const Input = styled.input`
  font-family: "Linden Hill", serif;
  font-weight: 400;
  font-size: 20px;
  padding: 10px;
  width: 600px;
`;

const Field = styled.label`
  margin-bottom: 20px;
  display: block;
`;
