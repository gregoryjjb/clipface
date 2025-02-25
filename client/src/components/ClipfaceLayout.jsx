/*
 * The base layout of the application
 */

import { useRouter } from "next/router";
import styled from "styled-components";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Header = styled.header`
  background-image: url(/img/header-background.jpg);
  background-size: 1920px auto;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ApplicationDiv = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  position: static;
`;

const Footer = styled.footer`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 33px;

  display: flex;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.07);
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-size: 0.8rem;

  i {
    position: relative;
    top: 1px;
    font-size: 1rem;
    margin-right: 2px;
  }

  a,
  a:hover,
  a:visited {
    padding: 6px;
    color: rgba(0, 0, 0, 0.75);
  }

  .dot {
    margin: 0px 4px;
  }
`;

export function ClipfaceLayout({
  children,
  authInfo = { status: "NOT_AUTHENTICATED" },
  pageName = null,
  pageTitle = null,
  pageSubtitle = null,
}) {
  const router = useRouter();
  const contentClassNames = ["container"];

  if (pageName) {
    contentClassNames.push(`page-${pageName}`);
  }

  const onSignOut = () => {
    logout().then((ok) => {
      if (ok) {
        router.push("/login");
      } else {
        alert("Failed to log out, please check your network connection");
      }
    });
  };

  return (
    <>
      <section className="hero is-dark">
        <Header className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <a className="navbar-item">
                  <h1 className="title is-4">
                    {publicRuntimeConfig.headerTitle}
                  </h1>
                </a>
              </div>
              <div className="navbar-menu">
                <div className="navbar-end">
                  {authInfo.status == "AUTHENTICATED" && (
                    <a className="navbar-item" onClick={onSignOut}>
                      Log out
                    </a>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </Header>

        {pageTitle && (
          <div className="hero-body">
            <div className="container has-text-centered">
              <p className="title">{pageTitle}</p>

              {pageSubtitle && <p className="subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
      </section>

      <ApplicationDiv className={contentClassNames.join(" ")}>
        {children}
      </ApplicationDiv>

      <Footer>
        <div className="container">
          <a href="https://github.com/Hubro/clipface" target="_blank">
            <i class="fab fa-github"></i> Clipface
          </a>
        </div>
      </Footer>
    </>
  );
}

export default ClipfaceLayout;

/**
 * Logs out through the API
 */
async function logout() {
  const response = await fetch("/api/logout", { method: "POST" });

  if (response.ok) {
    return true;
  }

  console.error("Failed to log out", response);
  return false;
}
