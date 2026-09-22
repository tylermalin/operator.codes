import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

// Deliberately light, not the site's dark ink shell. Email clients
// vary wildly in dark-mode and custom-font support (Outlook desktop
// especially), so this uses a conservative light layout in the
// site's own paper tone plus a system font stack, rather than
// porting the dark theme and hoping it survives Gmail/Outlook/Apple
// Mail intact. Colors are pulled directly from app/globals.css's
// :root tokens, not approximated.
//
// The logo asset is the dark-stroke original (public/brand/
// operator-logo.png), not the light-surface-inverted variant built
// for the dark site nav — that inversion exists for a dark
// background and would be invisible here.

const colors = {
  pageBg: "#f4f2ed",
  cardBg: "#ffffff",
  ink: "#121113",
  muted: "#5b584f",
  faint: "#8c897f",
  border: "#e5e2d9",
  mossButton: "#5c9678",
  buttonText: "#0a0a0b",
};

export function EmailLayout({
  preview,
  children,
  unsubscribeUrl,
}: {
  preview: string;
  children: ReactNode;
  unsubscribeUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.pageBg,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "40px 16px",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            maxWidth: 480,
            margin: "0 auto",
            padding: "36px 32px",
          }}
        >
          <Img
            src="https://operator.codes/brand/operator-logo.png"
            alt="Operator"
            height="28"
            style={{ height: 28, width: "auto", marginBottom: 28 }}
          />

          {children}

          <Hr style={{ borderColor: colors.border, margin: "32px 0 20px" }} />

          <Text style={{ color: colors.faint, fontSize: 12, lineHeight: "18px", margin: 0 }}>
            operator.codes · Tyler Malin
            {unsubscribeUrl && (
              <>
                {" · "}
                <Link href={unsubscribeUrl} style={{ color: colors.faint }}>
                  Unsubscribe
                </Link>
              </>
            )}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export { colors as emailColors };
