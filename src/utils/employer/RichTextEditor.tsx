import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// Custom extension to add Tailwind classes to tables
const CustomTableExtension = Table.extend({
  renderHTML({ HTMLAttributes }) {
    return ['table', { ...HTMLAttributes, class: 'min-w-full border-collapse border border-gray-300 my-4' }, ['tbody', 0]];
  },
});

const CustomTableRowExtension = TableRow.extend({
  renderHTML({ HTMLAttributes }) {
    return ['tr', { ...HTMLAttributes, class: 'border-b border-gray-300' }, 0];
  },
});

const CustomTableCellExtension = TableCell.extend({
  renderHTML({ HTMLAttributes }) {
    return ['td', { ...HTMLAttributes, class: 'border border-gray-300 p-2' }, 0];
  },
});

const CustomTableHeaderExtension = TableHeader.extend({
  renderHTML({ HTMLAttributes }) {
    return ['th', { ...HTMLAttributes, class: 'border border-gray-300 p-2 bg-gray-100 font-medium' }, 0];
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Job Description'
}) => {
  // URL input state
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-4 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-4 space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'pl-1 my-1',
          },
        },
      }),
      Underline, // Add underline extension
      Link.configure({
        openOnClick: true, // Links will be clickable in the editor
        linkOnPaste: true, // Automatically create links when pasting URLs
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer', // Styling for links
          rel: 'noopener noreferrer nofollow', // Add safe rel attributes
          target: '_blank', // Open links in new tab
        },
      }),
      CustomTableExtension.configure({
        resizable: true,
      }),
      CustomTableRowExtension,
      CustomTableCellExtension,
      CustomTableHeaderExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'p-4 min-h-[300px] focus:outline-none prose prose-sm sm:prose max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Function to handle link insertion
  const handleInsertLink = () => {
    if (!linkUrl) {
      setShowLinkInput(false);
      return;
    }

    // Check if URL has protocol, if not add it
    let finalUrl = linkUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    // Insert the link URL as a proper link
    editor
      .chain()
      .focus()
      .setLink({ href: finalUrl })
      .run();
    
    // If there was no selection, insert the URL as link text as well
    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${finalUrl}" target="_blank" rel="noopener noreferrer nofollow">${linkUrl}</a>`)
        .run();
    }
    
    // Reset and close dialog
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
        {/* Text formatting buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        
        {/* Underline button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>
        
        {/* Link button */}
        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
        
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        
        {/* List buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        
        {/* Table button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Table"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </button>
        
        {/* Table modification buttons (only shown when a table is selected) */}
        {editor.isActive('table') && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="p-2 rounded hover:bg-gray-200"
              title="Add Column Before"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M15 9v6"></path>
                <path d="M12 12h6"></path>
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="p-2 rounded hover:bg-gray-200"
              title="Add Column After"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18 9v6"></path>
                <path d="M15 12h6"></path>
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="p-2 rounded hover:bg-gray-200"
              title="Add Row Before"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M9 9h6"></path>
                <path d="M12 6v6"></path>
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-2 rounded hover:bg-gray-200"
              title="Add Row After"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M9 18h6"></path>
                <path d="M12 15v6"></path>
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-2 rounded hover:bg-gray-200 text-red-500"
              title="Delete Table"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Editor content area */}
      <EditorContent 
        editor={editor} 
        className="min-h-[300px] p-4 rich-text-editor"
        placeholder={placeholder}
      />
      
      {/* Simple Link Input Dialog */}
      {showLinkInput && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-medium mb-4">Insert Link</h3>
            
            {/* Link URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="https://example.com"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed global styles for the editor */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Fixed list styles to ensure bullet points appear to the left of text */
        .ProseMirror ul, .ProseMirror ol {
          list-style-position: outside;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        
        .ProseMirror ul {
          list-style-type: disc;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
        }
        
        .ProseMirror li {
          margin: 0.25rem 0;
          padding-left: 0.5rem;
          display: list-item;
        }
        
        .ProseMirror li p {
          margin: 0;
          display: inline;
        }
        
        /* Style for pasted links */
        .ProseMirror a {
          color: #2563eb;
          word-break: break-all;
        }
        
        /* Basic table styles that complement the Tailwind classes */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }
        
        .ProseMirror table td, .ProseMirror table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
        }
        
        .ProseMirror table th {
          background-color: #f3f4f6;
          font-weight: 500;
        }
      `}} />
    </div>
  );
};

export default RichTextEditor;