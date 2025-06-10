import React, { useState, useContext } from "react";
import Button from "../../components/Button";
import LinkDisplay from "../../components/LinkDisplay/index";
import { ThemeContext } from "../../ThemeContext";
import styles from "./Style.module.css";
import ThemeToggle from "../../components/ThemeToggle/index";

import { createChatInstance, LinkObjType } from "@chat-e2ee/service";


const App = () => {
  const [chatLink, setChatLink] = useState<LinkObjType>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode] = useContext(ThemeContext);

  const generateLink = async () => {
    if (loading) {
      return;
    }
    
    setLoading(true);
    try {
      const chate2ee = createChatInstance();
      const linkResp = await chate2ee.getLink();
      setChatLink(linkResp);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.linkGenerationPage}>
        <div
          className={`${styles.header}
          ${darkMode === true ? styles.darkModeHeader : styles.lightModeHeader}`}
        >
          🔐 Secure chat 
          <ThemeToggle />
        </div>
        <div className={`${styles.sectionDefault} ${!darkMode && styles.sectionDefaultLight}`}>
          <div className={styles.title}>
            Secure Chat : Temporary chat with AI based Dynamic keys for encryption.
          </div>
          <div className={styles.description}>
            <ul>
              <li>Worried that someone might go through your data, Worry no more !</li>
              <li>No login, no signup required.</li>
              <li>No tracker</li>
              <li>
                Your messages are <b>end-to-end</b> encrypted - technically impossible to read your
                messages by someone else.
              </li>
            </ul>
          </div>
          {!chatLink && (
            <div className={styles.linkGenerationBtnContainer}>
              <br />
              <Button
                label={loading?"Creating...":"Create chat link"}
                type="primary"
                onClick={generateLink}
                disabled={loading}
              />
            </div>
          )}
          {chatLink && (
            <div className={styles.captchaHeightSetter}>
              <LinkDisplay content={chatLink} />
            </div>
          )}
        </div>
        <div
          className={`${styles.sectionContribute} ${
            darkMode === true ? styles.sectionDefault : styles.sectionDefaultLight
          }`}
        >
          <div className={styles.title}>
          
              🔐 Secure Your Chats in 5 Simple Steps!
            {
              
          /* ❤️ The source-code is public on&nbsp;
            <a
              href="https://github.com/muke1908/chat-e2ee"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            , feel free to contribute!
          */
            }
          </div>  
          <div className={styles.description}>
                <ul>
                  <li>Join a Chat Room — Share a link and connect instantly.</li>

                  <li>AI Creates a Secret Key — A smart LSTM model generates a unique AES key just for your chat.</li>

                  <li>Encrypt Before Sending — Your message is scrambled into secret code before it leaves your device.</li>

                  <li>Send It Securely — The encrypted message flies safely across the web.</li>

                  <li>Decrypt on Arrival — Only your friend can unlock and read it.</li>

                  <li>💬 Result?</li>
                  <li>Private chats, zero snooping — like texting in invisibility mode. 🕵️‍♂️✨</li>
                </ul>
            </div>

          <div className={styles.title}>
          
            ✨ Team members:
  
          </div>  
          <div className={styles.description}>
                <ul>
                  <li>Venkatesh Badiger - 1MS22AD060</li>

                  <li>Neeraj Walasang - 1MS22AD037</li>

                  <li>Sneha Zimolson Paul - 1MS22AD056</li>

                  <li>Gokul Naik - 1MS22AD024</li>

                </ul>
            </div>    
          
        </div>
      </div>
    </>
  );
};

export default App;
