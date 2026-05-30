import React, {
  useState,
} from "react";

import { supabase } from "../supabase";

export default function AdminLoginPage({
  setCurrentPage,
  setCurrentUser,
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const cleanUsername =
        username
          .trim()
          .toLowerCase();

      // STEP 1
      // FIND USER BY USERNAME

      const {
        data: userData,
        error: userError,
      } = await supabase

        .from("users")

        .select("*")

        .eq(
          "username",
          cleanUsername
        )

        .maybeSingle();

      if (
        userError ||
        !userData
      ) {
        setLoading(false);

        alert(
          "Invalid username"
        );

        return;
      }

      // STEP 2
      // LOGIN USING EMAIL + PASSWORD

      const {
        error: authError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              userData.email,

            password:
              password,
          }
        );

      setLoading(false);

      if (authError) {
        alert(
          "Invalid password"
        );

        return;
      }

      // STEP 3
      // CHECK ADMIN

      if (
        userData.role !==
        "admin"
      ) {
        alert(
          "Not an admin account"
        );

        return;
      }

      setCurrentUser(
        userData
      );

      setCurrentPage(
        "dashboard"
      );
    } catch (err) {
      console.log(err);

      setLoading(false);

      alert(
        "Login failed"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        backgroundColor:
          "#f6f2ee",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        padding: "24px",

        boxSizing:
          "border-box",

        fontFamily:
          "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",

          maxWidth: "420px",

          backgroundColor:
            "white",

          borderRadius: "34px",

          padding: "32px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontFamily:
              "Playfair Display, serif",

            fontSize: "52px",

            marginTop: 0,

            marginBottom:
              "10px",

            color:
              "#1f1f23",
          }}
        >
          SNSD
        </h1>

        <p
          style={{
            color: "#777",

            marginBottom:
              "28px",
          }}
        >
          Admin Portal Login
        </p>

        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: "18px",
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={
              handleLogin
            }
            disabled={loading}
            style={{
              width: "100%",

              padding: "18px",

              borderRadius:
                "999px",

              border: "none",

              backgroundColor:
                "#1f1f23",

              color: "white",

              fontSize: "16px",

              fontWeight: "600",

              cursor: "pointer",

              marginTop: "8px",
            }}
          >
            {loading
              ? "LOGGING IN..."
              : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",

  padding: "16px",

  borderRadius: "18px",

  border:
    "1px solid #ddd",

  fontSize: "15px",

  boxSizing:
    "border-box",

  outline: "none",
};