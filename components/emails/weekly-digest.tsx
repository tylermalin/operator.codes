import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailLayout, emailColors } from "@/components/emails/layout";

export type DigestEssay = {
  title: string;
  description: string;
  url: string;
};

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  blurb: string;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "monospace",
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: emailColors.faint,
        margin: "0 0 12px",
      }}
    >
      {children}
    </Text>
  );
}

export function WeeklyDigest({
  dateRangeLabel,
  essays,
  newsItems,
  unsubscribeUrl,
}: {
  dateRangeLabel: string;
  essays: DigestEssay[];
  newsItems: NewsItem[];
  unsubscribeUrl?: string;
}) {
  return (
    <EmailLayout
      preview={
        essays.length > 0
          ? `New: ${essays[0].title}`
          : "This week's top news and insights"
      }
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading
        as="h1"
        style={{
          color: emailColors.ink,
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: 600,
          margin: "0 0 4px",
        }}
      >
        This week at Operator
      </Heading>
      <Text
        style={{
          color: emailColors.faint,
          fontSize: 13,
          margin: "0 0 28px",
        }}
      >
        {dateRangeLabel}
      </Text>

      {essays.length > 0 && (
        <Section style={{ marginBottom: 28 }}>
          <SectionLabel>New from Operator</SectionLabel>
          {essays.map((essay) => (
            <div key={essay.url} style={{ marginBottom: 16 }}>
              <Link
                href={essay.url}
                style={{
                  color: emailColors.ink,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {essay.title}
              </Link>
              <Text
                style={{
                  color: emailColors.muted,
                  fontSize: 14,
                  lineHeight: "21px",
                  margin: "4px 0 0",
                }}
              >
                {essay.description}
              </Text>
            </div>
          ))}
        </Section>
      )}

      {newsItems.length > 0 && (
        <Section>
          <SectionLabel>Top news and insights</SectionLabel>
          {newsItems.map((item) => (
            <div key={item.url} style={{ marginBottom: 16 }}>
              <Link
                href={item.url}
                style={{
                  color: emailColors.ink,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {item.title}
              </Link>
              <Text
                style={{
                  color: emailColors.faint,
                  fontSize: 12,
                  margin: "2px 0 4px",
                }}
              >
                {item.source}
              </Text>
              <Text
                style={{
                  color: emailColors.muted,
                  fontSize: 14,
                  lineHeight: "21px",
                  margin: 0,
                }}
              >
                {item.blurb}
              </Text>
            </div>
          ))}
        </Section>
      )}
    </EmailLayout>
  );
}
