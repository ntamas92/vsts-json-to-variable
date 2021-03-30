import React, { useEffect, useState } from "react";
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './App.css';
import FilterableKeyValueList from "./ValueList/FilterableKeyValueList";

const ipcRenderer = window.ipcrenderer

function App() {
  const [folderContent, setFolderContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mergedContent, setMergedContent] = useState(null);

  const handleClick = (event) => {
    event.preventDefault();
    const result = ipcRenderer.sendSync('select-dirs')
    setFolderContent(result)
  }

  useEffect(() => {
    if (!folderContent) {
      setSelectedFiles([])
    }
  }, [folderContent])

  const renderTree = (nodes) => {
    return (<TreeItem key={nodes.path} nodeId={nodes.path} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>)
  }

  const handleJsonMerge = () => {
    if (selectedFiles.length === 0) {
      window.alert("Fukin select sum file already!")
      return
    }

    const result = ipcRenderer.sendSync('merge-json-files', selectedFiles.reverse())
    setMergedContent(result)
  }

  return (
    <div className="row">

      <div className="left">
        <p><button className="btn" type="button" className="btn btn-primary" onClick={handleClick} id="dirs">Choose a directory</button></p>

        <div className="folder-view">
          {folderContent &&
            <div>Selected directory:
          <TreeView className="directory-list"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect={(_, nodeIds) => setSelectedFiles(nodeIds)}
                multiSelect>
                {renderTree(folderContent)}
              </TreeView>
            </div>}
        </div>


      </div>
      <div className="right">
          <div>
            <button disabled={selectedFiles.length === 0} type="button" onClick={handleJsonMerge}>Merge selected files</button>
          </div>

        <FilterableKeyValueList values={mergedContent} />

      </div>
    </div>

  );
}

export default App;
