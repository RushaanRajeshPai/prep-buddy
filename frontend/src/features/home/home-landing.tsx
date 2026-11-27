"use client";
import Link from "next/link";
import { useAccount } from "@/features/auth/use-account";
import { ArrowDown, ArrowRight, MessageSquare, Users } from "lucide-react";

export function HomeLanding() {
  const account = useAccount();
  const exploreHref = account ? "/dashboard" : "/register";
  return (
    <main id="main-content">
      <section className="page-shell hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-rule" aria-hidden="true" /> A little
            practice. A clearer voice.
          </p>
          <h1 id="hero-heading">
            Practice before
            <br /> the real <em>interview.</em>
          </h1>
          <p className="hero-description">
            You have something to say. Find the words to say it well. A space
            for students and job aspirants to prepare for interviews and group
            discussions.
          </p>
          <div className="hero-actions">
            <Link href={exploreHref} className="button">
              Explore PrepBuddy <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className="text-link">
              See how it works <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="availability-note">
            A first look at PrepBuddy. Practice sessions are being built.
          </p>
          <div className="hero-footnote">
            <span aria-hidden="true">01 /</span> Not perfect answers. Better
            conversations.
          </div>
        </div>
        <div className="example-wrap">
          <div className="example-caption">
            <span>THE PRACTICE NOTEBOOK</span>
            <span>Interview / 01</span>
          </div>
          <article
            className="conversation-example"
            aria-labelledby="example-heading"
          >
            <div className="example-heading">
              <div className="example-icon">
                <MessageSquare size={20} aria-hidden="true" />
              </div>
              <div>
                <h2 id="example-heading">Start with your story.</h2>
                <p>Static example, not a live session.</p>
              </div>
            </div>
            <div className="conversation-line">
              <span className="speaker-label">INTERVIEWER</span>
              <p>
                Tell me about a time you had to learn something from scratch.
              </p>
            </div>
            <div className="conversation-line response">
              <span className="speaker-label">YOUR ANSWER · EXAMPLE</span>
              <p>
                For our final-year project, I needed to build an API. I broke it
                into smaller tasks, asked for feedback, and kept improving each
                week.
              </p>
            </div>
            <div className="notebook-feedback">
              <p className="speaker-label">A NOTE TO TAKE WITH YOU</p>
              <p>
                A clear beginning. Now add the outcome: what changed because of
                your work?
              </p>
            </div>
            <div className="example-bottom">
              <span>Reflect. Refine. Try again.</span>
              <ArrowRight size={17} aria-hidden="true" />
            </div>
          </article>
          <p className="example-aside">
            Make room for the answer that sounds like <em>you.</em>
          </p>
        </div>
      </section>

      <section
        id="practice"
        className="practice-section"
        aria-labelledby="practice-heading"
      >
        <div className="page-shell">
          <div className="section-heading">
            <p className="eyebrow">FIND YOUR FOCUS</p>
            <h2 id="practice-heading">
              Two ways to prepare.
              <br />
              <span>One more confident you.</span>
            </h2>
            <p>
              Different conversations call for different skills. Get to know the
              practice paths we’re building.
            </p>
          </div>
          <div className="practice-paths">
            <article id="interview-practice" className="practice-path">
              <div className="path-top">
                <span className="path-number">01 / ONE TO ONE</span>
                <MessageSquare size={23} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>Interview practice</h3>
              <p>
                Learn to turn your experiences into clear, thoughtful
                answers—from your first introduction to the follow-up you didn’t
                expect.
              </p>
              <ul>
                <li>Shape your story</li>
                <li>Think through follow-up questions</li>
                <li>Reflect on your answers</li>
              </ul>
              <span className="path-status">Planned practice path</span>
            </article>
            <article id="group-discussions" className="practice-path">
              <div className="path-top">
                <span className="path-number">02 / THINK TOGETHER</span>
                <Users size={23} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>Group discussions</h3>
              <p>
                Prepare to share a point of view, listen to other perspectives,
                and move a conversation forward without talking over it.
              </p>
              <ul>
                <li>Build a reasoned argument</li>
                <li>Respond to different viewpoints</li>
                <li>Make your contribution count</li>
              </ul>
              <span className="path-status">Planned practice path</span>
            </article>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="page-shell how-section"
        aria-labelledby="how-heading"
      >
        <div className="how-intro">
          <p className="eyebrow">THE IDEA IS SIMPLE</p>
          <h2 id="how-heading">
            Confidence is
            <br />a practice.
          </h2>
          <p>
            Not a script to memorise. A habit of showing up, giving it a go, and
            noticing what you can do better.
          </p>
          <p className="availability-note">
            The experience below is our planned practice flow.
          </p>
        </div>
        <ol className="steps">
          <li>
            <span className="step-number">01</span>
            <div>
              <h3>Choose your conversation</h3>
              <p>
                An interview or a group discussion. Start with the skill you
                want to work on.
              </p>
            </div>
          </li>
          <li>
            <span className="step-number">02</span>
            <div>
              <h3>Give your answer a voice</h3>
              <p>
                Work through a prompt in your own words. Let your thinking take
                shape.
              </p>
            </div>
          </li>
          <li>
            <span className="step-number">03</span>
            <div>
              <h3>Take one thing forward</h3>
              <p>
                Reflect on what was clear, what needs work, and what you’ll try
                next time.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="closing-section">
        <div className="page-shell closing-inner">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h2>Start with a little preparation.</h2>
            <p>Create your account. Your next chapter starts here.</p>
          </div>
          <Link href={exploreHref} className="button">
            Explore PrepBuddy <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
