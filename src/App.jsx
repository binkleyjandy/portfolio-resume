import { useState } from "react";

const PROJECTS = [
  {
    name: "Expert Interview Content Engine",
    tag: "CONTENT",
    summary: "Automatically convert expert interviews into ready-to-ship thought leadership content.",
    technical: [
      "Conduct and record (Fathom) 45 minute interview with a thought leader (AI helped create targeted questions based on their expertise)",
      "Uploaded in-depth prompts to AI that gave instructions on what to extract from the transcription",
      "Uploaded transcript, and AI would output Google Slides-ready content",
      "Add content to pre-built Slides template then export to PDF",
      "Convert interview recording into dozens of clips using OpusClip for channel promotion",
    ],
    tools: ["ChatGPT", "Fathom", "Google Slides", "OpusClip"],
    results: [
      "10 in-depth playbooks in 3 months (~1/week)",
      "AstraZeneca became a customer after seeing one of them in a Slack community",
    ],
    deployed: true,
  },
  {
    name: "Outbound-led Website Traffic Alert System",
    tag: "SIGNALS",
    summary: "When a contact receives an outbound email and then goes to the website, we send a Slack alert identifying that someone in a recent outbound campaign just came to the website.",
    technical: [
      "Create a table in Clay that has all your outbound contacts receiving emails (we used Smartlead)",
      "Create a second table in Clay that pushes web reveal traffic via webhook (we used Vector)",
      "Lookup Vector traffic against Smartlead contacts to determine if there's a match",
      "If there's a match, send Slack alert (via built in Clay connector) identifying that contact",
      "Manually decide whether to put the person in a higher intent Smartlead campaign or if someone would manually outreach to them (based on contact/account priority)",
    ],
    tools: ["Clay", "Smartlead", "Vector", "Slack", "ChatGPT"],
    results: [
      "Sales was able to prioritize who to reach out to in real-time",
      "Matched contacts had higher likelihood of converting into meeting",
      "Caveat: Match rates were low for us, so didn't get alerted much (maybe 1 every other day)",
    ],
    deployed: true,
  },
  {
    name: "Advisor/Investor Connection Alert System",
    tag: "SIGNALS",
    summary: "Anytime someone on our website is connected on LinkedIn to any of our investors, advisors, or employees, we send a Slack alert.",
    technical: [
      "Add all your advisors' and investors' (and anyone else's) LinkedIn connections to a Google sheet",
      "Setup a webhook and a Google Apps Script that takes in Vector traffic and adds it to a new sheet row",
      "Create functions that lookup if anyone is connected to them or anyone at their company",
      "Setup a Slack webhook that pushes connection data to a Slack channel"
    ],
    tools: ["Claude", "Vector", "Google Sheets", "Slack", "LinkedIn"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "Tested and confirmed it 100% works and would likely be a great source for high value intros",
    ],
    deployed: false,
  },
  {
    name: "Real-Time Content Enablement for Live Calls",
    tag: "AI AGENT",
    summary: "When a rep is talking to a prospect(s), if someone asks/mentions something and you have content to support it (eg. \"do you have any case studies in the construction industry?\"), it surfaces the content in real-time for the rep to reference and show.",
    technical: [
      "A Python script connects to Google Drive, downloads every file, and extracts raw text from PDFs, DOCX, PPTX, and Google Docs",
      "That text is split into chunks using content-type-aware strategies, with each chunk tagged with metadata like doc type, competitor names, and industry vertical",
      "Every chunk is converted into a 1,536-dimension vector by OpenAI's text-embedding-3-small model and stored in PostgreSQL via pgvector",
      "The rep either opens the web portal in a browser or launches the Electron app alongside Zoom, which begins capturing system audio",
      "The rep types a query in the portal, or Deepgram streams live audio into a rolling 30–45 second transcript buffer evaluated every 5 seconds",
      "The Intent Detection Engine runs keyword matching, a semantic shift check, and a conditional GPT-4o-mini call to confirm intent and generate a focused search query",
      "The query — typed or generated — is embedded using the same text-embedding-3-small model used at ingestion time",
      "pgvector runs a cosine similarity search against all stored chunks for that customer, applying metadata filters and returning the top results in under 150ms",
      "A single GPT-4o-mini call deduplicates results, assigns a relevance tag to each, and writes a 2–3 sentence explanation of why each result matches the query",
      "Up to 3 result cards are rendered in the portal or animated into the Electron sidebar, with every search and rep interaction logged to PostgreSQL",
    ],
    tools: ["Claude Code", "VS Code", "OpenAI", "Deepgram", "Python", "Next.js", "Vercel", "Railway", "Electron"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "Tested and confirmed it works at about 75% confidence; AI needs to be fine tuned for better matches",
    ],
    deployed: false,
  },
  {
    name: "LinkedIn Saved Posts Query Tool",
    tag: "TOOL",
    summary: "Run a query (prompt) or keyword search against your database of saved LinkedIn posts, and it will return the most relevant ones that match.",
    technical: [
      "Scrape LinkedIn saved posts in browser console into a JSON object",
      "Paste your scraped LinkedIn saved posts object into the app",
      "Filter posts instantly on the client side using exact keyword matching",
      "Or use AI Semantic Search for deeper queries which lets you prompt and then call GPT-4o to identify semantically relevant posts",
      "Matching posts are displayed as cards showing author, content, and any highlighted keywords",
    ],
    tools: ["Lovable", "LinkedIn", "ChatGPT", "OpenAI"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "I use it weekly to find valuable LinkedIn content that I need to reference",
    ],
    deployed: false,
  },
  {
    name: "Trade Show Meeting Booking App",
    tag: "TOOL",
    summary: "Lets event organizers schedule and coordinate meetings by managing people, locations, and time slots all in one place — preventing double-bookings and keeping everyone informed in real-time.",
    technical: [
      "Create an event and add the key details — the people attending (both your team and external guests) and the meeting rooms/locations available",
      "Use the \"Create Meeting\" button to book a meeting by picking a date, time, location, and who should attend",
      "The Calendar view shows all your people and locations side-by-side, so you can instantly see who's busy and which rooms are taken",
      "The Meetings List gives you a simple table of every scheduled meeting with all the details — click any meeting to see or edit it",
      "When a meeting is booked, it automatically appears on everyone's calendar and marks the location as occupied, so there are no double-bookings",
    ],
    tools: ["Lovable"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "Almost commercialized this, but didn't have interest in the enterprise trade show category",
    ],
    deployed: false,
  },
  {
    name: "HTML-Based Video Animation Tool",
    tag: "TOOL",
    summary: "Create animated product videos from a library of media animations and common product components that can be animated across a timeline to create an agency-level product video.",
    technical: [
      "Database (MongoDB) — Stores all your project data like videos, templates, branding, and uploaded assets",
      "Server (Express.js) — Handles requests between the React frontend, MongoDB database, and AWS S3 cloud storage",
      "Editor (React) — Visual drag-and-drop workspace for building video content using reusable branded components",
      "Media (Sharp + FFmpeg) — Sharp processes images on the server; FFmpeg handles video tasks in the browser",
    ],
    tools: ["Cursor", "ChatGPT"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "Almost commercialized this, but didn't find enough pull in the market",
    ],
    deployed: false,
  },
  {
    name: "Gmail → Slack Notification Agent",
    tag: "AUTOMATION",
    summary: "Automatically check Gmail every 5 minutes and send any new emails to a Slack channel.",
    technical: [
      "Create Google auth and connect to Gmail",
      "Create Slack webhook for specific channel",
      "Python script to retrieve new emails every 5 minutes",
      "Deploy to Railway server, so it can run when computer is asleep/off",
      "Get Slack alerts every 5 minutes if you have new emails",
    ],
    tools: ["Gmail (Auth)", "Slack (Webhook / API)", "Claude Code", "VS Code"],
    results: [
      "Didn't implement this at the business level, only as a side project",
      "Built in 30 minutes; confirmed it 100% works; use it daily",
    ],
    deployed: false,
  },
  {
    name: "Industry Network Intro Engine",
    tag: "SIGNALS",
    summary: "Input a prompt that asks something like \"does anyone know someone in the construction industry?\" that returns a list of investors, advisors, and employees that have at least 1 LinkedIn connection that matches the query.",
    technical: [
      "Get LinkedIn connection data into spreadsheet database",
      "Normalize company data to remove duplicates and funny characters",
      "Use DataForSEO SERP API to identify the domains for each company",
      "Crawl domain with Firecrawl, and identify industry with OpenAI based on website copy",
      "Layer AI layer on top of enriched connection database",
      "Query the database to find relevant connections across verticals",
    ],
    tools: ["DataForSEO", "Claude Code", "VS Code", "LinkedIn", "Google Sheets (Scripts)", "OpenAI"],
    results: [
      "Didn't implement this at the business level, only as a side project",
    ],
    deployed: false,
  },
];

