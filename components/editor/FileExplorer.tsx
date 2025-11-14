import { File, FileJson, FileCode, FileText, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * FileExplorer Component
 *
 * @description VSCode-like file explorer sidebar that displays a file tree structure.
 * Supports file selection, folder expansion/collapse, and file type icons.
 *
 * @param {Object} props - Component props
 * @param {Record<string, string>} props.files - File structure (filename -> content)
 * @param {string} props.selectedFile - Currently selected file
 * @param {(filename: string) => void} props.onFileSelect - Callback when file is selected
 *
 * @returns {JSX.Element} The file explorer component
 *
 * @example
 * ```tsx
 * <FileExplorer
 *   files={{ 'package.json': '...', 'src/index.js': '...' }}
 *   selectedFile="package.json"
 *   onFileSelect={(filename) => setSelectedFile(filename)}
 * />
 * ```
 */
export function FileExplorer({
  files,
  selectedFile,
  onFileSelect,
}: {
  files: Record<string, string>;
  selectedFile: string;
  onFileSelect: (filename: string) => void;
}) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  // Build file tree structure
  const buildFileTree = () => {
    const tree: Record<string, any> = {};

    Object.keys(files).forEach((filepath) => {
      const parts = filepath.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = { type: 'file', path: filepath };
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      });
    });

    return tree;
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-yellow-500" />;
    } else if (filename.endsWith('.md')) {
      return <FileText className="w-4 h-4 text-blue-400" />;
    } else if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      return <FileCode className="w-4 h-4 text-blue-500" />;
    } else if (filename.endsWith('.svelte') || filename.endsWith('.vue')) {
      return <FileCode className="w-4 h-4 text-orange-500" />;
    } else if (filename.endsWith('.html')) {
      return <FileCode className="w-4 h-4 text-red-500" />;
    } else {
      return <File className="w-4 h-4 text-zinc-400" />;
    }
  };

  const renderTree = (node: any, path: string = '', level: number = 0) => {
    return Object.entries(node).map(([name, data]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isExpanded = expandedFolders.has(fullPath);

      if (data.type === 'folder') {
        return (
          <div key={fullPath}>
            <div
              className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-zinc-800 text-zinc-300`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm">{name}</span>
            </div>
            {isExpanded && (
              <div>
                {renderTree(data.children, fullPath, level + 1)}
              </div>
            )}
          </div>
        );
      } else {
        // File
        const filepath = data.path;
        const isSelected = filepath === selectedFile;

        return (
          <div
            key={filepath}
            className={`flex items-center gap-1.5 px-2 py-1 cursor-pointer text-zinc-300 ${
              isSelected ? 'bg-blue-600/20 border-l-2 border-blue-500' : 'hover:bg-zinc-800'
            }`}
            style={{ paddingLeft: `${level * 12 + 20}px` }}
            onClick={() => onFileSelect(filepath)}
          >
            {getFileIcon(name)}
            <span className="text-sm">{name}</span>
          </div>
        );
      }
    });
  };

  const tree = buildFileTree();

  return (
    <div className="h-full bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
          Explorer
        </h3>
      </div>

      {/* File Tree */}
      <div className="py-1">
        {renderTree(tree, '', 0)}
      </div>
    </div>
  );
}
