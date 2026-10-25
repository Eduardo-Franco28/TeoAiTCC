import { useEffect } from "react";
import type useCreator from "../hooks/useCreator";
import { GROUP_OPTIONS } from "../hooks/useCreator";
import OptionGroup from "./OptionGroup";

interface GroupsFieldsProps {
  creator: ReturnType<typeof useCreator>;
}

export default function GroupsFields({ creator }: GroupsFieldsProps) {
  useEffect(() => {
    if (creator.subjects.length === 0) creator.loadSubjects();
  }, [creator.subjects.length, creator.loadSubjects]);

  return (
    <>
      <p className="step-sub">Diga o tema e o Teo monta os grupos e os itens com emoji.</p>

      <div className="fields">
        <label className="field">
          <span>Tema</span>
          <input
            className="input"
            value={creator.groupsTheme}
            maxLength={120}
            placeholder="Ex.: animais da terra e do mar"
            onChange={(event) => creator.setGroupsTheme(event.target.value)}
          />
        </label>

        {creator.subjects.length > 0 ? (
          <OptionGroup
            id="groups-subject-label"
            label="Matéria"
            options={creator.subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
            value={creator.subjectId}
            onChange={creator.setSubjectId}
          />
        ) : (
          <p className="muted">Carregando matérias...</p>
        )}

        <OptionGroup
          id="groups-count-label"
          label="Quantidade de grupos"
          options={GROUP_OPTIONS.map((amount) => ({ value: amount, label: `${amount} grupos` }))}
          value={creator.groupCount}
          onChange={creator.setGroupCount}
        />

        <OptionGroup
          id="groups-items-label"
          label="Itens em cada grupo"
          options={GROUP_OPTIONS.map((amount) => ({ value: amount, label: `${amount} itens` }))}
          value={creator.itemCount}
          onChange={creator.setItemCount}
        />
      </div>
    </>
  );
}