const TIMELINE = [
  {
    role: "Head of Marketing",
    company: "Peel AI",
    period: "May 2025 – Dec 2025",
    sections: [
      {
        theme: "Ops / AI GTM",
        items: [
          "Developed repeatable AI-powered content system that turns expert interviews into industry playbooks in under 2 hours; created 10 playbooks; AstraZeneca became a customer after seeing one of them",
          "Built a custom \"LinkedIn connection tracker\" in Excel that identifies relevant connections across accounts from our advisory network; decreased time spent doing LinkedIn research by 95%",
          "Built dozens of AI automations across Clay, Smartlead, EmailBison, HubSpot, Slack, Vector, RB2B",
          "Set up custom Slack alerts for when outbound contacts viewed an email and went to the website; those contacts had higher likelihood of converting into meeting",
        ],
      },
      {
        theme: "Growth",
        items: [
          "Built out the referral program across our network; generated 20% conversion rates",
          "Added a low friction conversion element (\"Upload Your Document\") to website that resulted in 8% conversion rates",
          "Custom coded a single field form for the website that took conversion rates from 0.3% to 1.1%",
        ],
      },
      {
        theme: "Demand Gen",
        items: [
          "Built the outbound engine and hitting 3-5% positive response rates; wrote dozens of email variations at scale based on persona, industry and offer",
          "Wrote weekly newsletters that generated 30-40% open rates and 3-5% click throughs",
        ],
      },
      {
        theme: "Product Marketing",
        items: [
          "Brought new Talkables AI product to market in July that has become our core revenue driver",
        ],
      },
    ],
    footnote: "Sold primarily to B2B mid-market software companies",
  },
  {
    role: "Founder / CMO",
    company: "Tourial",
    period: "Aug 2019 – Oct 2024",
    subtitle: "0 → $1.5M ARR",
    sections: [
      {
        theme: "Ops / AI GTM",
        items: [
          "Implemented Warmly (AI marketing agent / website intent platform) to identify accounts on the website and automate outreach to them — resulted in dozens of \"day-of demos\"",
          "Implemented a lead routing system using Calendly and custom Javascript on website that allowed us to route by company size, territory, and time of day while still maintaining equal distribution and attribution tracking post demo request",
        ],
      },
      {
        theme: "Growth",
        items: [
          "Experimented with a \"manual\" free trial on the website that resulted in hundreds of net new self-serve requests in Q1; ultimately decided to sunset it because it became too manual, and we were moving up market",
          "Experimented with a growth campaign called \"See a demo on your website\" (using that copy as the CTA) which drove dozens of conversions; didn't drive enough pipeline though, so we sunset it after 1 month",
          "Experimented with a demo request page in which the background was a screenshot of the app to test the psychological impact of seeing the product during the form fill process; resulted in 10% increase in conversions",
        ],
      },
      {
        theme: "Demand Gen",
        items: [
          "Maintained a 6-10x pipeline to spend ratio each quarter; fluctuated a lot due to pricing changes, team changes, and increasing competitiveness of the category",
          "Implemented an automated outbound process using Apollo to drive top funnel awareness and quick interest in the product — resulted in our first $500,000 ARR in 12 months while selling deals worth $15k - $25k ARR",
          "Created the State of the B2B Buyer report that emphasized the website and further established our brand as the website experts, drove dozens of webinar attendees, and brought in over $50,000 in pipeline while only spending $2,000 on survey incentives",
          "Built strong awareness in the market at conferences without sponsoring them; average pipeline ROI from each event was 900%",
          "Experimented with dozens of LinkedIn ad variations and persona/account targeting that resulted in click through rates over 1% (very competitive) and CPCs under $5",
          "Engaged industry influencers/experts to promote a large product release (Demo Centers) on their LinkedIn accounts that resulted in numerous net new demos sourced from their accounts",
        ],
      },
      {
        theme: "Product Marketing",
        items: [
          "Developed strong POV around website use-case that heavily strengthened our competitive deals",
          "Ideated, created, and executed on almost every aspect of the Tourial.com website — copy, design, graphics, demos, content (all built on Webflow)",
        ],
      },
      {
        theme: "Management / Leadership",
        items: [
          "Managed over 30 people across 3.5 years, as many as 7 people at once for 6 months before hiring leaders; broad experience managing multiple departments including marketing, sales, customer success, product, and engineering",
          "Co-ran (with CEO) weekly all-hands, weekly sales & marketing KOs, quarterly town halls and quarterly board meetings",
          "Guest speaker on numerous highly attended virtual events including Demand (Metadata's annual event) and The Juice (now AudiencePlus) State of Gated vs Ungated Content",
          "Managed (and sourced) 10+ agencies, consultants, and outsourced freelancers to support marketing and GTM goals",
        ],
      },
    ],
    footnote: "Sold primarily to B2B mid-market software companies",
  },
  {
    role: "Sr. Performance Marketing Manager",
    company: "Gather Technologies",
    period: "Aug 2014 – Aug 2017",
    subtitle: "$4M → $11M ARR",
    sections: [
      {
        theme: "Ops / AI GTM",
        items: [
          "Built company-wide BI dashboards in Grow, improving GTM decision-making and revenue tracking",
        ],
      },
      {
        theme: "Growth",
        items: [
          "Owned and managed the UX and CRO strategy on the Gather (now Tripleseat) website — all built on WordPress",
          "Implemented one of the first Interactive Demos in the SaaS industry at the time that drove 25% increase in conversions and closed multiple sales deals without the prospect asking for a demo",
        ],
      },
      {
        theme: "Demand Gen",
        items: [
          "Managed $1M+ annually in marketing spend",
          "Owned PPC & digital strategy, increasing inbound leads by ~40%",
          "Generated $600K pipeline from a $10K direct mail campaign",
          "Created targeted landing pages for specific industries to target both paid and organic keywords that drove conversion rates up over 300% after 1 month",
        ],
      },
    ],
    footnote: "Sold to restaurants and venues (SMB and mid-market)",
  },
  {
    role: "Marketing Manager (SEO, PPC)",
    company: "Response Mine Interactive",
    period: "Aug 2017 – Aug 2019",
    subtitle: "$4M → $8M ARR",
    sections: [
      {
        theme: "Growth",
        items: [
          "Developed expertise in CRO, analytics, and web development",
        ],
      },
      {
        theme: "Demand Gen",
        items: [
          "Managed 10+ clients and advised on SEO / PPC strategy",
        ],
      },
    ],
  },
];

