interface EmailTemplateProps {
  confirmLink: string;
}

export const EmailTemplate = ({ confirmLink }: EmailTemplateProps) => (
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
      Thank you for signing up! Please confirm your email address by clicking
      the link below to complete your registration:
    </p>

    <p style={{ textAlign: "center" }}>
      <a
        href={confirmLink}
        style={{
          backgroundColor: "#3153AF",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Confirm your email
      </a>
    </p>

    <p>If you did not sign up for an account, please ignore this email.</p>

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
        This email was sent to you because you signed up on{" "}
        <a href="https://bill-e.org" style={{ color: "#3153AF" }}>
          bill-e.org
        </a>
        .
      </p>
    </footer>
  </div>
);
