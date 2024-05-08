import React, { useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const CustomEditor = ({content = '', setContent}) => {

    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: [] }],
          [{ font: [] }],
          [{ align: ["right", "center", "justify"] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ color: ["red", "#785412"] }],
          [{ background: ["red", "#785412"] }]
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }
    }
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "color",
        "image",
        "background",
        "align",
        "size",
        "font"
    ]

    const handleSetContent = (value) => {
        setContent(value)
    }

    return <>
        {console.log(content)}
        <ReactQuill 
            theme="snow"
            modules={modules}
            formats={formats}
            value={content}
            onChange={handleSetContent}
        />
    </>
}

export default CustomEditor