const EDUCATION = [
  { name: "Indiana University", detail: "Marketing & Advertising", year: "'09–'14" },
  { name: "Georgia Tech", detail: "Data Science & Analytics", year: "'18–'19" },
  { name: "Pavilion School", detail: "CMO School", year: "'23" },
];

const TOOLS = [
  "Claude Code", "Claude Cowork", "OpenAI", "ChatGPT", "DataForSEO", "VS Code", "Vercel", "v0",
  "Lovable", "Vector", "RB2B", "Warmly", "Deepgram", "React.js", "LinkedIn Sales Navigator",
  "Apollo", "Salesloft", "Outreach", "Chili Piper", "Clay", "Smartlead", "HubSpot", "LeadMagic",
  "Salesforce", "Marketo", "Drift", "Unbounce", "GA4", "Calendly", "Figma", "Google Ads",
  "LinkedIn Ads", "Webflow", "WordPress", "Framer", "Amplitude", "Cursor", "Gong", "Fathom",
  "Python", "Next.js", "Railway", "Slack", "Zoom", "Granola", "Canva", "Photoshop", "Adobe Suite",
  "Excel / Sheets", "PowerPoint / Slides", "ScreenStudio", "OpusClip", "Screaming Frog", "SEMrush",
  "Ahrefs", "Firecrawl", "Terminal / CLI", "Bing Ads", "Hotjar", "Microsoft Clarity", "Peel AI",
  "Tourial", "Navless.ai", "Intercom", "Reddit Ads", "Google Tag Manager", "Mailchimp", "Typeform",
  "Veed", "Wistia", "Bolt", "Seamless.AI", "Reveal", "Crossbeam", "Electron", "PostgreSQL / pgvector",
  "MongoDB", "Express.js", "AWS S3", "Google Slides", "Sharp", "FFmpeg", "Supabase", "GitHub",
  "Phantombuster", "EmailBison", "Zapier", "Make", "n8n", "Retool", "Tableau", "Loom", "Vidyard",
  "Descript", "FullStory", "G2", "Capterra", "Notion", "Airtable", "Smartsheet", "Carta",
];

