import { MASCOT } from "../mascot";

export default function Splash() {
  return (
    <div className="splash" role="status" aria-label="Abrindo o Teo">
      <div className="splash-glow" />
      <div className="splash-stage">
        <div className="stage-glow" />
        <img src={MASCOT.voando} alt="" />
      </div>
      <div className="splash-name text-gradient">Teo</div>
      <div className="splash-bar">
        <i />
      </div>
    </div>
  );
}
