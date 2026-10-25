import { MASCOT } from "../mascot";

interface ToastProps {
  text: string | null;
}

export default function Toast({ text }: ToastProps) {
  if (!text) return null;

  return (
    <div className="toast" role="status">
      <img src={MASCOT.feliz} alt="" />
      <span>{text}</span>
    </div>
  );
}
