import { MASCOT } from "../mascot";

interface StatusPanelProps {
  title: string;
  message: string;
  pose?: keyof typeof MASCOT;
}

export default function StatusPanel({ title, message, pose = "acenando" }: StatusPanelProps) {
  return (
    <main className="status-panel">
      <div className="main-glow" aria-hidden="true" />
      <div className="status-stage">
        <div className="stage-glow" />
        <img src={MASCOT[pose]} alt="" />
      </div>
      <h1>{title}</h1>
      <p>{message}</p>
    </main>
  );
}
