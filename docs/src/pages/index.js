import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.module.css';

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description="Akita official documentation site">
      <Helmet>
        <title>Akita | Reactive State Management</title>
        <meta name="description" content="Akita - A Reactive State Management Tailored-Made for JS Applications" />
      </Helmet>

      <header className="app-header">
        <div className="container">
          <div className="flex">
            <h1 className="hero__title">
              🔮 A <span className="c">Reactive</span> State Management Tailored-Made for <span className="c">JS Applications</span>
            </h1>
            <img src="img/akita.svg" />
          </div>

          <div className={styles.buttons}>
            <Link className={classnames('button button--outline button--secondary button--lg', styles.getStarted)} to={useBaseUrl('docs/store')}>
              GET STARTED
            </Link>
            <iframe src="https://ghbtns.com/github-btn.html?user=datorama&repo=akita&type=star&count=true&size=large"></iframe>
          </div>
        </div>
      </header>

      <div className="container arc">
        <img src="img/akita-arc.jpg" />
      </div>

      <div className="description">
        <div className="container">
          <p>
            Akita is a state management pattern, built on top of RxJS, which takes the idea of multiple data stores from Flux and the immutable updates from Redux, along with the concept of streaming
            data, to create the Observable Data Store model.
          </p>

          <p>
            Akita encourages simplicity. It saves you the hassle of creating boilerplate code and offers powerful tools with a moderate learning curve, suitable for both experienced and inexperienced
            developers alike.
          </p>

          <p>
            Akita is based on object-oriented design principles instead of functional programming, so developers with OOP experience should feel right at home. Its opinionated structure provides your
            team with a fixed pattern that cannot be deviated from.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
