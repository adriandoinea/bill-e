interface ResetPasswordTemplateProps {
  resetLink: string;
}

export const ResetPasswordTemplate = ({
  resetLink,
}: ResetPasswordTemplateProps) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      lineHeight: "1.6",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h2 style={{ color: "#3153AF", textAlign: "center" }}>Bill-e</h2>

    <p>Hi there,</p>

    <p>
      We received a request to reset your password. Click the link below if you
      still wish to change your password:
    </p>

    <p style={{ textAlign: "center" }}>
      <a
        href={resetLink}
        style={{
          backgroundColor: "#3153AF",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Change your password
      </a>
    </p>

    <p>If you did not request a password reset, please disregard this email.</p>

    <p>
      Best regards,
      <br />
      Bill-e Team
    </p>

    <footer
      style={{
        marginTop: "20px",
        fontSize: "12px",
        color: "#888",
        textAlign: "center",
      }}
    >
      <p>
        This email was sent to you because you requested a password reset on{" "}
        <a href="https://bill-e.org" style={{ color: "#3153AF" }}>
          bill-e.org
        </a>
        .
      </p>
    </footer>
  </div>
);