/* ── Styles ── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { margin: 0; background: rgb(240, 236, 228); }
      ::selection { background: #222; color: #f0ece4; }
    `}</style>
  );
}

/* ── Accordion Row ── */
function AccordionRow({ title, right, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ borderBottom: "1px solid #c8c2b8" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 0",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 500, color: "#1a1714", textAlign: "left", lineHeight: 1.3, paddingRight: 24 }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {right && <span style={{ fontSize: 14, color: "#8a8278", fontWeight: 400 }}>{right}</span>}
          <span style={{ fontSize: 24, color: "#1a1714", fontWeight: 300, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: 32, animation: "fadeIn 0.3s ease-out" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Sub Row (for nested items like individual projects inside a section) ── */
function SubRow({ title, right, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: "1px solid #ddd8d0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0 18px 0",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1714", textAlign: "left" }}>
          {title}
        </span>
        <span style={{ fontSize: 14, color: "#8a8278", fontWeight: 400, textAlign: "right", flexShrink: 0, paddingLeft: 16 }}>
          {right}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 24, animation: "fadeIn 0.25s ease-out" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Project Detail ── */
function ProjectDetail({ project }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontSize: 14, color: "#5a5550", lineHeight: 1.7, marginBottom: 20 }}>
        {project.summary}
      </p>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8278", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
          Technical Breakdown
        </div>
        {project.technical.map((t, i) => (
          <div key={i} style={{ fontSize: 13, color: "#4a4440", lineHeight: 1.6, padding: "4px 0 4px 16px", borderLeft: "1px solid #ddd8d0" }}>
            {t}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8278", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
          Tools
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tools.map((t, i) => (
            <span key={i} style={{ fontSize: 12, color: "#5a5550", background: "#ede9e1", padding: "3px 10px", borderRadius: 4 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8278", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
          Results
        </div>
        <p style={{ fontSize: 13, color: "#4a4440", lineHeight: 1.6 }}>
          {project.results.map((r, i) => (
            <div key={i} style={{ padding: "4px 0 4px 16px", borderLeft: "1px solid #ddd8d0" }}>
              {r}
            </div>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function Portfolio() {
  const [tab, setTab] = useState("THINGS I'VE BUILT");
  const tabs = ["THINGS I'VE BUILT", "CAREER TIMELINE", "ABOUT ME"];

  return (
    <div style={{ minHeight: "100vh", background: "#f0ece4", fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <GlobalStyles />

      {/* ── Header ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "60px 32px 0" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#1a1714", marginBottom: 4 }}>
            Andy Binkley ~ AI GTM Builder
          </div>
          <div style={{ fontSize: 14, color: "#8a8278", lineHeight: 1.8 }}>
            Ponte Vedra Beach, FL · binkleyjandy@gmail.com ·{" "}
            <a href="https://linkedin.com/in/andy-binkley/" target="_blank" rel="noreferrer" style={{ color: "#8a8278", textDecoration: "underline", textUnderlineOffset: 3 }}>
              LinkedIn
            </a>
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div style={{ display: "flex", gap: 32, borderBottom: "1px solid #c8c2b8", marginBottom: 0 }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                color: tab === t ? "#1a1714" : "#b0a898",
                padding: "12px 0",
                cursor: "pointer",
                borderBottom: tab === t ? "1.5px solid #1a1714" : "1.5px solid transparent",
                marginBottom: -1,
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px 80px" }}>

        {/* ── PROJECTS TAB ── */}
        {tab === "THINGS I'VE BUILT" && (
          <div>
            {PROJECTS.map((p, i) => (
              <AccordionRow key={i} title={p.name} right={p.tag.toLowerCase()}>
                <ProjectDetail project={p} />
              </AccordionRow>
            ))}
          </div>
        )}

        {/* ── TIMELINE TAB ── */}
        {tab === "CAREER TIMELINE" && (
          <div>
            {TIMELINE.map((job, i) => (
              <AccordionRow
                key={i}
                title={`${job.role}, ${job.company}`}
                right={job.period}
              >
                {job.subtitle && (
                  <div style={{ fontSize: 14, color: "#8a8278", marginBottom: 20 }}>
                    {job.subtitle}
                  </div>
                )}
                {job.sections.map((section, si) => (
                  <div key={si} style={{ marginBottom: si < job.sections.length - 1 ? 24 : 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8278", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
                      {section.theme}
                    </div>
                    {section.items.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          fontSize: 14,
                          color: "#4a4440",
                          lineHeight: 1.6,
                          padding: "5px 0 5px 16px",
                          borderLeft: "1px solid #ddd8d0",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
                {job.footnote && (
                  <div style={{ fontSize: 13, color: "#b0a898", marginTop: 24, fontStyle: "italic" }}>
                    {job.footnote}
                  </div>
                )}
              </AccordionRow>
            ))}
          </div>
        )}

        {/* ── ABOUT ME TAB ── */}
        {tab === "ABOUT ME" && (
          <div>
            <AccordionRow title="About me" defaultOpen>
              <p style={{ fontSize: 15, color: "#4a4440", lineHeight: 1.7, maxWidth: 620 }}>
                I love combining my GTM and coding expertise into this new AI GTM world. I'm just as comfortable in an ads platform as I am in VS Code. I enjoy teaching people about technical GTM topics even more. Biggest strength is being able to solve nearly any operational business challenge without spending a lot (where my technical/coding knowledge comes in handy).
              </p>
              <p style={{ fontSize: 15, color: "#4a4440", lineHeight: 1.7, maxWidth: 620, marginTop: 16 }}>
                Previously engineered Tourial from 0-1, raised $6M, scaled to 20 employees.
              </p>
            </AccordionRow>

            <AccordionRow title="Education">
              {EDUCATION.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: i > 0 ? "1px solid #ddd8d0" : "none" }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1714" }}>{e.name} ({e.detail})</span>
                  <span style={{ fontSize: 14, color: "#8a8278" }}>{e.year}</span>
                </div>
              ))}
            </AccordionRow>

            <AccordionRow title="Tools & tech">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TOOLS.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      color: "#5a5550",
                      background: "#e8e3da",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </AccordionRow>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #c8c2b8", padding: "28px 32px", textAlign: "center", fontSize: 12, color: "#b0a898", fontFamily: "'DM Sans', sans-serif" }}>
        Built with Claude · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
