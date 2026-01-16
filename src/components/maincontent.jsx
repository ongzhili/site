import "./maincontent.css";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const markdownModules = import.meta.glob('/public/content/**/*.md', { as: 'raw' });

function CustomImage({ src, alt, currentFilePath }) {
    let resolvedSrc = src;
    
    // If src is relative (doesn't start with http or /), resolve it relative to the markdown file
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
        const fileDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
        resolvedSrc = `/${fileDir}/${src}`;
        console.log(`Resolved relative image: ${src} -> ${resolvedSrc}`);
    } else if (src && !src.startsWith('http')) {
        // If it starts with /, resolve it from content root
        resolvedSrc = `/content${src}`;
    }
    
    console.log("Image src:", src, "Resolved:", resolvedSrc);
    return <img src={resolvedSrc} alt={alt} />;
}


export default function MainContent({ url }) {
    const [markdown, setMarkdown] = useState("");
    const [currentFilePath, setCurrentFilePath] = useState("");

    useEffect(() => {
        console.log("MainContent received url:", url);
        setCurrentFilePath(url);
        
        const modulePath = `/public/${url}`;
        console.log("Looking for module:", modulePath);
        
        if (markdownModules[modulePath]) {
            markdownModules[modulePath]().then(setMarkdown);
        } else {
            console.error("Markdown file not found:", modulePath);
            setMarkdown(`# Error\n\nFile not found: ${url}`);
        }
    }, [url]);


    return (
        <div className="MainContent">
            <div className="mdContainer markdown-body">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        img: ({ src, alt }) => <CustomImage src={src} alt={alt} currentFilePath={currentFilePath} />
                    }}
                >{markdown}</ReactMarkdown>
            </div>
        </div>
    );
}
