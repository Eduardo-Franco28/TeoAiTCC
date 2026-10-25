import type useCreator from "../hooks/useCreator";
import { MAX_SUMS, TOTAL_OPTIONS } from "../hooks/useCreator";
import OptionGroup from "./OptionGroup";
import Stepper from "./Stepper";

interface SumFieldsProps {
  creator: ReturnType<typeof useCreator>;
}

export default function SumFields({ creator }: SumFieldsProps) {
  return (
    <>
      <p className="step-sub">O Teo sorteia contas diferentes dentro do limite que você escolher.</p>

      <div className="fields">
        <Stepper
          id="sum-count-label"
          label="Quantidade de contas"
          value={creator.sumCount}
          min={1}
          max={MAX_SUMS}
          onChange={creator.changeSumCount}
        />

        <OptionGroup
          id="sum-total-label"
          label="Resultado de cada conta"
          options={TOTAL_OPTIONS.map((total) => ({ value: total, label: `Até ${total}` }))}
          value={creator.maxTotal}
          onChange={creator.setMaxTotal}
        />
      </div>
    </>
  );
}
