import { useCallback, useEffect, useRef, useState } from "react";
import { SURVEY_QUESTIONS } from "../data/survey";
import type { SurveyAnswer } from "../types";

type Message = {
  id: string;
  role: "guide" | "user";
  text: string;
};

type Props = {
  onComplete: (answers: SurveyAnswer[]) => void;
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function WelcomeChat({ onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [finished, setFinished] = useState(false);
  const [customText, setCustomText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  const addGuideMessage = useCallback(async (text: string, showOptions = false) => {
    setTyping(true);
    setAwaitingAnswer(false);
    await delay(500 + Math.min(text.length * 6, 1000));
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "guide", text },
    ]);
    setTyping(false);
    if (showOptions) setAwaitingAnswer(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (awaitingAnswer) {
      setCustomText("");
      inputRef.current?.focus();
    }
  }, [awaitingAnswer, questionIndex]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void (async () => {
      await addGuideMessage(
        "Welcome to Tummy-Gotchi! 🌱 I'm your Tummy Guide — a little AI coach here to learn about your gut goals and hatch a pixel buddy just for you.\n\nWe'll chat through 5 quick questions. Pick an option or tell me in your own words."
      );
      await addGuideMessage(SURVEY_QUESTIONS[0].prompt, true);
    })();
  }, [addGuideMessage]);

  const submitAnswer = async (
    optionId: string,
    label: string,
    isCustom = false
  ) => {
    if (typing || finished || !awaitingAnswer) return;

    setAwaitingAnswer(false);
    setCustomText("");
    const q = SURVEY_QUESTIONS[questionIndex];
    const newAnswer: SurveyAnswer = {
      questionId: q.id,
      optionId,
      label,
      isCustom,
    };
    const nextAnswers = [...answers, newAnswer];

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", text: label },
    ]);
    setAnswers(nextAnswers);

    if (q.followUp) {
      await addGuideMessage(q.followUp(label));
    }

    const nextIndex = questionIndex + 1;
    if (nextIndex >= SURVEY_QUESTIONS.length) {
      setFinished(true);
      await addGuideMessage(
        "✨ Analyzing your answers… matching goals… stitching pixels…"
      );
      await delay(1400);
      onComplete(nextAnswers);
      return;
    }

    setQuestionIndex(nextIndex);
    await addGuideMessage(SURVEY_QUESTIONS[nextIndex].prompt, true);
  };

  const handleOption = (optionId: string, label: string) => {
    void submitAnswer(optionId, label);
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = customText.trim();
    if (!trimmed) return;
    void submitAnswer("custom", trimmed, true);
  };

  const currentQuestion = SURVEY_QUESTIONS[questionIndex];

  return (
    <div className="welcome-chat">
      <header className="welcome-chat__header">
        <span className="welcome-chat__avatar">🤖</span>
        <div>
          <h1>Tummy Guide</h1>
          <p>
            Question {Math.min(questionIndex + 1, 5)} of 5
            <span className="welcome-chat__dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={
                    i < answers.length
                      ? "dot dot--done"
                      : i === questionIndex && !finished
                        ? "dot dot--active"
                        : "dot"
                  }
                />
              ))}
            </span>
          </p>
        </div>
      </header>

      <div className="welcome-chat__messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble bubble--${msg.role}`}>
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
        {typing && (
          <div className="bubble bubble--guide bubble--typing">
            <span className="typing-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {awaitingAnswer && currentQuestion && !finished && (
        <div className="welcome-chat__options">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="option-btn"
              onClick={() => handleOption(opt.id, opt.label)}
            >
              {opt.label}
            </button>
          ))}

          <div className="welcome-chat__custom">
            <span className="welcome-chat__custom-label">Or in your own words</span>
            <form className="custom-input-row" onSubmit={handleCustomSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="custom-input"
                placeholder="Type your answer…"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={200}
                aria-label="Custom answer"
              />
              <button
                type="submit"
                className="custom-submit"
                disabled={!customText.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {finished && (
        <p className="welcome-chat__hatching">Hatching your Tummy-Gotchi…</p>
      )}
    </div>
  );
}
