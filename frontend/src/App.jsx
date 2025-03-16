import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import { FaSpinner, FaCopy } from 'react-icons/fa';
import './App.css';

function App() {
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      console.log('Sending code for review:', code);
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      console.log('Full API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Status:', response.status);
      
      if (response.status === 200) {
        if (typeof response.data === 'string') {
          setReview(response.data);
        } else if (response.data && typeof response.data === 'object') {
          setReview(JSON.stringify(response.data, null, 2));
        } else {
          setReview('Invalid response format from server');
        }
      } else {
        setReview(`Error: Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Status:', error.response.status);
        setReview(`Error: ${error.response.data || 'Failed to fetch review'}`);
      } else {
        setReview('Error: Failed to connect to server');
      }
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={code => {
              setCode(code);
              prism.highlightAll();
            }}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              backgroundColor: '#1e1e1e',
              color: '#f5f5f5',
              border: 'none',
              borderRadius: '5px',
              height: '100%',
              width: '100%',
              outline: 'none'
            }}
            textareaClassName="code-editor"
            preClassName="code-highlight"
          />
        </div>
        <div
          onClick={reviewCode}
          className="review"
        >
          Review
        </div>
      </div>
      <div className="right">
        <div className="markdown-body">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >
            {review}
          </Markdown>
        </div>
      </div>
    </main>
  )
}



export default App
