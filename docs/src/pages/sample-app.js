import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

function SampleApp() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const iframeStyle = {
    width: "100%",
    height: "100vh",
    marginLeft: 0,
  };
  return (
    <Layout
      title={siteConfig.title}
      description="Akita official documentation site"
    >
      <main>
        <iframe
          src="https://akita.surge.sh/"
          width="100%"
          frameBorder="0"
          style={iframeStyle}
        ></iframe>
      </main>
    </Layout>
  );
}

export default SampleApp;
