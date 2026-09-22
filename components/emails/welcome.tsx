import { Button, Text } from "@react-email/components";
import { EmailLayout, emailColors } from "@/components/emails/layout";

export function WelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl?: string }) {
  return (
    <EmailLayout
      preview="You're on the list."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text
        style={{
          color: emailColors.ink,
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: 600,
          margin: "0 0 16px",
        }}
      >
        You&apos;re on the list.
      </Text>
      <Text
        style={{
          color: emailColors.muted,
          fontSize: 15,
          lineHeight: "24px",
          margin: "0 0 24px",
        }}
      >
        New essays on AI systems, climate infrastructure, legal engineering,
        and protocol design land in your inbox as they&apos;re published.
      </Text>
      <Button
        href="https://operator.codes/essays"
        style={{
          backgroundColor: emailColors.mossButton,
          color: emailColors.buttonText,
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 999,
          padding: "12px 24px",
          textDecoration: "none",
        }}
      >
        Read the archive
      </Button>
    </EmailLayout>
  );
}
