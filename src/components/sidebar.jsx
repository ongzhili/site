import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const LOGO_URL = `${import.meta.env.BASE_URL}content/images/portrait.png`;
const MARKDOWN_RELATIVE_PATH = "/public/content/notes/";

// Get all markdown files from the submodule
const markdownFiles = import.meta.glob('/public/content/notes/**/*.md', { as: "raw" });

function SocialLinks() {
    return (
        <div className="SidebarSocials">
            <a href="https://github.com/ongzhili" target="_blank" rel="noopener noreferrer">
                <img src={`${import.meta.env.BASE_URL}content/images/github-mark-white.svg`} alt="GitHub" className="SidebarSocialIcon" />
            </a>
            <a href="https://www.linkedin.com/in/ong-zhili/" target="_blank" rel="noopener noreferrer">
                <img src={`${import.meta.env.BASE_URL}content/images/linkedin.png`} alt="LinkedIn" className="SidebarSocialIcon" />
            </a>
        </div>
    );
}


function buildTree() {
    console.log("Building tree from markdown files");
    console.log("Available files:", Object.keys(markdownFiles));
    
    const tree = {};
    
    // Build directory structure from file paths
    Object.keys(markdownFiles).forEach(filePath => {
        const relativePath = filePath.replace(MARKDOWN_RELATIVE_PATH, '');
        console.log("Processing file:", relativePath);
        
        const parts = relativePath.split('/');
        let current = tree;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (i === parts.length - 1) {
                // It's a file
                if (!current.files) current.files = [];
                current.files.push({
                    type: 'file',
                    name: part,
                    path: relativePath
                });
            } else {
                // It's a directory
                if (!current[part]) {
                    current[part] = { dirs: {} };
                }
                current = current[part];
            }
        }
    });
    
    return tree;
}

function formatTree(treeObj, parentPath = '') {
    const result = [];
    
    // Add files
    if (treeObj.files) {
        treeObj.files.forEach(file => {
            result.push({
                type: 'file',
                name: file.name,
                path: file.path
            });
        });
    }
    
    // Add directories
    Object.keys(treeObj).forEach(key => {
        if (key !== 'files') {
            const children = formatTree(treeObj[key], parentPath ? `${parentPath}/${key}` : key);
            if (children.length > 0) {
                result.push({
                    type: 'dir',
                    name: key,
                    children
                });
            }
        }
    });
    
    return result;
}

function Tree({ nodes }) {
    if (!nodes) {
        console.log("Tree component: nodes is null/undefined");
        return null;
    }
    
    console.log("Tree component rendering with nodes:", nodes);
    
    return (
        <ul className="SidebarTree">
            {nodes.map((node) =>
                node.type === "file" ? (
                    <li key={node.path} className="SidebarFile">
                        <Link to={`notes/${encodeURIComponent(node.path)}`}>
                            {node.name}
                        </Link>
                    </li>
                ) : (
                    <li key={node.name} className="SidebarFolder">
                        <span className="SidebarFolderName">{node.name}</span>
                        <Tree nodes={node.children} />
                    </li>
                )
            )}
        </ul>
    );
}

export default function Sidebar() {
    const [tree, setTree] = useState([]);

    useEffect(() => {
        console.log("Sidebar mounting, building tree from files");
        const treeStructure = buildTree();
        const formattedTree = formatTree(treeStructure);
        console.log("Tree loaded in Sidebar:", formattedTree);
        setTree(formattedTree);
    }, []);

    console.log("Sidebar rendering with tree:", tree);

    return (
        <div className="Sidebar">
            <div className="SidebarProfile"> 
                <img src={LOGO_URL} alt="Logo" className="SidebarLogo" /> 
                <SocialLinks /> 
            </div> 
            <h3>Study Notes</h3>
            <Tree nodes={tree} />
        </div>
    );
}
