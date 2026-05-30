import React, {
  useState,
} from "react";

import { supabase } from "../supabase";

import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

export default function CreateUpdatePage({
  setCurrentPage,
}) {
  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [pinned, setPinned] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handlePublish() {
    if (!title.trim()) {
      alert(
        "Please enter a title."
      );

      return;
    }

    if (
      !content ||
      content === "<p><br></p>"
    ) {
      alert(
        "Please write the article."
      );

      return;
    }

    setLoading(true);

    const {
      error,
    } = await supabase
      .from(
        "announcements"
      )
      .insert({
        title:
          title.trim(),

        content,

        is_pinned:
          pinned,
      });

    setLoading(false);

    if (error) {
      alert(error.message);

      return;
    }

    alert(
      "Article published successfully."
    );

    setTitle("");

    setContent("");

    setPinned(false);
  }

  const modules = {
    toolbar: [
      [
        {
          header: [1, 2, 3, false],
        },
      ],

      [
        "bold",
        "italic",
        "underline",
        "strike",
      ],

      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
      ],

      ["blockquote"],

      ["link", "image"],

      ["clean"],
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        backgroundColor:
          "#f6f2ee",

        padding: "24px",

        boxSizing:
          "border-box",

        fontFamily:
          "Inter, sans-serif",
      }}
    >
      <button
        onClick={() =>
          setCurrentPage(
            "dashboard"
          )
        }
        style={{
          background: "none",

          border: "none",

          color: "#777",

          cursor: "pointer",

          marginBottom: "20px",

          padding: 0,

          fontSize: "15px",
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          fontFamily:
            "Playfair Display, serif",

          fontSize: "48px",

          marginTop: 0,

          marginBottom: "24px",

          color:
            "#1f1f23",
        }}
      >
        Create Update
      </h1>

      <div
        style={{
          backgroundColor:
            "white",

          borderRadius:
            "30px",

          padding: "24px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "18px",

            borderRadius:
              "18px",

            border:
              "1px solid #ddd",

            marginBottom:
              "20px",

            fontSize:
              "16px",

            boxSizing:
              "border-box",
          }}
        />

        <div
          style={{
            marginBottom:
              "18px",
          }}
        >
          <label
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "10px",

              fontWeight:
                "500",
            }}
          >
            <input
              type="checkbox"
              checked={
                pinned
              }
              onChange={() =>
                setPinned(
                  !pinned
                )
              }
            />

            Pin this article
          </label>
        </div>

        <div
          style={{
            marginBottom:
              "24px",
          }}
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={
              setContent
            }
            modules={modules}
            style={{
              backgroundColor:
                "white",

              minHeight:
                "300px",
            }}
          />
        </div>

        <button
          onClick={
            handlePublish
          }
          disabled={
            loading
          }
          style={{
            width: "100%",

            padding: "18px",

            borderRadius:
              "999px",

            border: "none",

            backgroundColor:
              "#1f1f23",

            color:
              "white",

            fontWeight:
              "600",

            fontSize:
              "16px",

            cursor:
              "pointer",
          }}
        >
          {loading
            ? "Publishing..."
            : "Publish Article"}
        </button>
      </div>
    </div>
  );
}