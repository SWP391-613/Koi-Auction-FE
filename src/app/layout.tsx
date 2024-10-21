import { Metadata } from "next";
import "../index.scss";

export const metadata: Metadata = {
  title: "React App",
  description: "Web site created with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  <html lang="en">
    <body>
      <div id="root">{children}</div>
    </body>
  </html>;
}
