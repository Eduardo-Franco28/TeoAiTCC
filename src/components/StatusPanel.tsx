import teoAvatar from "../assets/teo.png";

interface StatusPanelProps {
  title: string;
  message: string;
}

export default function StatusPanel({ title, message }: StatusPanelProps) {
  return (
    <main className="status-panel">
      <img src={teoAvatar} alt="" />
      <h1>{title}</h1>
      <p>{message}</p>
    </main>
  );
}
